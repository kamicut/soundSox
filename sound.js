var exec 	= require('child_process').exec,
	url 	= require('./config.js').url,
	port 	= require('./config.js').port,
	socket 	= require('socket.io-client').connect(url, {port: port});

//What to do when you connect to main server
socket.on('connect', function(){
	
	//What to do with next song
	socket.on('nextsong', function(data){
		playSong(data, function() {
			//in callback get a newsong
			socket.emit("newsong", "Give me a new song")
		})
	});

	//On initialization
	socket.emit("newsong", "Give me a new song");
	socket.on("timeout", function() {
		socket.emit("newsong", "Give me a new song")
	}, 2000)

	//Cleanup code
	socket.on('disconnect', function(){});
});

//Play song using SoX, optionally giving parameters
//ParamString given according to reference http://sox.sourceforge.net/sox.html
function playSong(message, nextSongCallback) {
	var _songName = message.name
	var _paramString = message.params 
	var _withNoise = message.withNoise

	if (_withNoise) {
		exec('sox ' + _songName + " noise.wav synth noise", function() {
			makeSong(function() {
				exec("play -m noise.wav song.wav", nextSongCallback)
			})
		})
	} else {
		makeSong(function() {
			exec("play song.wav", nextSongCallback)
		})
	}

	function makeSong(callback) {
		exec("sox " + _songName + " song.wav " + _paramString, function() {
			callback()
		})
	}
}

