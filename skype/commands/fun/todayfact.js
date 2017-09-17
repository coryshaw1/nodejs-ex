var request = require('request');

module.exports = function(session) {
    request('http://numbersapi.com/' + (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/date", function (error, response, body) {
        session.send(!error && response.statusCode == 200 
                        ? body 
                        : "Bad request to facts...");
    });
}