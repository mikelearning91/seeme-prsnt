var geocoder = require("geocoder");
// all possible users from the DB that could be a match
var matchList = [
  [1234, "10309", 10000],
  [5678, "90210", 10000],
  [2468, "80014", 10000]
];

function Match( ID, location, locPref ){
  this.ID = ID;
  this.location = location;
  this.locPref = locPref;
  // this.testPrint = function(){console.log(newMatch.location)};
  this.getCoordinates = function(index){
    var userLocations =[];
    var withinRange = [];
    var index = 0;
    geocoder.geocode(newMatch.location, function ( err, data ) {
      
      if (err) {
        console.log(err);
      };
      
      var lat = data.results[0].geometry.location.lat;
      var lon = data.results[0].geometry.location.lng;
      userLocations.push(lat, lon);
      
      console.log(userLocations)
      
      if(index < matchList.length){
          newMatch.getCoordinates(index);
          index++;
      };
        
      if(index > 0){
        newMatch.rangeCheck()
      }
    });
  };
  this.rangeCheck = function(){

        function toRadians(deg){
          var pi = Math.PI;
          return deg * (pi/180); 
        };
        var lat1 = userLocations[0][0]
        var lon1 = userLocations[0][1]
        var lat2 = userLocations[index][0] 
        var lon2 = userLocations[index][1]
        var R = 6371e3; // metres
        var φ1 = toRadians(lat1);
        var φ2 = toRadians(lat2);
        var Δφ = toRadians(lat2-lat1);
        var Δλ = toRadians(lon2-lon1);
        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var distance = (R * c)*0.000621371192;
        index++;
        if(distance < newMatch.locPref[0] && distance < Match.locPref[index]){
          withinRange.push(newMatch.ID[index])
          console.log(withinRange);
        }; 
  };
};
  
for (var i=0; i < matchList.length; i++){
   
   newMatch = new Match(matchList[i][0],matchList[i][1],matchList[i][2])
   newMatch.getCoordinates() 
   // newMatch.testPrint();
   // console.log(newMatch.location)
   
};






