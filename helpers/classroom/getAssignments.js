const {google} = require('googleapis');
const Users = require('../../models/Users');

const SCOPES = [
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
    'https://www.googleapis.com/auth/classroom.courses.readonly'
];

const sortAssignments = assignments => {
    const notCompletedAssignments = assignments.filter(assignment => assignment.state === 'CREATED' || assignment.state === 'RECLAIMED_BY_STUDENT');
    const completedAssignments = assignments.filter(assignment => assignment.state === 'TURNED_IN');

    notCompletedAssignments.sort((a, b) => {
        return a.courseWorkDueDate - b.courseWorkDueDate;
    });
    completedAssignments.sort((a, b) => {
        return a.courseWorkDueDate - b.courseWorkDueDate;
    });

    for (let i = 0; i < assignments.length; i ++) {
        if (i < notCompletedAssignments.length) {
            assignments[i] = notCompletedAssignments[i];
        } else {
            assignments[i] = completedAssignments[notCompletedAssignments.length - i]
        }
    }
}

module.exports = async (req, res) => {
    
    const token = req.query.state ? req.query.state : req.cookies['token'];
    const user = await Users.findById(req.user._id);

    let auth;

    return new Promise(async (resolve, reject) => {
        try {
            const { code } = req.query;
            auth = await authorize(req.query.code, user, token);

            if (code) {
                const scopes = req.query.scope.split(' ');
                const notAllGoogleScopesApproved = scopes.length <= 1;
                if (notAllGoogleScopesApproved) {
                    reject(getNewToken(auth, token));
                }
            }

            const classroom = google.classroom({version: 'v1', auth});
            const classroomResponse = await classroom.courses.list({
                courseStates: 'ACTIVE',
                pageSize: 5,
                pageToken: req.query.nextPageToken
            });

            const { courses, nextPageToken } = classroomResponse.data;
            const assignments = [];

            if (!courses.length) {
                resolve({ assignments });
            }

            for (const course of courses) {
                const courseWorkResponse = await classroom.courses.courseWork.list({ 
                    courseId: course.id,
                    orderBy: 'dueDate asc',
                    fields: 'courseWork.id,courseWork.title,courseWork.dueDate,courseWork.dueTime,courseWork.alternateLink,courseWork.maxPoints',
                });
                const { courseWork } = courseWorkResponse.data;
                if (!courseWork || !courseWork.length) {
                    continue;
                }
                for (const work of courseWork) {

                    const { title, dueDate, id: courseWorkId, dueTime, alternateLink: link, maxPoints  } = work;

                    if (!dueDate) {
                        continue;
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
                    const oldAssignment = courseWorkDueDate < currentDate;

                    if (oldAssignment) {
                        continue;
                    }

                    const submissionResponse = await classroom.courses.courseWork.studentSubmissions.list({ 
                        courseId: course.id,
                        courseWorkId,
                        states: ['CREATED', 'TURNED_IN', 'RECLAIMED_BY_STUDENT']
                    });
                    const state = submissionResponse.data.studentSubmissions[0].state;
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

            sortAssignments(assignments);

            resolve({
                assignments,
                nextPageToken
            });
        } catch (e) {
            console.log(e.message);
            if (auth) {
                reject(getNewToken(auth, token));
            } else {
                reject(e);
            }
        }
    });
};

const authorize = async (code, user, authToken) => {
    return new Promise(async (resolve, reject) => {
        const credentials = {
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
    
        const {client_secret, client_id, redirect_uris} = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]
        );

        oAuth2Client.on('tokens', async tokens => {
            if (tokens.refresh_token) {
              // store the refresh_token in my database!
                user.googleRefreshToken = tokens.refresh_token;
                await user.save();
            }
        });

        if (code) {
            try {
                const { tokens } = await oAuth2Client.getToken(code);
                oAuth2Client.setCredentials(tokens);
                return resolve(oAuth2Client);
            } catch(e) {
                return reject(getNewToken(oAuth2Client, authToken));
            }
        }
    
        if (user.googleRefreshToken) {
            try {
                oAuth2Client.credentials = { refresh_token: user.googleRefreshToken };
                return resolve(oAuth2Client);
            } catch (e) {
                return reject(getNewToken(oAuth2Client, authToken));
            }
        }
        
        return reject(getNewToken(oAuth2Client, authToken));
    });
};

const getNewToken = async (oAuth2Client, authToken) => {
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: authToken
    });
};