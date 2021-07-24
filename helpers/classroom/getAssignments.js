const {google} = require('googleapis');
const Users = require('../../models/Users');

const SCOPES = [
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
    'https://www.googleapis.com/auth/classroom.courses.readonly'
];

module.exports = async (req, res) => {
    const content = {
        "web": {
            "client_id":"665999096135-8onhd9jfj6f6rj4qid16s9j6qnqumf55.apps.googleusercontent.com",
            "project_id":"bb-hub-319503",
            "auth_uri":"https://accounts.google.com/o/oauth2/auth",
            "token_uri":"https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
            "client_secret":"lb40rdtN_46sKpNE-rTl-y1_",
            "redirect_uris":["http://localhost:3000","http://localhost:3000/classroom","http://localhost:3000/?assignments=true"],
            "javascript_origins":["http://localhost:3000"]
        }
    };
    const token = req.query.state ? req.query.state : req.cookies['token'];
    const user = await Users.findById(req.user._id);
    return new Promise((resolve, reject) => {
        authorize(content, req.query.code, res, user, token, reject, async (auth) => {
            try {
                const { code } = req.query;
                if (code && !auth.credentials) {
                    const scopes = req.query.scope.split(' ');
                    if (scopes.length <= 1) {
                        reject(getNewToken(auth, token));
                    }
                    const { tokens } = await auth.getToken(code);
                    auth.setCredentials(tokens);
                }
                const classroom = google.classroom({version: 'v1', auth});
                const response = await classroom.courses.list({
                    courseStates: 'ACTIVE',
                    pageSize: 5,
                    pageToken: req.query.nextPageToken
                });
                const { courses, nextPageToken } = response.data;
                const assignments = [];
                if (courses.length) {
                    for (const course of courses) {
                        try {
                            const response = await classroom.courses.courseWork.list({ 
                                courseId: course.id,
                                orderBy: 'dueDate asc',
                                fields: 'courseWork.id,courseWork.title,courseWork.dueDate,courseWork.dueTime,courseWork.alternateLink,courseWork.maxPoints',
                            });
                            const { courseWork } = response.data;
                            if (!courseWork.length) {
                                return;
                            }
                            for (const work of courseWork) {
                                const { title, dueDate, id: courseWorkId, dueTime, alternateLink: link, maxPoints  } = work;
                                if (!dueDate) {
                                    return;
                                }
                                const currentDate = new Date();
                                let courseWorkDueDate;
                                if (dueTime.hours && dueTime.minutes) {
                                    courseWorkDueDate = new Date(Date.UTC(dueDate.year, dueDate.month - 1, dueDate.day, dueTime.hours, dueTime.minutes));
                                } else if (dueTime.hours) {
                                    courseWorkDueDate = new Date(Date.UTC(dueDate.year, dueDate.month - 1, dueDate.day, dueTime.hours));
                                } else {
                                    courseWorkDueDate = new Date(Date.UTC(dueDate.year, dueDate.month - 1, dueDate.day));
                                }
                                if (courseWorkDueDate >= currentDate) {
                                    const courseWorkResponse = await classroom.courses.courseWork.studentSubmissions.list({ 
                                        courseId: course.id,
                                        courseWorkId,
                                        states: ['CREATED', 'TURNED_IN', 'RECLAIMED_BY_STUDENT']
                                    });
                                    const state = courseWorkResponse.data.studentSubmissions[0].state;
                                    assignments.push({
                                        name: course.name,
                                        title,
                                        courseWorkDueDate,
                                        link,
                                        maxPoints,
                                        state
                                    });
                                }
                            }
                        } catch(e) {}
                    }
                    assignments.sort((a, b) => {
                        return a.courseWorkDueDate - b.courseWorkDueDate;
                    })
                    resolve({
                        assignments,
                        nextPageToken
                    });
                }
            } catch (e) {
                const url = getNewToken(auth, token);
                reject(url);
            }
        });
    });
};

const authorize = async (credentials, code, res, user, authToken, reject, callback) => {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
    );
    oAuth2Client.on('tokens', async (tokens) => {
        if (tokens.refresh_token) {
          // store the refresh_token in my database!
            user.googleRefreshToken = tokens.refresh_token;
            await user.save();
        }
    });
    if (user.googleRefreshToken) {
        try {
            oAuth2Client.credentials = { refresh_token: user.googleRefreshToken };
            return callback(oAuth2Client);
        } catch (e) {
            return getNewToken(oAuth2Client, authToken);
        }
    }
    if (!code) {
        const url = getNewToken(oAuth2Client, authToken);
        return reject(url);
    }
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    callback(oAuth2Client);
};

const getNewToken = async (oAuth2Client, authToken) => {
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: authToken
    });
};