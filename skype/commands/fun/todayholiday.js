var HolidayAPI = require('node-holidayapi');
var hapi = new HolidayAPI(process.env.HOLIDAY_API_KEY).v1;
var moment = require('moment');

module.exports = function(session) {
    var parameters = {
    // Required
    country: 'US',
    year:    new Date().getFullYear(),
    // Optional
    month:    new Date().getMonth() + 1,
    day:      new Date().getDate(),
    // previous: true,
    // upcoming: true,
    public:   false,
    // pretty:   true,
    };

    hapi.holidays(parameters, function (err, data) {
        if(data.status !== 200)
            return session.send("Bad request to holidays...");

        if(data.holidays.length == 0)
            return session.send("There are no holidays today, " + moment().format('LL'));
        
        var plural = data.holidays.length > 1;
        session.send(moment().format('LL') + "has " + data.holidays.length + " " + (plural ? "holidays" : "holiday"));
        var holidaysMessage = '';
        data.holidays.forEach(function(holiday, index) {
            holidaysMessage += holiday.name;

            if(data.holidays.length != (index + 1))
                holidaysMessage += "\n";
        });
        
        session.send(holidaysMessage);
    });
}