/*
Gives us acces to the necessary HTML elements in Javascript
*/
const CANVAS = document.getElementById("board");
const CANVAS_CTX = CANVAS.getContext("2d");
const scoreDisplay = document.getElementById("score");

/*
Variables and function relating to the game
*/
let score = 0;
scoreDisplay.innerText = score;
const FPS = 20;
let gameOver = false;

/*
Variables and function relating to the grid
*/
const BLOCK_SIZE = 10;
const COLUMNS_ROWS = 50;
function randomBlockCoordinate(){
  let num = (Math.floor(Math.random()*COLUMNS_ROWS)*BLOCK_SIZE);
  return num;
}

/*
Sets constant directions for left, up, right, down in a sort-of numerical enum format
*/
const DIRECTION_LEFT = 0;
const DIRECTION_UP = 1;
const DIRECTION_RIGHT = 2;
const DIRECTION_DOWN = 3;

/*
Variables and objects related to the snake. Its starting body, its color, and its starting direction
*/
const SNAKE_BODY = [{x:250,y:250},{x:260,y:250},{x:270,y:250}, {x:280,y:250}, {x:290,y:250}, {x:300,y:250}];
const SNAKE_COLOR = "green";
let snakeCurrentDirection = 0;

/*
Variables and objects related to the fruit. Its starting coordinates and color
*/
const FRUIT = {x:100,y:100};
const FRUIT_COLOR = "red";

/*
Function for setting snake's direction when needed
*/
document.body.addEventListener("keydown", keyDown);
function keyDown(event) {
if (event.keyCode == 38 || event.keyCode == 87) {
  if(snakeCurrentDirection !== DIRECTION_DOWN)
  {
    snakeCurrentDirection = DIRECTION_UP;
  }
}
if (event.keyCode == 40 || event.keyCode == 83) {
  if(snakeCurrentDirection !== DIRECTION_UP)
  {
    snakeCurrentDirection = DIRECTION_DOWN;
  }
}
if (event.keyCode == 37 || event.keyCode == 65) {
  if(snakeCurrentDirection !== DIRECTION_RIGHT)
  {
    snakeCurrentDirection = DIRECTION_LEFT;
  }
}
if (event.keyCode == 39 || event.keyCode == 68) {
  if(snakeCurrentDirection !== DIRECTION_LEFT){
    snakeCurrentDirection = DIRECTION_RIGHT;
  }
}
}

/*
Function for drawing squares
*/
function createRect(x, y, width, height, color) {
  CANVAS_CTX.fillStyle = color;
  CANVAS_CTX.fillRect(x,y,width,height);
}

/*
Draws black square over entire canvas. This will draw over all the previous drawings, making previous frames disappear
*/
function drawMap(){
  createRect(0,0,CANVAS.width,CANVAS.height,"black");
}

/*
Loops through the snake and draws each individual element at it's respective location
*/
function drawSnake(){
  for(let i = 0; i < SNAKE_BODY.length; i++)
    {
      createRect(SNAKE_BODY[i].x,SNAKE_BODY[i].y,BLOCK_SIZE,BLOCK_SIZE,SNAKE_COLOR);
    }
}

/*
Draws the fruit at it's set coordinates. Note that since draw comes after update, the fruit will always be where it's supposed to be.
*/
function drawFruit(){
  createRect(FRUIT.x,FRUIT.y,BLOCK_SIZE,BLOCK_SIZE,FRUIT_COLOR);
}

/*
Calls all the draw functions
*/
function draw(){
  drawMap();
  drawSnake();
  drawFruit();
}

/*
Depending on current direction, adds a new head to the snake in the direction it's heading, then deletes it's tail.
*/
function moveSnake(){
  switch(snakeCurrentDirection)
  {
    case 0:
      SNAKE_BODY.unshift({x:(SNAKE_BODY[0].x-BLOCK_SIZE),y:SNAKE_BODY[0].y});
      break;
    case 1:
      SNAKE_BODY.unshift({x:SNAKE_BODY[0].x,y:(SNAKE_BODY[0].y-BLOCK_SIZE)});
      break;
    case 2:
      SNAKE_BODY.unshift({x:(SNAKE_BODY[0].x+BLOCK_SIZE),y:SNAKE_BODY[0].y});
      break;
    case 3:
      SNAKE_BODY.unshift({x:SNAKE_BODY[0].x,y:(SNAKE_BODY[0].y+BLOCK_SIZE)});
      break;
  }
  SNAKE_BODY.pop();
}

