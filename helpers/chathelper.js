var exports = module.exports = {};

exports.chatindex = function(req, res) {
    console.log("Chat logged in user: " +
        req.user.email);

    res.render('chat.handlebars', {
        layout: "inapp",
        stylesheet: "profile.css",
        swipeStyle: "profile.css",
        chatScripts: '<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.1/socket.io.slim.js"></script><script src="assets/js/socketCustom.js"></script><script src="assets/js/socketCustom.js"></script>',
        loggedinuser: req.user.email
    });
};
exports.login = function(req, res) {
    //Trying code to replace jQuery updates with Chat model and Chat/Message persistance.
    console.log("test login: " + req.body.nickname);
    //console.log(io);
};