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
var io = require('socket.io').listen(3000);


function update(data) {
	model.improveModel(data)
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
				var vals = JSON.parse(stdout)
				update(vals)
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
	this._currentMood = {s: 0.0, h: 0.5, count: 0}
	this._currentSongPlaying = -1
	this._songList = [
		new Song("assets/art_attack.mp3", 0, 0.5),
		new Song("assets/bhutto.mp3", 0.5, 0),
		new Song("assets/bill.mp3", 0.5, 0.5),
		new Song("assets/bush.mp3", 0.5, 0),
		new Song("assets/can.mp3", 0.5, 0.5),
		new Song("assets/crunch.mp3", 0.5, 0),
		new Song("assets/dialup.mp3", 0, 0.5),
		new Song("assets/facebook.mp3", 0.5, 0.5),
		new Song("assets/friends.mp3", 0, 0.5),
		new Song("assets/global_warming.mp3", 0.5, 0),
		new Song("assets/h1n1.mp3", 0.5, 0),
		new Song("assets/higgs.mp3", 0, 0.5),
		new Song("assets/ipod.mp3", 0, 0.5),
		new Song("assets/mario.mp3", 0, 0.5),
		new Song("assets/michael.mp3", 0, 0.5),
		new Song("assets/pinky.mp3", 0, 0.5),
		new Song("assets/pope.mp3", 0.5, 0),
		new Song("assets/rickroll.mp3", 0.5, 0.5),
		new Song("assets/tsunami.mp3", 0.5, 0),
		new Song("assets/wikileaks.mp3", 0.5, 0.5),
		new Song("assets/wikipedia.mp3", 0.5, 0.5),
		new Song("assets/wizard.mp3", 0, 0.5),
		new Song("assets/zelda.mp3", 0, 0.5)
	]

	this._alpha = 1.5;
	this._beta = 0.03;

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
		var message = {name: name, params: "", noise: noise, vol: vol}
		this._currentSongPlaying = idx;
		console.log("Current Mood is: " + this._currentMood.s + ", " + this._currentMood.h)
		return message
	}

	/* Specification of algorithm
	 *
	 * To fill
	 */
	this.improveModel = function(vector) {
		//Algorithm to inject vector into the model
		console.log(vector)
		var n = vector[3];
		var s = vector[0];
		var h = vector[2];
		this._updateCurrentMood(s,h,n)
		this._updateCurrentSong(s,h,n)
	}

	/* Update the current mood
	 *
	 */
	this._updateCurrentMood = function(s,h,n) {
		if (n < 0.65) {
			//Update mood only if outlier
			this._currentMood.s = (this._currentMood.s + s)/2
			this._currentMood.h = (this._currentMood.h + h*2)/2
		}
	}

	this._updateCurrentSong = function(s,h,n) {
		this._songList[this._currentSongPlaying].s = (
			this._songList[this._currentSongPlaying] + s)/2
		this._songList[this._currentSongPlaying].h = (
			this._songList[this._currentSongPlaying] + h)/2
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



