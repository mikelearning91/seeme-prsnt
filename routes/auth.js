var authHelper = require('../helpers/authhelper.js');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');

module.exports = function(app, passport) {

    app.get('/api/user_data', function(req, res) {

        if (req.user === undefined) {
            // The user is not logged in
            res.json({});
        } else {
            res.json({
                username: req.user
            });
        }
    });

    app.get('/api/profile_videos', authHelper.profileVideos);

    app.post("/api/profile_videos", authHelper.profileVideosPost);

    app.get('/signup', authHelper.signup);

    app.get('/signin', authHelper.signin);

    app.get('/swipe', isLoggedIn, authHelper.swipe);

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup'
    }));

    app.get('/logout', authHelper.logout);

    app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin'
    }));

    app.put('/updateprofile', isLoggedIn, function(req, res) {
        db.user.update({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age,
            location: req.body.location,
            is_male: req.body.is_male == "Guy",
            seeking_male: req.body.seeking_male == "Guy",
            age_pref_min: req.body.age_pref_min,
            age_pref_max: req.body.age_pref_max
        }, {
            where: { id: req.user.id }
        }).then(function(err, numberAffected, rawResponse) {
            // console.log(req.user);
            // console.log(req.body.is_male);
        });
        res.redirect('/profile');
    });


    app.get('/profile', isLoggedIn, authHelper.profile);


    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }
};