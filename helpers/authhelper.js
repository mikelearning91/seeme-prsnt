var exports = module.exports = {};
var db = require('../models');
var geoHelper = require('./geohelper.js');

exports.signup = function(req, res) {
    var css = {
        stylesheet: "sign.css"
    };
    res.render('signup.handlebars', css);
};

exports.signin = function(req, res) {
    var css = {
        stylesheet: "sign.css"
    };
    res.render('signin.handlebars', css);
};

exports.swipe = function(req, res) {

    var GLIDsToPassArr = [];
    var mutualsToPassArr = [];
    var currentUser = req.user.id;
    var values = [];
    var mutualValues = [];
    var mutualValuesW = [];

    db.Matches.findAll({
        where: {
            WLID: currentUser
        },

        attributes: ['GLID']


    }).then(function(data) {
        // console.log(data);
        // console.log(data);
        console.log("BEFORE ", data);

        if (data.length === 0) {
            values.push(currentUser);
            values.map(Number);

        } else {
            data.forEach((dataItem) => {

                GLIDsToPassArr.push(dataItem.get({
                    plain: true
                }));

                var valString = GLIDsToPassArr.map(object => object.GLID);

                values = valString.map(Number);
                values.push(currentUser);
            });
        }

        db.Matches.findAll({
            where: {
                mutual: 1
            },
            attributes: ['GLID', 'WLID']


        }).then(function(mutualData) {
            console.log(mutualData);
            if (mutualData.length === 0) {
                mutualValues.push(currentUser);
                mutualValues.map(Number);

            } else {
                mutualData.forEach((mutualDataItem) => {

                    mutualsToPassArr.push(mutualDataItem.get({
                        plain: true
                    }));

                    var mutualValString = mutualsToPassArr.map(object => object.GLID);
                    mutualValues = mutualValString.map(Number);

                    var mutualValWString = mutualsToPassArr.map(object => object.WLID);
                    mutualValuesW = mutualValWString.map(Number);
                    // console.log("WWWW", mutualValWString);


                });
            }

            valuesAl = values.concat(mutualValues);
            var finalValues = valuesAl.concat(mutualValuesW);

            // console.log("GLIDS ", values);
            // console.log("mutualVALS", mutualValues);
            // console.log("WLID and GLID IDs to not show to current user ", finalValues);

            db.user.findAll({

                where: {
                    id: {
                        $ne: req.user.id,
                        $notIn: finalValues
                    },
                    age: {
                        $between: [req.user.age_pref_min, req.user.age_pref_max]
                    },
                    age_pref_min: {
                        $lt: req.user.age
                    },
                    age_pref_max: {
                        $gt: req.user.age
                    },
                    is_male: req.user.seeking_male,
                    seeking_male: req.user.is_male
                }

            }).then(function(usersToSwipeOn) {

                // for (var i = 0; usersToSwipeOn.length; i++) {
                //     var matchList = [
                //         new Match(usersToSwipeOn[i].id, usersToSwipeOn[i].location, 50)
                //     ];
                // }
                // console.log(filterDup);
                // matchList[0].getCoordinates(0);
                // console.log("booooooom", usersToSwipeOn);

                var hbsObject = {
                    layout: 'inapp',
                    stylesheet: "profile.css",
                    swipeStyle: "swipe.css",
                    users: usersToSwipeOn,
                    currUser: currentUser
                };
                console.log("h3333333", hbsObject.users);
                // console.log("hello" + currentUser);
                // console.log("hello", hbsObject.currUser);
                res.render('swipe.handlebars', hbsObject);
            });
        });
    });
};

exports.profile = function(req, res) {

    var obj = {
        layout: 'inapp',
        stylesheet: "profile.css",
        swipeStyle: "profile.css",
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.email,
        username: req.user.username,
        password: req.user.password,
        age: req.user.age,
        location: req.user.location,
        is_male: req.user.is_male,
        seeking_male: req.user.seeking_male,
        age_pref_min: req.user.age_pref_min,
        age_pref_max: req.user.age_pref_max,
        profile_video: req.user.profile_video
    };
    // console.log("seeking_male baby" + req.user.age_pref_max);
    res.render('profile.handlebars', obj);
};

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/signin');
    });
};

exports.profileVideos = function(req, res) {
    res.json(req.body);
};

exports.profileVideosPost = function(req, res) {
    var videoLink = req.body.link;
    var currentUserId = req.body.id;
    console.log("videoLink: ", videoLink);
    console.log("currentUserId: ", currentUserId);

    db.user.update({
        profile_video: videoLink
    }, {
        where: { id: currentUserId }
    }).then(function() {
        console.log("video inserted into database");
    });
    res.redirect('/profile');
};