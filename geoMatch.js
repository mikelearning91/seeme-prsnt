var geocoder = require("geocoder");
var nodeArgs = process.argv;
var matchDB = [];
// all possible users from the DB that could be a match

// all matches 


function Match(ID,location,age, gender, agePref, genderPref, radPref, searchPref){
  this.ID = ID;
  this.location = location;
  this.age = age;
  this.gender =gender;
  this.agePref = agePref;
  this.genderPref = genderPref;
  this.distPref = radPref;
  this.searchPref = searchPref;
  this.distPrefArray = []

  //multi-dimensional array for holding coordinates of user (Match.userLoc[0][0] and Match.userLoc[0][1]) 
  //and potential matches (Match.userLoc[i][0], Match.userLoc[i][1])
  this.userLoc = [];
  this.PostiveMatch = "";
  // function to convert user location input into coordinates
  this.coordinates = function() {
    
    for (var i = 0; i < nodeArgs.length; i++) {
      Match.location = Match.location + " " + nodeArgs[i]; 
    };
    // this loop searches only as many matches an the user specifies
    // for (var i = 0; i < (Match.searchPref.length)+1; i++){
    Match.processLocation(0); 
    // };
  };

  this.processLocation = function(index){
      geocoder.geocode(Match.location, function ( err, data ) {
        if (err) {
          console.log(err);
        };
        var lat[index] = data.results[0].geometry.location.lat;
        var lon[index] = data.results[0].geometry.location.lng;
        
        Match.userLoc.push(lat[index][0]);
        Match.userLoc.push(lon[index][1]);

        if(index > 0){
            Match.userRadius();
        }

        if(++index < Match.searchPref.length){
            Match.processLocation(index)
        }
      }); 
  };
  // function to compare to users' coordinates to determine the distance betwwen them
  this.userRadius = function() {
    var distance;
    
    function toRadians(deg){
      var pi = Math.PI;
      return deg * (pi/180); 
    };
    // loops through userLoc array
    for(var i =0; i < Match.userLoc.length; i++){
      //static coordinates for testing
      // var lat1 = 40.5352975 
      // var lon1 = -74.2155454
      // var lat2 = 34.0522342 
      // var lon2 = -118.2436849
      var lat1 = Match.userLoc[0][0]
      var lon1 = Match.userLoc[0][1]
      var lat2 = Match.userLoc[i][0] 
      var lon2 = Match.userLoc[i][1]
      var R = 6371e3; // metres
      var φ1 = toRadians(lat1);
      var φ2 = toRadians(lat2);
      var Δφ = toRadians(lat2-lat1);
      var Δλ = toRadians(lon2-lon1);
      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
       distance = (R * c)*0.000621371192;
      
       if(distance > Match.userPref[0] && distance > Match.userPref[i]){
        Match.distPrefArray.push(matchDB[i])
       }
    };
    }; 
  };


  
var newMatch = new Match("")



// console.log(newMatch.userRadius());

  








