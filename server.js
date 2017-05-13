var express = require('express');
var app = express();
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var env = require('dotenv').load();
var exphbs = require('express-handlebars');

var methodOverride = require('method-override');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy;

//CHAT module - addition
server = require("http").createServer(app);
io = require("socket.io").listen(server);
users = {};

server.listen(3000); //@Team to discuss with TA reg usage of port conflicts between http and PORT config

io.sockets.on('connection', function(socket) {
    socket.on('new user', function(data, callback) {
        if (data in users) {
            callback(false);
        } else {
            callback(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNicknames();
        }

    });

    function updateNicknames() {
        io.sockets.emit("usernames", Object.keys(users));
    }

    socket.on("new message", function(data) {
        io.sockets.emit("new message", { msg: data, nick: socket.nickname });
    });

    socket.on("disconnect", function(data) {
        if (!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
    });
});
//CHAT module - addition

//CHAT module changes
var PORT = process.env.PORT || 4000; //@Team to Review the PORT 4000 change, with Michael
//CHAT module changes
var mainRoutes = require('./routes/mainRoutes.js');


// Serve static content
app.use(express.static("./public"));

// Server body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Method Override
app.use(methodOverride('_method'));

// config for passport
app.use(session({
    secret: 'seemecatsanddogs',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// For Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



// Models
var db = require("./models");

// Auth Routes
var authRoute = require('./routes/auth.js')(app, passport);

//CHAT module - addition
//Chat Routes
var chatRoutes = require('./routes/chatRoutes.js')(app, io);
//CHAT module - addition

// api route for matches
var matchRoutes = require('./routes/matchRoutes.js')(app);

// Load Passport strategies
require('./models/user');
require('./config/passport/passport.js')(passport, db.user);

// Basically, just the landing page
mainRoutes(app);
app.use('/', mainRoutes);

// Sync Database & Launch Server/App
db.sequelize.sync({}).then(function() {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});