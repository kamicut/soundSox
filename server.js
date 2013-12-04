var io = require('socket.io').listen(3000);

var model = new Model();
io.sockets.on('connection', function(socket) {

	socket.emit('message', "We got your connection!");

	socket.on('newsong', function(data) {
		console.log("Received " + data);
		if (typeof(model) == undefined) {
			socket.emit("timeout", "Model hasn't been created yet.")
		} else {
		 	socket.emit("nextsong", model.getNextSong());	
		}
	});	

	socket.on('disconnect', function() {
		console.log("Client disconnected");
	});
});

//Modelling the expressions and the songs
function Model() {
	this._currentMood = {s: 0, h: 0, count: 0}
	this._currentSongPlaying = 0
	this._songList = [
		new Song("assets/button2.mp3"), 
		new Song("assets/button4.mp3")
	]

	this._alpha = 1;
	this._beta = 1;

	/* Specification of message
	 * 
	 * A message is of the form {name: '_.mp3', params: '_', noise: [num], vol: [num]}
	 * This will create a song, apply the params such as gain, fade, echo, etc. 
	 * and then set the noise level and track level
 	 */
	this.getNextSong = function() {
		//Return the best next song according to the model
		this._currentSongPlaying = (this._currentSongPlaying + 1) % this._songList.length
		var name = this._songList[this._currentSongPlaying].name
		console.log(name)
		var message = {name: name, params: "reverse", noise: this._currentSongPlaying, vol: 1}
		return message
	}

	/* Specification of algorithm
	 *
	 * To fill
	 */
	this.improveModel = function(vector) {
		//Algorithm to inject vector into the model
		console.log(vector)
		this._updateCurrentMood(vector)
		this._updateCurrentSong(vector)
	}

	/* Update the current mood
	 *
	 */
	this._updateCurrentMood = function(vector) {

	}

	this._updateCurrentSong = function(vector) {

	}
}

function Song(name) {
	this.name = name
	this.s = 0
	this.h = 0

	this.l2 = function(other) {
		return Math.sqrt(Math.pow((this.s-other.s),2) + 
			Math.pow((this.h-other.h),2))
	}
}



