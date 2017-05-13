//var passport = require("passport");
//  var LocalStrategy = require('passport-local').Strategy;

var socket = io.connect();
var $nickForm = $("#setNick");
var $nickError = $("#nickError");
var $users = $("#users");
var $messageForm = $("#send-message");
var $messageBox = $("#message");
var $chat = $("#chat");
var $nickBox = $("#nickname");

var $friendBox = $("#friendname");
var loggedinuser = $("#loggedInUserEmail").attr('name');
$nickForm.submit(function(e) {

    e.preventDefault();

    console.log($("#loggedinuser").text());

    //socket.emit("new user", $nickBox.val(), function(data) {
    socket.emit("new user", loggedinuser, function(data) {
        if (data) {
            $("#nickWrap").hide();
            $("#contentwrap").show();
        } else {
            $nickError.html("That username is already taken! Try again.");
        }
    });
    $nickBox.val(" ");

});

socket.on("usernames", function(data) {
    var html = "";
    for (i = 0; i < data.length; i++) {
        html += data[i] + "<br/>"
    }
    $users.html(html);
});
$messageForm.submit(function(e) {
    e.preventDefault();
    socket.emit(loggedinuser + " message", $messageBox.val());
    $chat.append("<b>" + loggedinuser + ": </b>" + $messageBox.val() + "<br/>");
    $messageBox.val(" ");
});
socket.on(loggedinuser + " message", function(data) {
    $chat.append("<b>" + data.nick + ": </b>" + data.msg + "<br/>");
});