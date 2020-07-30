// Based off of Shawn Van Every's Live Web
// http://itp.nyu.edu/~sve204/liveweb_fall2013/week3.html

// Using express: http://expressjs.com/
var players = []
var turnCount = 0;
var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = require('http').Server(app);
server.listen(3000, function () {
	console.log(`Listening on ${server.address().port}`);
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});
// This call back just tells us that the server has started
function listen() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
	// We are given a websocket object in our function
	function (socket) {


		console.log("We have a new client: " + socket.id);
		players.push(new player(socket.id))


		socket.on('name',
			function (nameObj) {
				for(let i =0;i<players.length;i++) {
					if (players[i].socketId == nameObj.socketId) {
						players[i].setName(nameObj.name)
					}
				}

			}
			)
		socket.on('move',
			function(moveObj){
			console.log("m received")
			var winner;
			var winString;
				for(let i =0;i<players.length;i++){
					if(players[i].socketId == moveObj.socketId
					&&players[i].turnCount == turnCount){
						// console.log(moveObj.move)

						players[i].setMove(moveObj.move)
						players[i].incrementTurn()
						console.log("" + players[i].socketId + " turn: " + players[i].turnCount + " move: " + players[i].move)
						// if(players[i].move == "rock"){players[i].incrementScore()}
					}
				}
				if(players[0].turnCount == players[1].turnCount){
					turnCount++;
					console.log(turnCount)
					winner = gameLogic(players[0], players[1])
					if (winner == null){winString = 'tie'}
					else {
						winner.incrementScore()
						winString = winner.name
					}
					socket.emit('winner', winString)
				}

				io.sockets.emit('players' , players)
			}
		);


		socket.on('disconnect', function() {
			console.log("Client has disconnected");
			for(let i =0;i<players.length;i++){
				if(players[i].socketId == socket.id){
					players.splice(i,1)
				}
			}
		});
	}
);
function gameLogic(p1, p2){
	if(p1.move == p2.move){
		return null;
	}
	else if(p1.move == "rock" && p2.move == "scissors" ||
		p1.move == "scissors" && p2.move == "paper" ||
		p1.move == "paper" && p2.move == "rock" ){
		return p1
	}
	else{
		return p2
	}
}
function getTurnCount(){return turnCount}

class player{
	constructor(socketId) {
		this.socketId = socketId
		this.name = ""
		this.score = 0
		this.move = ""
		this.turnCount = 0;
	}
	incrementScore(){this.score++;}
	incrementTurn(){this.turnCount++;}
	setName(name){this.name = name}
	setMove(move){this.move = move}
}