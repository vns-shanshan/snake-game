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
const gameBoard = new Array(10).fill(null).map(() => new Array(10).fill(""));
let snake = [{ x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10), direction: "right" }];
let snakeHead = snake[0];
let snakeTail = { x: snakeHead.x, y: snakeHead.y, direction: snakeHead.direction };
let foodPosition = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };

let turningPointToAdd;
// [{x, y, direction: str}...]
let turningPoints = [];

let speed = 500; // time needed for 1 move

let score = 0;

let gameOver = false;

//2) Store cached element references.
const gameBoardEl = document.querySelector("#game-board-body");

const scoreEl = document.querySelector("#score");
const messageEl = document.getElementById("message");
const restartBtnEl = document.getElementById("restart-btn");

const upArrow = document.getElementById("up-arrow");
const downArrow = document.getElementById("down-arrow");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

//3) Upon loading, the game state should be initialized, and a function should be called to render this game state.
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

function init() {
    drawGameBoard();
    insertData();
    render();
    setupKeyBoardEvt();
    setupClickEvt();
    play();
}
init();

function play() {
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

function insertData() {
    // insert food
    gameBoard[foodPosition.x][foodPosition.y] = "🐭";

    // insert snake head
    // gameBoard[snakeHead.x][snakeHead.y] = "🐍";

    // insert snake 
    for (let i = 0; i < snake.length; i++) {
        gameBoard[snake[i].x][snake[i].y] = "🐍";
    }
}

// Move snake
function move() {
    snakeTail.x = snake[snake.length - 1].x;
    snakeTail.y = snake[snake.length - 1].y;
    snakeTail.direction = snake[snake.length - 1].direction;

    let shouldRemoveFirstTurningPoint = false;
    for (let i = 0; i < snake.length; i++) {
        for (let j = 0; j < turningPoints.length; j++) {
            const snakePart = snake[i];
            if (snakePart.x === turningPoints[j].x
                && snakePart.y === turningPoints[j].y
            ) {
                snakePart.direction = turningPoints[j].direction;

                if (i === snake.length - 1) {
                    shouldRemoveFirstTurningPoint = true;
                }
            }
        }
    }

    if (shouldRemoveFirstTurningPoint) {
        turningPoints.shift();
    }

    console.log(turningPoints.length)


    for (let i = 0; i < snake.length; i++) {
        if (snake[i].direction === "right") {
            snake[i].y += 1;
        } else if (snake[i].direction === "left") {
            snake[i].y -= 1;
        } else if (snake[i].direction === "up") {
            snake[i].x -= 1;
        } else if (snake[i].direction === "down") {
            snake[i].x += 1;
        }


    }

    // Check if snake has eaten the food
    if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
        handleFoodEaten();
    }
}

// clear prev snake on gameboard
function clearBoard() {
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard.length; j++) {
            gameBoard[i][j] = "";
        }
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
    if (snakeHead.x < 0 || snakeHead.x > 9) {
        gameOver = true;
    } else if (snakeHead.y < 0 || snakeHead.y > 9) {
        gameOver = true;
    }
}

//6) Handle a player clicking with a handleClick` function.
// Keyboard event
function setupKeyBoardEvt() {
    document.addEventListener("keydown", function (e) {
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
        if (newDir !== snakeHead.direction && !isOppositeDir) {
            turningPoints.push({
                x: snakeHead.x,
                y: snakeHead.y,
                direction: newDir,
            });
        }

        if (!isOppositeDir) {
            snakeHead.direction = newDir;
        }
    })
}

// Click event
function setupClickEvt() {
    function changeDirectionOnClick(arrowDirection) {
        snakeHead.direction = arrowDirection;
    };

    upArrow.addEventListener("click", () => changeDirectionOnClick("up"));
    downArrow.addEventListener("click", () => changeDirectionOnClick("down"));
    leftArrow.addEventListener("click", () => changeDirectionOnClick("left"));
    rightArrow.addEventListener("click", () => changeDirectionOnClick("right"));
}

// food eaten
function handleFoodEaten() {
    // Food disappear and add new food
    addNewFood();

    // Snake grows
    snakeGrow();

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

// Need to Change
function snakeGrow() {
    let newTailPosition = { x: snakeTail.x, y: snakeTail.y, direction: snakeTail.direction };
    // using unshift
    snake.push(newTailPosition);
}

function updateScore() {
    score++;
}

//7) Create Reset functionality.
function endGame() {
    messageEl.style.visibility = "visible";
    restartBtnEl.style.visibility = "visible";

    restartBtnEl.addEventListener("click", restartGame);
}

function restartGame() {
    // Reset Game state
    clearBoard();
    snake = [{ x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10), direction: "right" }];
    snakeHead = snake[0];
    snakeTail = { x: snakeHead.x, y: snakeHead.y, direction: snakeHead.direction };
    foodPosition = { x: Math.floor(Math.random() * 10), y: Math.floor(Math.random() * 10) };
    score = 0;
    gameOver = false;

    // update UI
    messageEl.style.visibility = "hidden";
    restartBtnEl.style.visibility = "hidden";

    render();
    play();
}