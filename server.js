/* Global Object for Model
 *
 */
var model = new Model();

/* Start JPG receiver
 * 
 */
var exec 	= require('child_process').exec
var fs 		= require("fs");
var request = require("request");
var MjpegConsumer = require("mjpeg-consumer");
var consumer = new MjpegConsumer();

var queue = [] 
var max = 40
var count = 0

function update(data) {
	console.log(data)
}
 
request("http://192.168.2.2:8080/?action=stream").pipe(consumer).on('data', function(data) {
	// if (count < MAX) { 
	// 	count+= 1;
	// 	doWork(data)
	// } else {
	// 	queue.push(data)
	// }

	fs.writeFile('./data/cropped.png', data, function() {
		exec('./ofApp.app/Contents/MacOS/ofApp cropped.png', function(error, stdout, stderr) {
			try {
				var data = JSON.parse(stdout)
				update(data)
			} catch (err) {}

		    if (error !== null) {
		  //    console.log('exec error: ' + error);
		    }	
		})		
	})
})



/* Start Audio Connection
 *
 */
var io = require('socket.io').listen(3000);

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

/* Modelling the expressions and the songs
 *
 */
function Model() {
	this._currentMood = {s: 0.5, h: 0.5, count: 0}
	this._currentSongPlaying = -1
	this._songList = [
		new Song("assets/button2.mp3", 0.5, 0.5), 
		new Song("assets/button4.mp3", 1, 0.5)
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
		var current = this._currentSongPlaying;
		var min_val = 99999 //Infinity
		var idx = -1
		for (var i=0; i<this._songList.length; i++) {
			if (i != current) { //All songs except current
				var temp = this._songList[i].l2(this._currentMood)
				console.log(temp)
				if (temp < min_val) {
					idx = i
					min_val = temp
				}
			}
		}
		var nextSong = this._songList[idx]
		var name = nextSong.name
		var vol = this._alpha * Math.max(nextSong.s, nextSong.h);
		var noise = this._beta * Math.abs(nextSong.s - nextSong.h); //I don't think this is accurate
		var message = {name: name, params: "reverse", noise: vol, vol: noise}
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

function Song(name, s, h) {
	this.name = name
	this.s = s
	this.h = h

	this.l2 = function(other) {
		return Math.sqrt(Math.pow((this.s-other.s),2) + 
			Math.pow((this.h-other.h),2))
	}
}