/*
Sets game over to true if the snake's head is on the same XY coordinate as any of it's body parts.
*/
function checkIfSnakeTouchingSelf(){
  if(SNAKE_BODY.length > 1)
  {
    for(let i = 1; i < SNAKE_BODY.length; i++)
    {
      if(SNAKE_BODY[0].x == SNAKE_BODY[i].x && SNAKE_BODY[0].y == SNAKE_BODY[i].y)
      {
        gameOver=true;
        window.alert("Game Over!");
      }
    }
  }
}

/*
Sets game over to true if the snake's head is out of bounds
*/
function checkIfSnakeOutOfBounds(){
  if((SNAKE_BODY[0].x < 0)||(SNAKE_BODY[0].x > ((COLUMNS_ROWS*BLOCK_SIZE)-BLOCK_SIZE))||(SNAKE_BODY[0].y < 0)||(SNAKE_BODY[0].y > ((COLUMNS_ROWS*BLOCK_SIZE)-BLOCK_SIZE)))
  {
    gameOver=true;
    window.alert("Game Over!");
  }
}

/*
Depending on snake's current direction, adds a new element to the front of the snake array in the right place, making it the new head
*/
function growSnake(){
  switch(snakeCurrentDirection)
  {
    case 0:
      SNAKE_BODY.unshift({x:(SNAKE_BODY[0].x-BLOCK_SIZE),y:SNAKE_BODY[0].y});
      break;
    case 1:
      SNAKE_BODY.unshift({x:SNAKE_BODY[0].x,y:(SNAKE_BODY[0].y-BLOCK_SIZE)});
      break;
    case 2:
      SNAKE_BODY.unshift({x:(SNAKE_BODY[0].x+BLOCK_SIZE),y:SNAKE_BODY[0].y});
      break;
    case 3:
      SNAKE_BODY.unshift({x:SNAKE_BODY[0].x,y:(SNAKE_BODY[0].y+BLOCK_SIZE)});
      break;
  }
}

/*
Checks if the passed-in coordinates are the same as any of the snake's body's coordinates
*/
function checkValidPosition(x, y)
{
  for(let i = 0; i < SNAKE_BODY.length; i++)
  {
    if((x == SNAKE_BODY[i].x) && (y == SNAKE_BODY[i].y))
    {
      return false;
    }
  }
  return true;
}

/*
Moves the fruit to a random location. Checks if new location is valid. If not, generates a new location. Repeats until valid location is found
*/
function moveFruit(){
  let newFruitX = randomBlockCoordinate();
  let newFruitY = randomBlockCoordinate();
  while(checkValidPosition(newFruitX, newFruitY) == false)
  {
    newFruitX = randomBlockCoordinate();
    newFruitY = randomBlockCoordinate();
  }
  FRUIT.x = newFruitX;
  FRUIT.y = newFruitY;
}

//Increments the score by one, then sets the document's score display to the updated score
function updateScore(){
  score++;
  scoreDisplay.innerText = score;
}

/*
Checks if the snake's head is on the same XY coordinate as the fruit. If so, calls a series of functions

1. Pushes a new element to the front of the snake body, which now becomes the snake's head. This grows the snake by one element.
2. Moves the fruit to a new location
3. Updates the score
*/
function checkFoodBeingEaten(){
  if(SNAKE_BODY[0].x == FRUIT.x && SNAKE_BODY[0].y == FRUIT.y)
  {
    growSnake();
    moveFruit();
    updateScore();
  }
}

/*
Four functions:

1. Moves the snake head forward in the direction it's heading, and removes the last element of the tail
2. Checks if the snake's head is on the same XY coordinate of any of it's body elements, which would mean it is touching itself, which causes the game to end
3. Checks if the snake's head is out of bounds based on XY coordinate, which causes the game to end
4. Checks if the snake's head is on the same XY coordinate as the fruit. If so, calls a series of functions
*/
function update()
{
  moveSnake();
  checkIfSnakeTouchingSelf();
  checkIfSnakeOutOfBounds();
  checkFoodBeingEaten();
}

//first checks to see if anything has caused the gameOver to be true. Afterwards, updates the game's data and then draws the game's visuals
function game()
{
  if(gameOver == true)
  {
    return;
  }
  update();
  draw();
}

//Starts the game by calling the game function once, then calls it 30 times per second
setTimeout(game,0);
setInterval(game, 1000/FPS);