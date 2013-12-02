var exec = require('child_process').exec,
    child;

var socket = require('socket.io-client').connect('http://192.168.1.85:3000');
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