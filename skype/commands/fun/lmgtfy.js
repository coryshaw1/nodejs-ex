module.exports = function(session, data) {
    if(!data || !data.params || data.params.length < 1)
        return session.send("Need a search term! Ex: !lmgtfy how do i not be dumb");

    session.send('http://lmgtfy.com/?q=' + encodeURI(data.params.join("+")));
}

module.exports.extraCommands = ["google"];