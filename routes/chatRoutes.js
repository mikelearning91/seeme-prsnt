var chatController = require('../helpers/chathelper.js');

module.exports = function(app, io) {
    app.get('/chat', chatController.chatindex);

    //app.post('/chat/login', chatController.login);
}