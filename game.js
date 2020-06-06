
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColors(colorsCount) {
    let colorsArray = new Array(8).fill(null);
    return colorsArray.map(elem => elem = "#"+(Math.random()*16**6).toString(16).substr(0,6))
}




function boardIsFill(board) {
    for (elem of board) {
        if (elem.color == 0) {
            return false;
        }
    }
    return true;
}

let tilesState;
let Board = [];
let boardNode = document.querySelector('#board');
let roundStateNode = document.querySelector(".roundState");

function setTilesColor() {
    tilesState = new Array(16).fill({color: 0, opened: false});
    let colors = getRandomColors(8);
    let usedColors = [];
    while(!boardIsFill(tilesState)) {
        for(let i = 0; i < tilesState.length; i++) {
            if(tilesState[i].color == 0) {
                let color = colors[getRandomInt(0,8)];
                let colorCount = 0;
                // Подсчет уже использованных цветов(для парности)
                // Counting already used colors(for pairs)
                for (let elem of usedColors) {
                    if (elem == color) {
                        colorCount++;
                    }
                }
                // Если цвет был уже использован в двух плитках, переходим к следующему цвету, если нет, присваиваем
                // его текущей плитке
                // If the color was already used in two tiles, go to the next color, if not, assign
                // its to current tile
                if(colorCount >= 2) {
                    continue;
                } else {
                    tilesState[i] = {color: color, opened: false};
                    usedColors.push(color);
                }
            }
        }
    }
}
function startGame() {
    Board = [];
    // Новая игра - новые цвета
    // New game - new colors
    setTilesColor();

    roundStateNode.innerHTML = 1;

    tilesState.forEach((elem, index) => {
        let tiles = document.createElement('div');
        tiles.className = "tiles";
        tiles.id = `${index}`;
        Board.push(tiles);
    })
    renderBoard(Board);
}


function showAllTiles() {
    Board.forEach((elem,index) => {
        elem.style.backgroundColor = tilesState[index].color;
    });
}
function hideAllTiles() {
    Board.forEach((elem,index) => {
        if(tilesState[index].opened == false) {
            elem.style.backgroundColor = "";
        }
    })
}
function renderBoard(Board) {
    while(boardNode.firstChild) {
        boardNode.removeChild(boardNode.firstChild);
    }
    for(let i = 0; i < Board.length; i++) {
        if(tilesState[i].opened == true) {
            Board[i].style.backgroundColor = tilesState[i].color;
        }
        boardNode.appendChild(Board[i]);  // boardNode.append(...Board);
    }
}

// Контроль над игрой
// Control over the game
let MOVES_COUNT = 0;
let selectedColors = [];
boardNode.onclick = (e) => {
    gameHandler(e);
}
function showTile(id) {
    selectedColors.push(tilesState[id].color);
    tilesState[id].opened = true;
}
function gameHandler(e) {
    tileId = e.target.id;
    MOVES_COUNT++;
    if(MOVES_COUNT < 3) {
        showTile(tileId);
    } else {
        if (selectedColors[0] == selectedColors[1]) {

            if(isWin()) {
                alert("You won!");
                resetGame();
            } else {
                alert("Moving on to the next round!");
                roundStateNode.innerHTML = +roundStateNode.innerHTML + 1;
            }

            selectedColors = [];
            showTile(tileId);
            MOVES_COUNT = 1;

        } else {
            alert('You lost!');
            resetGame();
        }
    }
    renderBoard(Board);
}

function isWin() {
    for (elem of tilesState) {
        if (elem.opened == false) {
            return false;
        }
    }
    return true;
}

function resetGame() {
    selectedColors = [];
    MOVES_COUNT = 0;
    tilesState.forEach((elem, index) => elem.opened = false);
    Board = [];
    boardNode.innerHTML = null;
    roundStateNode.innerHTML = 0;
}
console.log(tilesState);