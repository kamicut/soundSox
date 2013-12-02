var exec = require('child_process').exec,
	url = require('./config.js').url,
    child;

var socket = require('socket.io-client').connect(url);
socket.on('connect', function(){
	socket.on('message', function(data){
		playSong(data, function() {
			console.log(data)
		})
	});
	socket.emit("message", "Hello world!");

	socket.on('disconnect', function(){});
});

function playSong(songName, callback) {
	child = exec('play '+songName,
	  function (error, stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	    callback()
	});
}