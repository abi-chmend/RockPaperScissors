// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket;
var players = []
var move = ""
var thisPlayerIndex;
var timer  = 0

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://localhost:3000');
  // We make a named event called 'mouse' and write an
  // anonymous callback function

  // socket.on('score',
  //     function (score) {
  //     background(0)
  //         console.log(`Current score: ${score}`);
  //         fill(255)
  //         text(score, 100,100)
  //         text(move, 100,150)
  //     }
  // )
    socket.on('players',
        function (players) {
            players = players
            for(let i =0;i<players.length;i++){
                if(players[i].socketId == socket.id){
                    thisPlayerIndex = i
                    background(0)
                    fill(255)
                    text(players[thisPlayerIndex].score, 100,100)
                    text(players[thisPlayerIndex].move, 100,150)
                    text(players[thisPlayerIndex].socketId, 100, 200)
                    text("turn num: " + players[thisPlayerIndex].turnCount, 100 , 250  )
                }
            }
        }
    )
    socket.on('winner',
        function(winString){
            text("winner: " + winString, 100, 300)
        })
}

function draw() {
  // Nothing
}

function keyPressed(){

    var rand = Math.round(Math.random()*3+.5)
    switch (rand) {
        case 1:move = "rock"; break;
        case 2:move = "paper"; break;
        case 3:move = "scissors"; break;
    }
    var moveObj = {
        move:move,
        socketId:socket.id
    }
    text(move, 100,150)
    socket.emit('move',moveObj)
    console.log("m sent")

}
