const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const Users = require('../models/Users');

const TOKEN_PATH = 'tokens.json';

const SCOPES = [
    'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
    'https://www.googleapis.com/auth/classroom.courses.readonly'
];

module.exports = async (req, res) => {
    
    await fs.readFile('assets/credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Classroom API.
        const token = req.query.state ? req.query.state : req.cookies['token'];
        authorize(JSON.parse(content), token, async (auth) => {
            const classroom = google.classroom({version: 'v1', auth});
            
            const response = await classroom.courses.list();
            if (!res) {
                return;
            }
            const courses = response.data.courses;
            const assignments = [];
            if (courses && courses.length) {
                for (const course of courses) {
                    if (course.courseState !== 'ACTIVE') {
                        continue;
                    }
                    const n = course.id;
                    try {
                        const response = await classroom.courses.courseWork.list({ courseId: n });
                        const { courseWork } = response.data;
                        if (!courseWork) {
                            return;
                        }
                        courseWork.forEach(work => {
                            const { title, dueDate, dueTime } = work;
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
                                    dueTime
                                });
                                console.log(assignments[assignments.length - 1]);
                            }
                        });
                    } catch(e) {
                        console.log('rip');
                        continue;
                    }
                }

            } else {
              console.log('No courses found.');
            }
            // console.log(assignments);
            // return res.render('classroom');
        });
    });

};

function authorize(credentials, authToken, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]
    );
  
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, authToken, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
}

function getNewToken(oAuth2Client, authToken, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: authToken
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

async function listCourses(auth) {

}