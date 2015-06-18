var num_length, main_number, help_number, moves, helps, cows, bulls;

function getRandomNumber(length) {
	var number = [];

	while (number.length < length) {
		var rand = ~~(Math.random() * 9 + 0);
		if (number.length == 0 && rand == 0) continue;
			if (number.indexOf(rand) !== -1) continue;
				else number.push(rand);
	}

	return parseInt(number.join(''));
}

function startGame() {
	main_number = getRandomNumber(num_length = document.getElementById('game-level').value);
	help_number = '*'.repeat(num_length);
	moves = 1;
	helps = 0;
}

function changeElements(display) {
	var elements = ['cleanTable', 'help', 'surrender', 'status'];
	for (var elem in elements) document.getElementById(elements[elem]).style.display = display;
}

function restart() {
	document.getElementById('guess-number').disabled 	= false;
	document.getElementById('guess-number').value 		= null;
	changeElements('block');
	cleanTable();
	$('#ok').empty();
}

function updateTable(move, number, cows, bulls) {
	var table = document.getElementById('game-main-body').insertRow(-1);
	for (var i in arguments) table.insertCell(i).innerHTML = arguments[i];
	document.getElementById('guess-number').value = '';
}

function cleanTable() {
	document.getElementById('game-main-body').innerHTML = '';
	moves = 1;
}

function isNumber(num) {
	return !isNaN(parseFloat(num)) && isFinite(num);
}

function setNumber() {
	try {
		var num = document.getElementById('guess-number').value;
		if (document.getElementById('guess-number').disabled === true) throw 'Start new game';
		else if (!isNumber(num)) throw 'Please enter valid number!';
		else if (num.toString().length != num_length) throw `Please enter number which length is ${num_length}!`;
		else if (/^0[0-9].*$/.test(num)) throw 'The number can not start with 0 (zero)!';
		else if (/([0-9]+)\1/.test(num)) throw 'The number can not contain repeated digits!';
		else gameMain(num);
	} catch (err) {
		document.getElementById('error').innerHTML = err;
		setTimeout(function() {$('#error').empty();}, 2000);
	}
}

function finish(msg) {
	changeElements('none');
	document.getElementById('guess-number').disabled 	= true;
	document.getElementById('ok').innerHTML 			= msg;		
}

function gameMain(num) {
	if (num != main_number) {
		cows = 0, bulls = 0;
		for (var i = 0; i < num.length; ++i)
			if (num.toString().charAt(i) === main_number.toString().charAt(i)) bulls++;
				else if (main_number.toString().indexOf(num.charAt(i)) !== -1) cows++;
		updateTable(moves++, num, cows, bulls);
	} else finish('<span class="text-bold">Congratulations!</span><br />You have found the number :)');
}

function surrender() {
	finish(`The number was <span class="text-bold">${main_number}</span>`);
}

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index + character.length);
}

function help() {
	if (helps < num_length - 1) {
		help_number = help_number.replaceAt(helps, main_number.toString().charAt(helps++));
		updateTable(moves++, help_number, 0, helps);
	} else {
		document.getElementById('error').innerHTML = 'Guess the last number!';
		setTimeout(function() {$('#error').empty();}, 2000);
	}
}

function status() {
	bulls || cows ? updateTable('-', 'STATUS', cows, bulls) : document.getElementById('error').innerHTML = 'Still not found any numbers';
	setTimeout(function() {$('#error').empty();}, 2000);
}