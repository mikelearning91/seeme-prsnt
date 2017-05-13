var matchHelper = require('../helpers/matchhelper.js');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');

module.exports = function(app) {

    app.get('/mymatches', isLoggedIn, matchHelper.mymatches);

    app.get('/api/matches', matchHelper.matchindex);

    app.post("/api/matches", function(req, res) {
        // console.log(req.body);
        var firstname = req.body.firstname;

        var gotLikedId = req.body.glid;
        var userWhoLikedId = req.body.wlid;

        console.log(gotLikedId, userWhoLikedId);
        // console.log("requesttttt: ", req.body);
        // console.log("responseeee: " + res);

        db.Matches.findAll({

            where: {
                WLID: gotLikedId,
                GLID: userWhoLikedId
            }

        }).then(function(data) {
            console.log("data:", data);
            var emptyObj = [];

            if (data.length === 0) {

                db.Matches.create({
                    WLID: userWhoLikedId,
                    GLID: gotLikedId

                });

            } else {
                db.Matches.update({
                    mutual: 1
                }, {
                    where: {
                        WLID: gotLikedId,
                        GLID: userWhoLikedId
                    }
                })

                .then(function(dbMatch) {

                    console.log('Successfully added ', dbMatch);
                    res.redirect("/api/matches");
                });
            }

        });
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/signin');
    }
};