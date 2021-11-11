const fs = require('fs');
const SchoolDays = require('../../models/SchoolDays');

const getFullDay = (day) => {
    switch(day) {
        case 'Mon': return 'Monday';
        case 'Tues': return 'Tuesday';
        case 'Wed': return 'Wednesday';
        case 'Thurs': return 'Thursday';
        case 'Fri': return 'Friday';
        default: break;
    }
}

const getMonth = (month) => {
    switch(month) {
        case 0: return 'January';
        case 1: return 'February';
        case 2: return 'March';
        case 3: return 'April';
        case 4: return 'May';
        case 5: return 'June';
        case 6: return 'July'
        case 7: return 'August';
        case 8: return 'September';
        case 9: return 'October';
        case 10: return 'November';
        case 11: return 'December'
    }
}

const getWeekDay = (day) => {
    switch(day) {
        case 0: return 'Sunday';
        case 1: return 'Monday';
        case 2: return 'Tuesday';
        case 3: return 'Wednesday';
        case 4: return 'Thursday';
        case 5: return 'Friday';
        case 6: return 'Saturday';
        default: break;
    }
}


module.exports = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile('assets/clubs/clubs.csv', 'utf8', async (err, data) => {
            const clubArray = data.split(/\r?\n/);
    
            const clubs = clubArray.map(club => {
                const clubArrayInfo = club.split(',');
                return {
                    name: clubArrayInfo[0],
                    day: getFullDay(clubArrayInfo[1]),
                    time: clubArrayInfo[2],
                    location: clubArrayInfo[3] || ''
                }
            });
    
            let unparsedDate = new Date();
            let date = unparsedDate.getDate();
            let month = getMonth(unparsedDate.getMonth());
            let year = unparsedDate.getFullYear();
            let weekDay = getWeekDay(unparsedDate.getDay());
    
            const schoolDays = await SchoolDays.find({});
            let schoolDay= schoolDays.find(schoolDay => schoolDay.day.substring(8) === `${weekDay}, ${month} ${date}`);
            while (!schoolDay) {
                unparsedDate.setDate(unparsedDate.getDate() + 1);
                date = unparsedDate.getDate();
                month = getMonth(unparsedDate.getMonth());
                year = unparsedDate.getFullYear();
                weekDay = getWeekDay(unparsedDate.getDay());
                schoolDay = schoolDays.find(schoolDay => schoolDay.day.substring(8) === `${weekDay}, ${month} ${date}`);
            }
    
            const getClubs = clubs.filter(club =>  club.day === weekDay);
            console.log(getClubs);
            resolve(getClubs);
        });
    })
    
}