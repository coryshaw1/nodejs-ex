var request = require('request');

module.exports = function(session, data) {

    if(!data || !data.params || data.params.length < 1)
        return session.send("Need a search term! Ex: !giphy funny cats");

    var sendRandomImage = function(jsonData) {
        session.send(jsonData[Math.floor(Math.random() * (jsonData.length - 1))].images.original.url);
    };

    var baseRequestUrl = 'http://api.giphy.com/v1/gifs/search?api_key=' + process.env.GIPHY_API_KEY + '&limit=100&rating=pg-13&q=' + data.params.join("+").replace("'", "\'").replace('"', '\"');

    request(baseRequestUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);

            if(!json.data || json.data.length == 0 || !json.meta || json.meta.status !== 200)
                return session.send("No images matching search: '" + data.params.join("+").replace("'", "\'").replace('"', '\"') + "'");

            if(json.pagination.count !== 100 || json.pagination.total_count <= 100)
                return sendRandomImage(json.data);

            request(baseRequestUrl + "&offset=" + Math.floor(Math.random() * Math.floor(json.pagination.total_count / 100)), function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var json = JSON.parse(body);

                    if(!json.data || json.data.length == 0 || !json.meta || json.meta.status !== 200)
                        return session.send("No images matching search: '" + data.params.join("+").replace("'", "\'").replace('"', '\"') + "'");

                    return sendRandomImage(json.data);
                }
                else {
                    session.send("Bad request to Giphy...");
                    return;
                }
            });
        }
        else {
            session.send("Bad request to Giphy...");
            return;
        }
    });
}