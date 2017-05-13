/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

// This code is adapted from
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html


var config = {
    apiKey: "AIzaSyDprXntzAdAWk0bqUs8HQPnSw5YClWh2As",
    authDomain: "seeme-7cd46.firebaseapp.com",
    databaseURL: "https://seeme-7cd46.firebaseio.com",
    projectId: "seeme-7cd46",
    storageBucket: "seeme-7cd46.appspot.com",
    messagingSenderId: "1044644752621"
};

firebase.initializeApp(config);

var database = firebase.database();
var mediaSource = new MediaSource();
mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
var mediaRecorder;
var recordedBlobs;
var sourceBuffer;

var gumVideo = document.querySelector('video#gum');
var recordedVideo = document.querySelector('video#recorded');

var recordButton = document.querySelector('button#record');
var playButton = document.querySelector('button#play');
var downloadButton = document.querySelector('button#download');
recordButton.onclick = toggleRecording;
playButton.onclick = play;
downloadButton.onclick = download;

// window.isSecureContext could be used for Chrome
var isSecureOrigin = location.protocol === 'https:' ||
    location.hostname === 'localhost';
if (!isSecureOrigin) {
    alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
        '\n\nChanging protocol to HTTPS');
    location.protocol = 'HTTPS';
}

var constraints = {
    audio: true,
    video: true
};

function handleSuccess(stream) {
    recordButton.disabled = false;
    console.log('getUserMedia() got stream: ', stream);
    window.stream = stream;
    if (window.URL) {
        gumVideo.src = window.URL.createObjectURL(stream);
    } else {
        gumVideo.src = stream;
    }
}

function handleError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
then(handleSuccess).catch(handleError);

function handleSourceOpen(event) {
    console.log('MediaSource opened');
    sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', sourceBuffer);
}

recordedVideo.addEventListener('error', function(ev) {
    console.error('MediaRecording.recordedMedia.error()');
    alert('Your browser can not play\n\n' + recordedVideo.src +
        '\n\n media clip. event: ' + JSON.stringify(ev));
}, true);

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

function handleStop(event) {
    console.log('Recorder stopped: ', event);
}

function toggleRecording() {


    if (document.getElementById("record").innerHTML === '<i class="material-icons">camera</i>') {
        startRecording();
        setTimeout(function() { recordingTimeLimit(); }, 10000);
    } else {
        stopRecording();
        document.getElementById("record").innerHTML = '<i class="material-icons">camera</i>';
        document.getElementById("record").classList.remove('btn-danger');
        playButton.classList.add('btn-success');
        downloadButton.classList.add('btn-success');
        playButton.disabled = false;
        downloadButton.disabled = false;
    }
}

function recordingTimeLimit() {
    stopRecording();
    document.getElementById("record").innerHTML = '<i class="material-icons">camera</i>';
    document.getElementById("record").classList.remove('btn-danger');
    playButton.disabled = false;
    downloadButton.disabled = false;
}

function startRecording() {
    recordedBlobs = [];
    var options = { mimeType: 'video/webm;codecs=vp9' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = { mimeType: 'video/webm;codecs=vp8' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported');
            options = { mimeType: 'video/webm' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.log(options.mimeType + ' is not Supported');
                options = { mimeType: '' };
            }
        }
    }
    try {
        mediaRecorder = new MediaRecorder(window.stream, options);
    } catch (e) {
        console.error('Exception while creating MediaRecorder: ' + e);
        alert('Exception while creating MediaRecorder: ' +
            e + '. mimeType: ' + options.mimeType);
        return;
    }
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    document.getElementById("record").innerHTML = '<i class="material-icons">stop</i>';
    document.getElementById("record").classList.add('btn-danger');
    playButton.disabled = true;
    downloadButton.disabled = true;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10); // collect 10ms of data
    console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
    mediaRecorder.stop();
    console.log('Recorded Blobs: ', recordedBlobs);
    recordedVideo.controls = false;
}

function play() {
    var superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    document.getElementById('hide-on-replay').style.display = 'none';
    recordedVideo.style.display = 'block';
}

function download() {
    var blob = new Blob(recordedBlobs, { type: 'video/webm' });
    var url = window.URL.createObjectURL(blob);
    // var a = document.createElement('a');
    // a.style.display = 'none';
    // a.href = url;
    // a.download = 'test.webm';
    // document.body.appendChild(a);
    // a.click();
    // setTimeout(function() {
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    // }, 100);

    // get current user id
    var currentUserId;
    $.getJSON("api/user_data", function(data) {

        currentUserId = data.username.id;

    }).then(function() {

        // post profile video to firebase for storage
        // Create a root reference
        var storageRef = firebase.storage().ref();

        // Create a reference to 'mountains.jpg'
        var profileRef = storageRef.child('profileVideo.webm');

        // Create a reference to 'images/mountains.jpg'
        var profileVideosRef = storageRef.child('/profileVideos/' + currentUserId + '/' + 'profileVideo.webm');

        // While the file names are the same, the references point to different files
        profileRef.name === profileVideosRef.name; // true
        profileRef.fullPath === profileVideosRef.fullPath; // false

        var uploadTask = profileVideosRef.put(blob); // Puts image in firebase storage reference

        //------------------------------ AJAX Post to Microsoft Cognitive Service, Emotion API ------------------------------//
        // Get download URL
        var profileVideoLink;

        profileVideosRef.getDownloadURL().then(function(url) {



            profileVideoLink = url;
            $("#page-cover").fadeIn(300);

            setTimeout(function() {
                $.ajax({
                    type: "POST",
                    url: "/api/profile_videos",
                    // contentType: "application/json; charset=utf-8",
                    // timeout: 4000,
                    data: {
                        link: profileVideoLink,
                        id: currentUserId
                    },
                    success: function(data) {
                        $("#page-cover").fadeOut(300);
                        $("#vid-succ-s").fadeIn(200).delay(800).fadeOut();
                        //show content
                        console.log('Success!');
                        // console.log(data);
                    },
                    error: function(jqXHR, textStatus, err) {

                    }
                });
            }, 3000);

        });
    });
}