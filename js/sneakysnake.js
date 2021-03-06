/* 
CREATED BY MATIJA MARTINIC (www.matijamartinic.com).
this is still beta version.
 */
////////////////////////////////////
///////// CONSTANTS ////////////////
////////////////////////////////////
var CANVAS_WIDTH, CANVAS_HEIGHT, LOOK;
var DIRECTION;
var UP = 38, LEFT = 37, DOWN = 40, RIGHT = 39;
var HOW_MUCH = 30;
var ctx;
var BLOCK_WIDTH;
var SNAKE_COLOR = "#00F000";
var FOOD_LIFE = 120;
var FOOD_COLOR = "#F00000"
var MAX_FOOD = 10;
var FOOD_PROBABILITY = 0.20;
var food = [];
var score = 0;
var OPERATOR_COLOR = "#000000";
var operators = ["+", "-", "*", "/"];

//for later use
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame ||
  			window.webkitRequestAnimationFrame||
  			window.mozRequestAnimationFrame    ||
  			function( callback ){
    			window.setTimeout(callback, 1000/60);
  			};
 })();

function println(str){
	console.log(str);
}

function level(){
	// class for each level
	// should class level create new numbers and operators?
	var down_limit, up_limit;
}

function game(){
	var score;
	var levels;
	var snake;
	var c;
	function drawScore(){
		var old = ctx.fillStyle;
		ctx.fillStyle = "#fad";
		var str = snake.getSnakeString();
		var scr = snake.getScore();
		if(scr)str+="="+scr;
		ctx.fillText(str, BLOCK_WIDTH, BLOCK_WIDTH);
		ctx.fillStyle = old;
	}

	function gameLoop(){
		//drawRect(10, 10, 123);
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		drawOgrada();
		generateFood();
		snake.nextAction();
		if(snake.isGameOver() == false){
			drawFood();
			snake.draw();
			drawScore();
			setTimeout(gameLoop, 80);
		}else{
			ctx.font="20px Arial";
			ctx.fillText("GAME OVER!", CANVAS_WIDTH/2-40, CANVAS_HEIGHT/2);
			console.log("GAME OVER!");
		}
	}
	
	// sets width, height and everything after DOM loads
	function init(){
		c = document.getElementById("snakeMeGently");
		ctx = c.getContext("2d");
		CANVAS_WIDTH = c.offsetWidth;
		CANVAS_HEIGHT = c.offsetHeight;
		BLOCK_WIDTH = Math.floor(CANVAS_WIDTH/HOW_MUCH);
		DIRECTION = RIGHT;
		console.log(getKeyPress);
	}

	// checks if snake won by selection all correct numbers to get to the desired number
	function didSnakeWin(){};

	// loads images
	function loadGraphics(){}; 

	// gets called when player loses the game. calls all function after that happened
	function gameOver(){

	};

	// sets score to 0, creates new snake etc
	function newGame(){
		snake = new snakeClass();
	};

	// pauses game and shows help, bilnds screen?
	this.pause = function(){};
	this.unPause = function(){};

	// run forrest run 
	this.run = function(){
		init();
		newGame();
		gameLoop();
	};


}

// Returns and sets appripriate direction, also checks if P was pressed (pause).
	// H for help, light a number with 1,2,3,..9
	// or QWER to light operator (in order +-*/)
	function getKeyPress(e){
		var evnt = window.event? window.event: e;
		var kk = e.keyCode; 
		if(kk==UP || kk==DOWN || kk==LEFT || kk==RIGHT){
			//big if so you can't go backwards
			if( !(DIRECTION==LEFT && kk==RIGHT) &&
				!(DIRECTION==RIGHT && kk==LEFT) &&
				!(DIRECTION==UP && kk==DOWN) &&
				!(DIRECTION==DOWN && kk==UP)){
				DIRECTION = kk;
			}
		}else if(kk==80){ //pause
			PAUSE = !PAUSE;
		}else if(kk>=48 && kk<=57){
			HELP_NUMBER = kk;
			HELP_NUMBER_COUNTER=HELP_NUMBER_COUNTER_INIT_VALUE;
		}
		return 0;
	}
	document.body.addEventListener("keydown", getKeyPress)	;

function StringEvaluator(){
	var string = "";

	this.add = function(character){
		string += character;
		return true;
	}

	this.get = function(index){
		return string[index]?string[index]:"";
	}

	function isNumber(character){
		return !isNaN(character);
	}

	function isOperator(character){
		return !isNumber(character);
	}

	this.getScore = function(){
		try{
			var score = eval(string);
			return Math.floor(score);
		}catch(e){
			return false;
		}
	}

	this.isOKAY = function(){
		// needs to check if last character is operator
		// if is, then previous one must be number
		// there cant be two numbers or two operators in a row
		if(string.length<1)return true;
		if(string.length==1){
			if(isOperator(string[0])){
				return false;
			}
			return true;
		}
		var last = string[string.length-1];
		var prev = string[string.length-2];
		if(isNumber(last)==isNumber(prev)){
			return false;
		}
		return true;
	}

	this.getString = function(){
		return string;
	}
}

