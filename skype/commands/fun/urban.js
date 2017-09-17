var urban = require('urban');

module.exports = function(session, data) {

    if(!data || !data.params || data.params.length < 1)
        return session.send("Need a search term! Ex: !urban wat");

    urban(data.params.join(' ')).first(function(json) {

        if(!json || typeof json === "undefined")
            return session.send("No definitions found for search term: '" + data.params.join(' ') + "'!");

        session.send("'" + data.params.join(' ') + "': " + json.definition);

        if(!json.example || json.example.length == 0) return;
        
        session.send("Examples:");

        json.example.split("\r\n\r\n").forEach(function(example){
            session.send(example);
        });
    });
}