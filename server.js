var io = require('socket.io').listen(3000);

io.sockets.on('connection', function(socket) {
	socket.emit('message', {name:'assets/button2.mp3', params: "reverse"});

	socket.on('message', function(data) {
		console.log("Received " + data);
	});	

	socket.on('disconnect', function() {
		console.log("Client disconnected");
	});
});
