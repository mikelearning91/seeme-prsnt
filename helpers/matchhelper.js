var exports = module.exports = {};
var db = require('../models');

exports.matchindex = function(req, res) {
    res.json(req.body);
};

exports.mymatches = function(req, res) {

    var GLIDsToPassArr = [];
    var mutualsToPassArr = [];

    var currentUser = req.user.id;

    var values = [];
    var mutualValuesG = [];
    var mutualValuesW = [];

    db.Matches.findAll({
        where: {
            WLID: currentUser,
            mutual: 1
        },
        attributes: ['GLID']
    }).then(function(data) {
        // console.log(data);
        // console.log(data);
        // console.log("BEFORE ", data);

        if (data.length === 0) {
            mutualValuesG.push(currentUser);
            mutualValuesG.map(Number);

        } else {
            data.forEach((dataItem) => {

                GLIDsToPassArr.push(dataItem.get({
                    plain: true
                }));

                var valString = GLIDsToPassArr.map(object => object.GLID);

                mutualValuesG = valString.map(Number);
                mutualValuesG.push(currentUser);
            });
        }

        db.Matches.findAll({
            where: {
                GLID: currentUser,
                mutual: 1
            },
            attributes: ['WLID']


        }).then(function(mutualData) {
            // console.log(mutualData);
            if (mutualData.length === 0) {

                mutualValuesW.push(currentUser);
                mutualValuesW.map(Number);

            } else {
                mutualData.forEach((mutualDataItem) => {

                    mutualsToPassArr.push(mutualDataItem.get({
                        plain: true
                    }));

                    var mutualValWString = mutualsToPassArr.map(object => object.WLID);
                    mutualValuesW = mutualValWString.map(Number);
                    // console.log("WWWW", mutualValuesW);


                });
            }

            valuesAl = mutualValuesG.concat(mutualValuesW);
            var finalValues = valuesAl.concat(mutualValuesW);

            // console.log("GLIDS ", values);
            // console.log("mutualVALS", mutualValues);
            // console.log("WLID and GLID IDs to not show to current user ", finalValues);

            db.user.findAll({
                where: {
                    id: {
                        $in: finalValues,
                        $ne: currentUser
                    }
                }
            }).then(function(usersMatched) {

                // console.log("boom", usersMatched["0"]);
                var hbsObject = {
                    layout: 'inapp',
                    stylesheet: "profile.css",
                    swipeStyle: "swipe.css",
                    chatScripts: '<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.1/socket.io.slim.js"></script><script src="assets/js/socketCustom.js"></script>',
                    users: usersMatched,
                    currUser: currentUser,
                    loggedInUserEmail: req.user.email
                };
                // console.log("hello" + currentUser);
                // console.log("hello", hbsObject.currUser);
                res.render('mymatches.handlebars', hbsObject);
            });
        });
    });
};