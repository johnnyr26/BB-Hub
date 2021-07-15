const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const axios = require('axios');

const Users = require('../models/Users');

const SCOPES = [
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
    'https://www.googleapis.com/auth/classroom.courses.readonly'
];

module.exports = async (req, res) => {
    await fs.readFile('assets/credentials.json', async (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Classroom API.
        const token = req.query.state ? req.query.state : req.cookies['token'];
        const user = await Users.findById(req.user._id);
        authorize(JSON.parse(content), req, res, user, token, async (auth) => {
            try {
                const classroom = google.classroom({version: 'v1', auth});
                const response = await classroom.courses.list({
                    courseStates: 'ACTIVE',
                    pageSize: 5
                });
                const { courses, nextPageToken } = response.data;
                const courseNames = courses.map(course => course.name);
                const assignments = [];
                if (courses.length) {
                    for (const course of courses) {
                        try {
                            const response = await classroom.courses.courseWork.list({ 
                                courseId: course.id,
                                orderBy: 'dueDate asc',
                                fields: 'courseWork.title,courseWork.dueDate,courseWork.dueTime,courseWork.alternateLink,courseWork.maxPoints',
                            });
                            const { courseWork } = response.data;
                            if (!courseWork.length) {
                                return;
                            }
                            courseWork.forEach(work => {
                                const { title, dueDate, dueTime, alternateLink: link, maxPoints  } = work;
                                if (!dueDate) {
                                    return;
                                    
                                }
                                const todayDate = new Date();
                                const courseWorkDueDate = new Date(dueDate.year, dueDate.month - 1, dueDate.day);
                                if (courseWorkDueDate >= todayDate) {
                                    assignments.push({
                                        name: course.name,
                                        title,
                                        dueDate,
                                        dueTime,
                                        link,
                                        maxPoints
                                    });
                                }
                            });
                        } catch(e) {}
                    }
                    return res.render('classroom', { assignments });
                }
            } catch (e) {
                return getNewToken(auth, res, user, token);
            }
        });
    });
};

const authorize = async (credentials, req, res, user, authToken, callback) => {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[1]
    );
    oAuth2Client.on('tokens', async (tokens) => {
        if (tokens.refresh_token) {
          // store the refresh_token in my database!
            user.googleTokens = tokens;
            await user.save();
        }
    });
    if (user.googleTokens.refresh_token) {
        try {
            oAuth2Client.credentials = { refresh_token: user.googleTokens.refresh_token };
            return callback(oAuth2Client);
        } catch (e) {
            return getNewToken(oAuth2Client, res, user, authToken);
        }
    }
    const code = req.query.code;
    if (!code) {
        return getNewToken(oAuth2Client, res, user, authToken);
    }
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    callback(oAuth2Client);
}

const getNewToken = async (oAuth2Client, res, user, authToken) => {
    const authURL = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: authToken
    });
    user.googleTokens = {};
    await user.save();
    return res.redirect(authURL);
}