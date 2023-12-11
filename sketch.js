let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/mwQrQODlI/';

let video;
let label = "";

let buttonX, buttonY;

let menu, flip;

let shutterBtn;
let autoBtn;
let poseBtn;


let tempState = 0;
let autoState = 0;


// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  
  menu = loadImage("menu.png");
  flip = loadImage("flip.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  buttonX = width / 2;
  buttonY = height / 2;

  //video = createCapture(VIDEO);
  video = createCapture({video: { facingMode: { exact: "environment" } },
  });
  video.hide();
  classifyVideo();
  layoutDraw();

  rectMode(CENTER);
  
  shutterBtn = createButton('');
  shutterBtn.class('shutterBtn');
  shutterBtn.position(buttonX - (height * 0.12) / 2, height * 0.88 - (height * 0.12) / 2);
  shutterBtn.size(height * 0.12, height * 0.12);
  captureBtn();
  
  autoBtn = createButton('AUTO');
  autoBtn.style('text-align', 'center');
  autoBtn.class('autoBtn');
  autoBtn.position(width/2-(width*0.15/2), height * 0.015);
  autoBtn.size(width*0.15, height * 0.04);

  
  // GalleryBtn (왼쪽 하단)
  gallBtn = createButton('PHOTO');
  gallBtn.class('gallBtn');
  gallBtn.position(width - (width * 0.75 + height * 0.11), height * 0.87 - (height * 0.09) / 2);
  gallBtn.size(height * 0.11, height * 0.1);
  

  poseBtn = createButton('POSE');
  poseBtn.class('poseBtn');
  poseBtn.position(width - (width * 0.25), height * 0.87 - (height * 0.09) / 2);
  poseBtn.size(height * 0.11, height * 0.1);

}

function draw() {
  image(video, 0, height * 0.07, width, height * 0.66); 
  image(menu, width * 0.03, height * 0.02, width * 0.06, height * 0.03);
  image(flip, width * 0.91, height * 0.02, width * 0.06, height * 0.03);
  drawGrid(3,3);
  
  if(tempState == 0){
    detectPlace();
  }
  
  if(autoState == 0) {
    autoBtn.style('text-decoration', 'line-through');
  }
}

function detectPlace() {
  let rectWidth = width * 0.7;
  let rectHeight = height * 0.13;
  let rectRadius = 10;
  
  
  if (label == "") {
    fill(255,153,0,50);
    stroke(255,153,0);
    strokeWeight(4);
    circle(width/2, height*0.4, height*0.22);
    
    fill(255,153,0);
    noStroke();
    textSize(32);
    textAlign(CENTER);
    text('장소 스캔중...', width/2, height*0.4);
  }
  else {
    fill(255,255,255,200);
    noStroke();
    rect(width/2, height * 0.07, rectWidth, rectHeight, rectRadius);
    
    fill(0);
    textSize(36);
    textAlign(CENTER);
    text(' 📍 '+ label, width/2, height*0.13);
  }
  
}


function layoutDraw() {
  // 상단 레이아웃 박스
  fill(255);
  noStroke();
  rect(0, 0, width, height * 0.07);

  fill(0);
  noStroke();
  rect(0, height * 0.73, width, height * 0.27);
}

function captureBtn() {
  fill(255);
  noStroke();
  circle(buttonX, height * 0.88, height * 0.13);
}

function drawGrid(rows, cols) {
  stroke(255,255,255,130);
  strokeWeight(1);
  line(width*0.3, height*0.07, width*0.3, height*0.73);
  line(width*0.6, height*0.07, width*0.6, height*0.73);
  line(0, height*0.29, width, height*0.29);
  line(0, height*0.51, width, height*0.51);
}











// Get a prediction for the current video frame
function classifyVideo() {
  //flippedVideo = ml5.flipImage(video)
  //classifier.classify(flippedVideo, gotResult);
  //flippedVideo.remove();
  classifier.classify(video, gotResult);

}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;
  // Classifiy again!
  classifyVideo();
}

