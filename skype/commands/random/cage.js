module.exports = function(session) {
    session.send("http://www.placecage.com/gif/" + (Math.floor(Math.random() * 600) + 200) + "/" + (Math.floor(Math.random() * 600) + 200));
}