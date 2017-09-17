var request = require('request');

module.exports = function(session) {
    request('http://random.dog/woof', function (error, response, body) {
        if (!error && response.statusCode == 200 && body) {
            session.send('http://random.dog/' + body);
        }
        else {
            session.send("Bad request to dogs...");
        }
    });
}