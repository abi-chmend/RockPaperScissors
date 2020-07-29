// intialize classifier variables
let classifier;
let imageModelURL; 
let video;
let flippedVideo;
let label = "";


// initialize variables for game
let backgroundColor;
let rpsImg;
let nameInp;
let startButton;

let gameStarted = false;

function preload() {
  rpsImg = loadImage('https://cdn.glitch.com/510615fe-ffb5-4338-b264-765da51283d4%2Frps.png?v=1595969985228');
  classifier;
}



function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 90;
  background(backgroundColor);
  
  startPage();

}

function draw() {
  
  // If game hasn't started, don't run draw
  if (!gameStarted) {
    return;
  }
  
  
  // Set screen to game page
  
  
}


function startPage() {
  
  // Title
  textAlign(CENTER);
  textStyle(BOLDITALIC);
  textSize(25);
  text("ROCK PAPER SCISSORS!", width/2, 50);
  
  // Directions
  // TO-DO: replace with printDirections function
  textStyle(NORMAL);
  textSize(15);
  text("Directions: this is how you play this game.",
      width/2, 90);
  
  // Rock paper scissors image
  image(rpsImg, width/3, 110, 150, 150);
  
  
  // Text input for name
  textAlign(CENTER);
  text('ENTER YOUR NAME', width/2, 300);
  nameInp = createInput('')
  nameInp.position(width/3, 320);
  
  
  // Start button for game
  startButton = createButton('START GAME');
  startButton.position(width/2.5, 355);
  
  // When start button pressed, start game
  startButton.mousePressed(startGame);
  
}

function startGame() {
  
  // Set game started to true
  gameStarted = true;
  
  // get input from textbox and construct player based on name
  let player1 = new Player(nameInp.value());

}


// Sets gamePage which allows user to access webcam and take picture of their self
function gamePage() {
  
  // Start video capture
  
}


function newGame() {
  background(backgroundColor);
  
  gameStarted = false;
}


class Player {
  
  constructor(name) {
    this.name = name;
    //this.socketID = socketID;
  }
  
  
  getName() {
    return this.name;
  }
  
  getScore() {
    
  }
  
  
  
}