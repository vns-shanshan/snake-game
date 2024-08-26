// console.log("Hello")

// --------------- User Requirements ------------------ 
/*
Basic
As a user, I want to see a food appear on a random block in the game board.
As a user, I want to control the snake’s direction using arrow keys (up, down, left, right).
As a user, I want the speed of the snake to be consistent.
As a user, I want to see the snake grow longer when it eats food on the game board.
As a user, I want to see the current score displayed.
*/

/*
Game Over
As a user, I want to see the losing conditions, which are when the snake hits the wall or the snake eats itself.
As a user, I want to see a “Game Over” message on screen when the losing conditions are met.
*/

/*
Restart
As a user, I want to see a restart button displayed under the “Game Over” message.
*/
// ------------------- -- - ------------------------------

//1) Define the required variables used to track the state of the game.
const gameBoard = [[]];
let snakeHead = { x, y };
let foodPosition = { x, y };

let direction = string;

let speed = 500; // time needed for 1 move

let score = 0;

let gameOver = false;

//2) Store cached element references.
const gameBoardEl = document.querySelector(".game-board");

const scoreEl = document.querySelector("#score");
const messageEl = document.getElementById("message");
const restartBtnEl = document.getElementById("restart-btn");

//3) Upon loading, the game state should be initialized, and a function should be called to render this game state.
function init() {
    render();
}
init();

