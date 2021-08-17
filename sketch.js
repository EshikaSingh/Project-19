var PLAY = 1;

var END = 0;

var gameState = PLAY;

var ground;

var rabbit;

var invisibleGround;

var cloud;

var cloudGroup;

var sun;

var carrot;

var carrotGroup;

var Life = 1;

var Score = 0;

var cat;

function preload(){
  
  groundImage = loadImage("ground-3.png");
  
  rabbit_Animation = loadAnimation("rabbit (1).png", "rabbit (2).png", "rabbit (3).png", "rabbit (4).png", "rabbit (5).png", "rabbit (6).png", "rabbit (7).png");
  
  jumpSound = loadSound("sound.mp3");
  
  cloudImage = loadImage("cloud.2.png");
  
  sunImage = loadImage("sun.png");
  
  carrotImage = loadImage("carrot.png");
   
  catAnimation = loadAnimation("cat (1).png", "cat (2).png", "cat (3).png", "cat (4).png", "cat (5).png", "cat (6).png", "cat (7).png", "cat (8).png", "cat (9).png", "cat (10).png", "cat (11).png", "cat (12).png");
  
  scaredRabbit = loadImage("rabbit (5).png");
  
  collidedCat = loadImage("cat (1).png");
  
  restartImage = loadImage("restart.Image.png");
  
  gameOverImg = loadImage("gameOver.png");
  
  gameOverSound = loadSound("GameOverSound.mp3");
}

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(4 + 3*Score/100);
  
  rabbit = createSprite(90,height-70,20,50);
  rabbit.addAnimation("rabbit", rabbit_Animation);
  
  invisibleGround = createSprite(200,height -15,400,10);
  invisibleGround.visible = false;
  
  sun = createSprite(width-100,100,10,10);
  sun.addImage(sunImage);
  sun.depth = 0.5;
  sun.scale = 0.3;
  
  restart = createSprite(width/2,height/1.5);
  restart.addImage(restartImage);
  restart.scale = 0.2;
  
  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.3;
  
  restart.visible = false;
  
  gameOver.visible = false;
  
  cloudGroup = new Group();
  
  carrotGroup = new Group();
  
  catGroup = new Group();
  
  catGroup.debug = true;
}

function draw() {
  
  background("yellow");
  
    
  rabbit.collide(invisibleGround);
  
  if (gameState === PLAY){
    
   if(ground.x < 0){
    
   ground.x = ground.width/2; 
  }
  
   if((touches.length > 0 || keyDown("SPACE")) && rabbit.y  >= height-120) {
      rabbit.velocityY = -14;
      jumpSound.play();
       touches = [];
    }
  
  rabbit.velocityY = rabbit.velocityY + 0.3;
    
   if(frameCount % 200 === 0){
    
    spawnClouds();
  }
 
  if(frameCount % 200 === 0){
    
    carrot();
  }
  
  for(var i = 0; i < carrotGroup.length; i++){
    if(carrotGroup.get(i).isTouching(rabbit)){
      carrotGroup.get(i).destroy();
      rabbit.scale = rabbit.scale + 0.01;
      Score = Score + 2;
    }
  }
    
  if(frameCount % 300 === 0){
      
      Cat();
  }
   
  if(catGroup.isTouching(rabbit)){
    
     Life = Life - 1;
   
     gameState = END;
    }
    
  }
  
  if(gameState === END){
    
    restart.visible = true;
    
    ground.velocityX = 0;
    carrotGroup.setVelocityXEach(0);
    catGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    
    rabbit.addAnimation("rabbit", scaredRabbit);
    cat.addAnimation("cat", collidedCat);
    
    carrotGroup.setLifetimeEach(-1);
    catGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
     if(mousePressedOver(restart)) {
      if(Life > 0){
       reset(); 
      }
      else
        {
          gameOver.visible = true;
          restart.visible = false;
          gameState = 2;
          gameOverSound.play();
        }
    
  }
    
  }
  
 drawSprites();
  
  textSize(25);
  fill("black");
  text(" Life: " + Life, 20, 30);
  
  textSize(25);
  fill("black");
  text("Score: " + Score, 25, 70)
}

function spawnClouds() {
    
    var cloud = createSprite(width+20,height-300,40,10);
    
    cloud.y = Math.round(random(60,100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.2;
    cloud.velocityX = -(3 + Score/4);
    
     //assign lifetime to the variable
    cloud.lifetime = -1;
    
    //adjust the depth
    cloud.depth = rabbit.depth;
    rabbit.depth = rabbit.depth + 1;
      
    //add each cloud to the group
    cloudGroup.add(cloud);
}

function carrot(){
  
  var carrot = createSprite(1000, width-100,100,10,10)
  carrot.y = Math.round(random(550, 350));
  carrot.addImage(carrotImage);
  carrot.scale = 0.1;
  carrot.velocityX = -(4 + Score/4);
  
  carrot.lifetime = -1;
  
  carrotGroup.add(carrot);
}

function Cat(){
  
    cat = createSprite(1000,height-50,20,50);
    cat.addAnimation("cat", catAnimation);
    cat.velocityX = -(4 + Score/4);
    cat.scale = 1.5;
    cat.lifetime = -1;
  
   catGroup.add(cat);
}

function reset(){
  
  gameState = PLAY;
  
  restart.visible = false;
  
  catGroup.destroyEach();
  
  cloudGroup.destroyEach();
  
  carrotGroup.destroyEach();
  
  rabbit.addAnimation("rabbit", rabbit_Animation);
  
  cat.addAnimation("cat", catAnimation);

  ground.velocityX = -4;
  ground.depth = 0.8;
}
