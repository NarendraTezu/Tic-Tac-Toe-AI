var board;
const human = 'O';
const computer = 'X';
const winPossiblity = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const boxes = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	board = Array.from(Array(9).keys());
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].innerText = '';
		boxes[i].style.removeProperty('background-color');
		boxes[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof board[square.target.id] == 'number') {
		turn(square.target.id, human)
		if (!checkWin(board, human) && !checkTie()) turn(bestSpot(), computer);
	}
}

function turn(squareId, player) {
	board[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(board, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winPossiblity.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winPossiblity[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == human ? "green" : "blue";
	}
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == human ? "You win!" : "You lose.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return board.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(board, computer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < boxes.length; i++) {
			boxes[i].style.backgroundColor = "teal";
			boxes[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var boxes = emptySquares();

	if (checkWin(newBoard, human)) {
		return {score: -10};
	} else if (checkWin(newBoard, computer)) {
		return {score: 10};
	} else if (boxes.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < boxes.length; i++) {
		var move = {};
		move.index = newBoard[boxes[i]];
		newBoard[boxes[i]] = player;

		if (player == computer) {
			var result = minimax(newBoard, human);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, computer);
			move.score = result.score;
		}

		newBoard[boxes[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === computer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
