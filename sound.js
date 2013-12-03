var exec 	= require('child_process').exec,
	url 	= require('./config.js').url,
	port 	= require('./config.js').port,
	socket 	= require('socket.io-client').connect(url, {port: port});

//What to do when you connect to main server
socket.on('connect', function(){
	socket.on('message', function(data){
		playSong(data.name, data.params, function() {
			console.log(data)
			//Here, send message back to server
		})
	});
	//Dummy send
	socket.emit("message", "Hello world!");

	//Cleanup code? 
	socket.on('disconnect', function(){});
});

//Play song using SoX, optionally giving parameters
//ParamString given according to reference http://sox.sourceforge.net/sox.html
function playSong(songName, paramString, callback) {
	if (typeof(paramString) == undefined) paramString = ""
	child = exec('play '+songName + " " + paramString,
	  function (error, stdout, stderr) {
	    console.log('stdout: ' + stdout);
	    console.log('stderr: ' + stderr);
	    if (error !== null) {
	      console.log('exec error: ' + error);
	    }
	    if (typeof(callback) != undefined) callback()
	});
}