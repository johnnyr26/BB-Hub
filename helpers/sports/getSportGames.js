const axios = require('axios');

module.exports = async () => {
    const response = await axios.get('https://calendar.instone.com/get.php?cal=f83bf7c0-6eaa-11e4-a95f-fefd42e427e7&offset=0&limit=1000');
    return response.data.filter(event => event.teamNames[0] !== 'M' && event.Status === 'Confirmed').map(event => {
        return {
            sport: event.teamNames,
            opponent: event.Opponent,
            month: event.MonthName,
            day: event.StartDay,
            year: event.Year,
            time: event.Time,
            location: event.LocationName
        }
    });
};