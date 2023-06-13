/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {

  constructor (height = 6, width = 7, player1, player2) {
    this.height = height;
    this.width = width;
    this.makeBoard();
    this.makeHtmlBoard();
    this.player1 = player1.color;
    this.player2 = player2.color;
    this.currentPlayer = this.player1;
  }

  // let board = []; // array of rows, each row is array of cells  (board[y][x])

  /** makeBoard: create in-JS board structure:
   *   board = array of rows, each row is array of cells  (board[y][x])
   */

  makeBoard() {
    this.board = [];
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    // top.addEventListener('click', this.handleClick);

    // Later, when handleClick is called, the methods referenced therein are in the '#column-top' context,
    // so do not work. I bind handleClick's 'this' to the current 'Game' context here
    // EDIT: I couldn't 'removeEventListener' later, dug into Stack Overflow and found I need to create a 
    // reference to the bound 'handleClick' here, then use that reference in the 'removeEventListener' later
    this.boundHandleClick = this.handleClick.bind(this);
    // top.addEventListener("click", this.handleClick.bind(this));
    top.addEventListener("click", this.boundHandleClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    
    // piece.classList.add(`p${this.currentPlayer}`);
    // currentPlayer is now the player color.
    piece.style.backgroundColor = this.currentPlayer;

    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  /** endGame: announce game end */

  endGame(msg) {
    // Delay the alert by 1/10 second so the last piece gets played.
    const si = setInterval(function() {
      alert(msg);
      clearInterval(si);
     }, 100);
     // The game is over, so remove the event listener.
     document.querySelector("#column-top").removeEventListener("click", this.boundHandleClick);
  }

  /** handleClick: handle click of column top to play piece */

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currentPlayer;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currentPlayer} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    // this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */

  checkForWin() {
    // function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currentPlayer
      const _win = cells => cells.every(([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currentPlayer
      );

      // Added this so the winning cells could be highlighted
      function _mark(cells) {
        for (let cell of cells) {
          let targetTD = `${cell[0]}-${cell[1]}`;
          document.getElementById(targetTD).style.border = "1px solid red";
          document.getElementById(targetTD).style.backgroundColor = "lightgray";
        }
      }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        
        // if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        // Changed this 'if' so could also mark the winning 'td's
        if (_win(horiz)) {
          _mark(horiz);
          return true;
        } else if (_win(vert)) {
          _mark(vert);
          return true;
        } else if (_win(diagDR)) {
          _mark(diagDR);
          return true;
        } else if (_win(diagDL)) {
          _mark(diagDL);
          return true;
        }
      }
    }
  }
}

document.querySelector("#startBtn").addEventListener("click", startGame);
// makeBoard();
// makeHtmlBoard();
// new Game(6,7);
function startGame(){
  // clear any game in play
  document.getElementById("board").innerHTML="";

  const pColors = document.querySelectorAll("input");
  if (!pColors[0].value || !pColors[1].value) {
    alert("Enter a color for each player."); 
    return;
  }
  if (pColors[0].value == pColors[1].value) {
    alert("Enter a DIFFERENT color for each player."); 
    return;
  }
  document.getElementById("startBtn").innerText = "Restart Game"
  const player1 = new Player(pColors[0].value);
  const player2 = new Player(pColors[1].value);
  const thisGame = new Game(6, 7, player1, player2);
}

class Player {
  constructor(color){
    this.color = color;
  }
}
