module.exports = function(session) {
	session.send('And the winner of Miss Universe is...');
    setTimeout(function(){
        session.send('Miss Colombia!!!');
        setTimeout(function(){
            session.send('Haha just kidding, it\'s Miss Steve Harvey');
            session.send('It\'s on the card here, see');
        }, 3000);
    }, 2000);
};
