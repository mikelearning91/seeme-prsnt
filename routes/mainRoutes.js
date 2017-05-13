var path = require('path');

module.exports = function(app) {
    var obj = {
        stylesheet: "style.css"
    };
    // Route for home page
    app.get('/', function(req, res) {
        res.render('index.handlebars', obj);
    });
};