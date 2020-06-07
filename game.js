
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColors(colorsCount) {
    let colorsArray = new Array(colorsCount).fill(null);
    return colorsArray.map(elem => elem = "#"+(Math.random()*16**6).toString(16).substr(0,6))
}



let tilesState;
let Board = [];
let tilesCount = 16; //4, 16, 64,
let boardNode = document.querySelector('#board');
let roundStateNode = document.querySelector(".roundState");
let numberOfAttempts;

function setGameLvl() {
    let lvl = +document.getElementById("gameLvl").value;
    tilesCount = lvl;
}

function boardIsFill(board) {
    for (elem of board) {
        if (elem.color == 0) {
            return false;
        }
    }
    return true;
}

function setTilesColor(tilesCount) {
    tilesState = new Array(tilesCount).fill({color: 0, opened: false});
    let colors = getRandomColors(tilesCount/2);
    let usedColors = [];
    while(!boardIsFill(tilesState)) {
        for(let i = 0; i < tilesState.length; i++) {
            if(tilesState[i].color == 0) {
                let color = colors[getRandomInt(0,tilesCount/2)];
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

function startGame(tilesCount) {
    Board = [];
    numberOfAttempts = tilesCount/2;
    setTilesColor(tilesCount);

    roundStateNode.innerHTML = 1;

    tilesState.forEach((elem, index) => {
        let tiles = document.createElement('div');
        tiles.className = "tiles";
        tiles.id = `${index}`;
        Board.push(tiles);
    })
    renderBoard(Board);
    setWH(tilesCount);
}
function setWH(tilesCount) {
    let WH = 100 / Math.sqrt(tilesCount) + '%';
    for(let i = 0; i < tilesCount; i++) {
        let node = document.getElementById(i+'');
        node.style.width = WH;
        node.style.height = WH;
    }
}


function renderBoard(Board) {
    while(boardNode.firstChild) {
        boardNode.removeChild(boardNode.firstChild);
    }
    for(let i = 0; i < Board.length; i++) {
        if(tilesState[i].opened == true) {
            Board[i].style.backgroundColor = tilesState[i].color;
        } else {
            Board[i].style.backgroundColor = '';
        }
        boardNode.appendChild(Board[i]);
    }
}

// Game controllers
document.addEventListener('keypress',function(e) {
    e.code === 'KeyS' && startGame(tilesCount);
    e.code === 'KeyQ' && showAllTiles();
    e.code === 'KeyW' && hideAllTiles();
})


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
function hideTile(id) {
    tilesState[id].opened = false;
}

let prevTileId;

function gameHandler(e) {
    let tileId = e.target.id;

    if(tilesState[tileId].opened) {
        return;
    }

    MOVES_COUNT++;
    if(MOVES_COUNT < 3) {
        showTile(tileId);
        if(MOVES_COUNT == 2) {
            if (selectedColors[0] == selectedColors[1]) {
                if(isWin()) {
                    showGameInfo("You won! Your score: "+ tilesCount*(numberOfAttempts+1));
                    resetGame();
                } else {
                    showGameInfo("Moving on to the next round!");
                    roundStateNode.innerHTML = +roundStateNode.innerHTML + 1;
                }
            } else {
                if(!numberOfAttempts) {
                    setTimeout(resetGame, 1000);
                    showGameInfo('You lost!')
                } else {
                    showGameInfo('Different tiles!'+(--numberOfAttempts)+' attempts left');
                    selectedColors = [];
                    MOVES_COUNT = 0;
                    let prevTileIdAsync = prevTileId;
                    setTimeout(()=> {
                        hideTile(tileId);
                        hideTile(prevTileIdAsync)
                        renderBoard(Board);
                    }, 1000)
                }
            }

        }
    } else {
        if (selectedColors[0] == selectedColors[1]) {
            selectedColors = [];
            showTile(tileId);
            MOVES_COUNT = 1;

        }
    }
    prevTileId = tileId;
    renderBoard(Board);
}

function showGameInfo(infoBody) {
    let infoContainer = document.querySelector('#infoContainer');
    let infoBox = document.createElement("div");
    infoBox.innerText = infoBody;
    infoBox.className = 'gameInfo';
    infoContainer.appendChild(infoBox);
    setTimeout(() => infoContainer.removeChild(infoBox), 2000);

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
    roundStateNode.innerHTML = '0';
}