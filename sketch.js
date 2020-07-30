// Define classifier variables
let classifier;
let imageModelURL; 
let video;
let label = "";


// Define variables for game
let backgroundColor;
let rpsImg;
let nameInp;
let startButton;
let picButton;
let gameStarted = false;
let img;
let playerName;
let nextButton;
let otherPlayerMove;

// Define variables for server
var socket;


// Load images and classifier model
function preload() {
  rpsImg = loadImage('https://cdn.glitch.com/510615fe-ffb5-4338-b264-765da51283d4%2Frps.png?v=1595969985228');
  imageModeURL = 'https://teachablemachine.withgoogle.com/models/Lguli4ka4/';
  classifier = ml5.imageClassifier(imageModeURL + 'model.json');
}

let gotImg = false;
let currentImg;
function setup() {
  createCanvas(400, 400);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = 90;
  background(backgroundColor);


  // Shows initial start page
  startPage();

  // Start socket connection to server
  socket = io.connect('http://localhost:3000');


  // Get other player label
  socket.on('otherPlayerLabel', 
    function (data) {
      //console.log('GOT BACK', data.move);
      
      // Save move that isn't current label as other player label
      if (data.id != socket.id) {
        otherPlayerMove = data.move;
        console.log(data.name + ' chose: ' + otherPlayerMove);
      }
    }
  
  )


  video = createCapture(VIDEO);
  video.size(400, 400);
  video.position(10, 5);
  // Initially hide video object
  video.hide();
  
  // Button to take picture
  picButton = createButton("SNAP PICTURE");
  picButton.position(width/2.5, 370);
  picButton.hide();
  

  // Button to see results after classification
  nextButton = createButton("NEXT");
  nextButton.position(width/2.5, 380);
  nextButton.hide();

  // Save image if button clicked
  picButton.mousePressed(() => {
    // Get current image
    img = saveImage();
    currentImg = getImage(img);
    gotImg = true;
    
    // Classify image
    classifier.classify(currentImg, gotResult);
    
    // While result has not been received, draw waiting text
    if (!result) {
      textSize(32);
      textAlign(CENTER, CENTER);
      fill(0);
      text("waiting...", width / 2, height - 40);
    } 

  });
  
}


let firstTimeSetup = false;
let nextPressed = false;

function draw() {
  
  // Draw rock paper scissors image
  image(rpsImg, width/3, 110, 150, 150);
  
  // If game hasn't started, don't run draw
  if (!gameStarted) {
    return;
  }
  
  // Set screen to game page
  if (!firstTimeSetup) {
    gamePage();
    picButton.show();
    // displayName();

    // Display snapshot image
    if (gotImg) {
      displayImage(currentImg);
      picButton.hide();
      video.hide();
    } 
  }
  

  if (result) {
    // Show next button
    nextButton.show();

    // Show next screen when button pressed
    nextButton.mousePressed(() => {
      nextPressed = true;
    }
      
    );
  }
}


// Return current image (snapshot)
function getImage(currentImage) {
  let pic = currentImage;
  return pic;
}

// Hide video and display current image
function displayImage(imgToDisplay) {
  image(imgToDisplay, 0, 30, 400, 300);
  //noLoop();

  if (nextPressed) {
    background(backgroundColor);
    resultPage();
  }
}

function displayName() {
  text(playerName, 200, 360);
  //noLoop();
}


function startPage() {
  let title = "ROCK PAPER SCISSORS!"
  // Title
  textAlign(CENTER);
  textStyle(BOLDITALIC);
  textSize(25);
  text(title, width/2, 50);
  
  // Directions
  // TO-DO: replace with printDirections function
  textStyle(NORMAL);
  textSize(15);
  text("Directions: this is how you play this game.",
      width/2, 90);
  
  // Text input for name
  textAlign(CENTER);
  text('ENTER YOUR NAME', width/2, 300);
  nameInp = createInput('')
  nameInp.position(width/3, 320);
  
  
  // Start button for game
  startButton = createButton('START GAME');
  startButton.position(width/2.5, 355);
  
  // When start button pressed, start game
  startButton.mousePressed(() => {
    gameStarted = true;
    nameInp.hide();
    startButton.hide();
    background(backgroundColor);
    
    // Get player name
    playerName = nameInp.value();
    
    // Send player name to socket
    sendName(playerName);

  });
}

// Sets gamePage which allows user to access webcam and take picture of their self
function gamePage() {
  // Start video capture
  video.show();
   
}


function resultPage() {
  
  text(`Player name chose: ${otherPlayerMove}`, 200, 20);
  text("You won/You loss", 200, 40);
  nextButton.hide();
}


// Save image in current capture
function saveImage() {
  let img = video.get();
  return img;
}

// Reset to default start page
// TO-DO: finish this function
// function newGame() {
//   background(backgroundColor);
  
//   gameStarted = false;
  
//   // 
//   if (firstTimeSetup) {
//     picButton.hide();
//   }
// }


// Boolean shows if result has been received
let result = false;
// When we get a result from classifier
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
  }

  result = true;
  // The results are in an array ordered by confidence.
  label = results[0].label;
  console.log(label);
  // console.log(results[0]);
  
  // Reset background to remove waiting text
  background(backgroundColor);
  
  // Draw the label
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0);
  text(label, width / 2, height - 40);

  // Send label to socket
  sendLabel(label);
}


// TO-DO: Ask for confirmation that label is correct, otherwise redo picture

function sendName(name) {
  var nameObj = {
    name: name
  }
  
  socket.emit('gotName', nameObj);
}


function sendLabel(label) {

  var labelObj = {
    label: label
  }
  
  socket.emit('gotLabel', labelObj);
}

