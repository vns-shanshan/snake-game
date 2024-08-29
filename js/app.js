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
let gameStarted = false;

const gameBoard = new Array(10).fill(null).map(() => new Array(10).fill(""));

const initAvoidPositions = [{ x: 0, y: 9 }, { x: 1, y: 9 }, { x: 2, y: 9 }, { x: 3, y: 9 },
{ x: 4, y: 9 }, { x: 5, y: 9 }, { x: 6, y: 9 }, { x: 7, y: 9 }, { x: 8, y: 9 },
{ x: 9, y: 9 }];
let snake = getSnakeInitPosition();
let snakeHead = { ...snake[0] };


let foodPosition = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };

let speed = 500; // time needed for 1 move
let score = 0;
let gameOver = false;
let isMuted = false;
let userInteracted = false;

//1.5) Load sounds
const eatingSound = new Audio("./assets/audio/eating.mp3");
const hitWallSound = new Audio("./assets/audio/hit-wall.mp3");

//2) Store cached element references.
const startPageEl = document.querySelector(".start-page")
const startBtnEl = document.getElementById("start-btn");
const gameBoardEl = document.querySelector("#game-board-body");
const scoreEl = document.querySelector("#score");
const messageEl = document.getElementById("message");
const restartBtnEl = document.getElementById("restart-btn");

const upArrow = document.getElementById("up-arrow");
const downArrow = document.getElementById("down-arrow");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

const volume = document.getElementById("volume");
//3) Upon loading, the game state should be initialized, and a function should be called to render this game state.

startBtnEl.addEventListener("click", () => {
    gameStarted = true;
    startPageEl.classList.add("hidden");

    init();
});

function init() {
    if (gameStarted) {
        drawGameBoard();
        insertData();
        render();
        setupKeyBoardEvt();
        setupClickEvt();
        volume.addEventListener("click", toggleSound);
        playGame();
    }
}


function drawGameBoard() {
    for (let i = 0; i < gameBoard.length; i++) {
        let rowStr = "<tr>";

        for (let j = 0; j < gameBoard[0].length; j++) {
            let cellStr = `<td id="${i}-${j}"></td>`
            rowStr += cellStr;
        }

        rowStr += "</tr>"
        gameBoardEl.innerHTML += rowStr;
    }
}

function getSnakeInitPosition() {
    let snakePosition;

    while (true) {
        snakePosition = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10), direction: "right" }

        let isAvoided = false;
        for (let i = 0; i < initAvoidPositions.length; i++) {
            if (snakePosition.x === initAvoidPositions[i].x && snakePosition.y === initAvoidPositions[i].y) {
                isAvoided = true;
                break;
            }
        }

        if (!isAvoided) {
            return [snakePosition];
        }

    }
}

function insertData() {
    // insert food
    gameBoard[foodPosition.x][foodPosition.y] = "🟥";

    // insert snake 
    for (let i = 0; i < snake.length; i++) {
        gameBoard[snake[i].x][snake[i].y] = "🟩";
    }
}

function playGame() {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
        move();
        checkGameOver();

        if (gameOver) {
            clearInterval(gameLoop);
            endGame();
        } else {
            clearBoard();
            // put snake on gameboard
            insertData();
            // call render()
            render();
        }

    }, speed);
}

// clear gameboard
function clearBoard() {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard.length; j++) {
            gameBoard[i][j] = "";
        }
    }
}

// Move snake
function move() {
    const newSnakeHead = { ...snakeHead };

    // Snake move
    switch (snakeHead.direction) {
        case "up":
            newSnakeHead.x--;
            break;
        case "down":
            newSnakeHead.x++;
            break;
        case "right":
            newSnakeHead.y++;
            break;
        case "left":
            newSnakeHead.y--;
            break;
        default:
            break;
    }

    // Check if snake has eaten the food
    if (newSnakeHead.x === foodPosition.x && newSnakeHead.y === foodPosition.y) {
        handleFoodEaten();
    } else {
        snake.pop();
    }

    // Add the new head to the snake
    snake.unshift(newSnakeHead);

    // Update old snakehead
    snakeHead.x = newSnakeHead.x;
    snakeHead.y = newSnakeHead.y;
}

// food eaten
function handleFoodEaten() {
    // Play food eaten sound
    eatingSound.volume = .05;

    if (userInteracted) {
        eatingSound.play();
    }

    // Food disappear and add new food
    addNewFood();

    // Score++
    updateScore();
}

