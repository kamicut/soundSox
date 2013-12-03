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
	this._model = {} //Internal
	this._currentSongPlaying = {}
	this._globalProbabilities = [] //I don't know maybe we need this
	this.songList = ["assets/button2.mp3", "assets/button4.mp3"]
	this.state = 0

	/* Specification of message
	 * 
	 * A message is of the form {name: '_.mp3', params: '_', withNoise: true/false}
	 * This will create a song, apply the params such as gain, fade, echo, etc. 
	 * and then optionally add noise.
 	 */
	this.getNextSong = function() {
		//Return the best next song according to the model
		this.state = (this.state + 1) % this.songList.length
		var message = {name: this.songList[this.state], params: "reverse", withNoise: true}
		this._currentSongPlaying = message
		return message
	}

	/* Specification of algorithm
	 *
	 * To fill
	 */
	this._improveModel = function(vector) {
		//Algorithm to inject vector into the model
	}

}

