var request = require('request');

module.exports = function(session) {
    request('http://numbersapi.com/random/trivia', function (error, response, body) {
        session.send(!error && response.statusCode == 200 
                        ? body 
                        : "Bad request to facts...");
    });
}