function addNewFood() {
    let newX = Math.floor(Math.random() * 10);
    let newY = Math.floor(Math.random() * 10);

    while (gameBoard[newX][newY]) {
        newX = Math.floor(Math.random() * 10);
        newY = Math.floor(Math.random() * 10);
    }

    foodPosition.x = newX;
    foodPosition.y = newY;
}

function updateScore() {
    score++;
}

function toggleSound() {
    isMuted = !isMuted;

    if (isMuted) {
        volume.innerText = "🔇";
        eatingSound.muted = true;
        hitWallSound.muted = true;
    } else {
        volume.innerText = "🔊";
        eatingSound.muted = false;
        hitWallSound.muted = false;
    }
}

//4) The state of the game should be rendered to the user.
function render() {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            const cell = document.getElementById(`${i}-${j}`);
            cell.innerText = gameBoard[i][j];
        }
    }

    scoreEl.innerText = `Score: ${score}`
}

//5) Handle the game over logic
function checkGameOver() {
    // if snake hits the wall
    if (snakeHead.x < 0 || snakeHead.x > 9 || snakeHead.y < 0 || snakeHead.y > 9) {
        gameOver = true;

    }

    // if snake eats itself
    for (let i = 1; i < snake.length; i++) {
        if (snakeHead.x === snake[i].x && snakeHead.y === snake[i].y) {
            gameOver = true;
        }
    }

    if (gameOver) {
        hitWallSound.volume = .05;
        if (userInteracted) {
            hitWallSound.play();
        }
    }
}

//6) Handle a player clicking with a handleClick` function.
// Keyboard event
function setupKeyBoardEvt() {
    document.addEventListener("keydown", function (e) {
        if (!gameStarted) return;

        const allowedKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]

        if (allowedKeys.includes(e.code) === false) {
            return;
        }

        let newDir = undefined;
        let isOppositeDir = false;

        switch (e.code) {
            case "KeyW":
            case "ArrowUp":
                newDir = "up";
                isOppositeDir = snakeHead.direction === "down";
                break;

            case "KeyS":
            case "ArrowDown":
                newDir = "down";
                isOppositeDir = snakeHead.direction === "up";
                break;

            case "KeyA":
            case "ArrowLeft":
                newDir = "left";
                isOppositeDir = snakeHead.direction === "right";
                break;

            case "KeyD":
            case "ArrowRight":
                newDir = "right";
                isOppositeDir = snakeHead.direction === "left";
                break;

            default:
                break;
        }

        if (!isOppositeDir) {
            snakeHead.direction = newDir;
        }
    })
}

// Click event
function setupClickEvt() {
    function changeDirectionOnClick(e, arrowDirection) {
        if (!gameStarted) return;

        let isOppositeDir = false;

        switch (e.target.id) {
            case "up-arrow":
                arrowDirection = "up";
                isOppositeDir = snakeHead.direction === "down";
                break;

            case "down-arrow":
                arrowDirection = "down";
                isOppositeDir = snakeHead.direction === "up";
                break;

            case "left-arrow":
                arrowDirection = "left";
                isOppositeDir = snakeHead.direction === "right";
                break;

            case "right-arrow":
                arrowDirection = "right";
                isOppositeDir = snakeHead.direction === "left";
                break;

            default:
                break;
        }

        if (!isOppositeDir) {
            snakeHead.direction = arrowDirection;
        }
    };

    upArrow.addEventListener("click", (e) => changeDirectionOnClick(e, "up"));
    downArrow.addEventListener("click", (e) => changeDirectionOnClick(e, "down"));
    leftArrow.addEventListener("click", (e) => changeDirectionOnClick(e, "left"));
    rightArrow.addEventListener("click", (e) => changeDirectionOnClick(e, "right"));
}

//7) Create Reset functionality
function endGame() {
    messageEl.style.visibility = "visible";
    restartBtnEl.style.visibility = "visible";

    restartBtnEl.addEventListener("click", restartGame);
}

function restartGame() {
    // Reset Game state
    clearBoard();
    snake = getSnakeInitPosition();
    snakeHead = { ...snake[0] };
    foodPosition = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };
    score = 0;
    gameOver = false;

    // update UI
    messageEl.style.visibility = "hidden";
    restartBtnEl.style.visibility = "hidden";

    render();
    playGame();
}

document.addEventListener("click", () => {
    userInteracted = true;
}, { once: true });
document.addEventListener("keydown", () => {
    userInteracted = true;
}, { once: true });

init();