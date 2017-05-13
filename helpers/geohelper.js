var geocoder = require("geocoder");
// all possible users from the DB that could be a match

module.exports = function() {

    // var matchList = [
    //     new Match(1234, "10309", 50),
    //     new Match(5678, "90210", 50),
    //     new Match(2468, "80014", 50)
    // ];



    var withinRange = [];
    //var userLocations =[];
    var distArry = [];
    var filterDup;

    function Match(ID, location, locPref) {
        this.ID = ID;
        this.location = location;
        this.locPref = locPref;
        this.userLocations = [];
        // this.testPrint = function(){console.log(newMatch.ID)};
        this.getCoordinates = function(index) {
            geocoder.geocode(this.location, function(err, data) {
                if (err) {
                    console.log(err);
                }

                var lat = data.results[0].geometry.location.lat;
                var lon = data.results[0].geometry.location.lng;
                matchList[index].userLocations.push([lat, lon]);

                index++;

                if (index < matchList.length) {
                    matchList[index].getCoordinates(index);
                } else {
                    for (var i = 0; i < matchList.length; i++)
                        matchList[i].rangeCheck();
                }
            });
        };
    }

    function toRadians(deg) {
        var pi = Math.PI;
        return deg * (pi / 180);
    }

    Match.prototype.rangeCheck = function() {

        var lat1 = this.userLocations[0][0]
        var lon1 = this.userLocations[0][1]
            //loop through the entire matchlist and get the lat and lon of each
            //match and do the comparison.
        for (var i = 0; i < matchList.length; i++) {

            var lat2 = matchList[i].userLocations[0][0]
            var lon2 = matchList[i].userLocations[0][1]
            var R = 6371e3; // metres
            var φ1 = toRadians(lat1);
            var φ2 = toRadians(lat2);
            var Δφ = toRadians(lat2 - lat1);
            var Δλ = toRadians(lon2 - lon1);
            var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var distance = (R * c) * 0.000621371192;
        }

        distArry.push(distance);
        console.log(distArry)
        for (i = 0; i < matchList.length; i++) {
            if (distArry[i] < matchList[0].locPref) {
                withinRange.push(matchList[i].ID)
            };
            filterDup = withinRange.reduce(function(a, b) {
                if (a.indexOf(b) < 0) a.push(b);
                return a;
            }, []);

            //this logs fine from here
        }
        console.log("Within Range: " + filterDup);
        // this comes up undefined 
    };
    // console.log(filterDup)
    // matchList[0].getCoordinates(0);



};