function snakeClass(){
	var body = new Array();
	var numberString = new StringEvaluator();
	var diet = 3; // how much food can snake eat before it gains fat
	body.push([2,2]);
	body.push([3,2]);
	body.push([4,2]);
	
	this.draw = function(){
		var old = ctx.fillStyle;
		ctx.fillStyle = SNAKE_COLOR;
		for (var i = 0; i < body.length; i++) {
			drawRectWithText(body[i][0]*BLOCK_WIDTH, body[i][1]*BLOCK_WIDTH, numberString.get(i));
		}
		ctx.fillStyle = old;
	}

	this.isGameOver = function(){
		if(this.amIonEmptySpace()==false ||
			this.amIeatingMyself()==true ||
			numberString.isOKAY()==false ){
			return true;
		}
		return false;
	}

	this.amIeatingMyself = function(){
		var snake_head = body[body.length-1];
		for (var i = 0; i < body.length-1; i++) {
			if(snake_head[0]==body[i][0] && snake_head[1]==body[i][1]){
				return true;
			}
		}
		return false;
	}

	this.nextAction = function(){
		var snake_x = body[body.length-1][0];
		var snake_y = body[body.length-1][1];
		var eating = isThisFoodAndDeleteIt(snake_x, snake_y);
		if(eating.length){
			this.eat(eating);
			score++;
		}
		this.move(eating);

	}

	this.eat = function(foodSnakeAte){
		numberString.add(foodSnakeAte[2]);
	}

	this.amIonEmptySpace = function(){
		var snake_x = body[body.length-1][0];
		var snake_y = body[body.length-1][1];
		if(snake_x<1 || snake_x>HOW_MUCH-1)return false;
		if(snake_y<1 || snake_y>HOW_MUCH-1)return false;
		return true;

	}

	this.move = function(eating){
		// removes last part of snake
		// only if snake didn't ate anything
		// creates new body part and moves him to the front of a array
		// TODO: maybe create custom list to remove this body.shift O(N) to O(1)
		if(eating.length == 0){
			body.shift();
		}
		var newBodyPart = [];
		if(DIRECTION == RIGHT){
			newBodyPart = [body[ body.length - 1 ][0]+1, body[ body.length - 1 ][1]];
		}else if(DIRECTION == LEFT){
			newBodyPart = [body[ body.length - 1 ][0]-1, body[ body.length - 1 ][1]];
		}
		else if(DIRECTION == UP){
			newBodyPart = [body[ body.length - 1 ][0], body[ body.length - 1 ][1]-1];
		}else if(DIRECTION == DOWN){
			newBodyPart = [body[ body.length - 1 ][0], body[ body.length - 1 ][1]+1];
		}
		body.push(newBodyPart);
	}

	this.getScore = function(){
		return numberString.getScore();
	}

	this.getSnakeString = function(){
		return numberString.getString();
	}

}

function drawRect(x, y){
	ctx.fillRect(x, y, BLOCK_WIDTH, BLOCK_WIDTH);
}

function drawRectWithText(x,y, character){
	drawRect(x,y);
	var old = ctx.fillStyle;
	ctx.font="20px Arial";
	ctx.fillStyle = OPERATOR_COLOR;
	ctx.fillText(character, x, y + BLOCK_WIDTH);
	ctx.fillStyle = old;
}

function drawOgrada(){
	var old_style = ctx.fillStyle;
	ctx.fillStyle = "#ababab";
	for(var i=0; i<=HOW_MUCH; i++){ //paralel up and down
		drawRect(i*BLOCK_WIDTH, 0);
		drawRect(i*BLOCK_WIDTH, HOW_MUCH*BLOCK_WIDTH);
	}
	for(var i=0; i<=HOW_MUCH; i++){
		drawRect(0, i*BLOCK_WIDTH);
		drawRect(HOW_MUCH*BLOCK_WIDTH, i*BLOCK_WIDTH);
	}
	ctx.fillStyle = old_style;
}

function isThisFoodAndDeleteIt(snake_x, snake_y){
	for (var i = 0; i < food.length; i++) {
		if(food[i][0]==snake_x && food[i][1]==snake_y){
			var ret = food[i].slice(0);
			food.remove(i);
			return ret;
		}
	}
	return [];
}

function getOperatorOrNumber(){
	//should I generate operator or number
	//number should have a little big priority
	if(Math.random()<0.60){
		return String.fromCharCode(48 + Math.floor(Math.random()*10));
	}else{
		var rand_num = Math.floor(Math.random()*4);
		return operators[rand_num];

	}
}

function generateFood(){
	//should I generate food. probability
	if(Math.random()<FOOD_PROBABILITY && food.length<MAX_FOOD){
		food.push( [Math.floor(Math.random()*(HOW_MUCH-1)+1),
					Math.floor(Math.random()*(HOW_MUCH-1)+1),
					getOperatorOrNumber(),
					Math.floor(Math.random()*FOOD_LIFE) + 15]
				);
	}
}

function drawFood(){
	/*  Draws and also removes life from food */
	var old = ctx.fillStyle;
	ctx.fillStyle = FOOD_COLOR;
	for (var i = 0; i < food.length; i++) {
		if(food[i][3]<0){
			food.remove(i);
			i--;
		}else{
			drawRectWithText(food[i][0]*BLOCK_WIDTH, food[i][1]*BLOCK_WIDTH, food[i][2]);
			food[i][3]--;
		}
	}
	ctx.fillStyle = old;
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};
new game().run();