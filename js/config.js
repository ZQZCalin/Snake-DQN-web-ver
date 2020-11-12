const snakeSprite = new Sprite("image/skin_1.png");
const appleSprite = new Sprite("image/star.png");
const wallSprite = new Sprite("image/tile.png")

var HTML_game, HTML_score;
var Context_game = null;
var Context_score = null;
var VERBOSE = true;

var TILE_WIDTH, BOARD_M, BOARD_N, NUM_BOMB, NUM_TILE;
var BOARD, BOARD_MXN, BOARD_NUM;
var BOARD_WIDTH, BOARD_HEIGHT, BOARD_LEFT, BOARD_TOP;
var if_lose, num_covered, player_board, uncover_index;
var time = 0;
var timing = false;

var BODY_WIDTH = 1280;
var BORDER_LEN = 3;
var MAIN_WIDTH = 960;
var MAIN_HEIGHT = 500;

var SCORE_WIDTH = 200;
var SCORE_HEIGHT = MAIN_HEIGHT;
var SCORE_LEFT = MAIN_WIDTH-SCORE_WIDTH;
var SCORE_TOP = 0;

var PROGRESS_RADIUS = 68;
var PROGRESS_WIDTH = 24;
var PROGRESS_BORDER = 2;
var COLOR_FLAG = '#FF9966';
var COLOR_TILE = '#99CCFF';

var star = new Sprite('image/star.png');
var one = new Sprite('image/one.png');
var two = new Sprite('image/two.png');
var three = new Sprite('image/three.png');
var four = new Sprite('image/four.png');
var five = new Sprite('image/five.png');
var six = new Sprite('image/six.png');
var seven = new Sprite('image/seven.png');
var eight = new Sprite('image/eight.png');

var flag = new Sprite('image/flag.png');
var bomb = new Sprite('image/bomb.png');

var tile = new Sprite('image/tile.png');
var tile_hover = new Sprite('image/tile_hover.png');
var tile_plain = new Sprite('image/tile_plain.png');

var replay = new Sprite('image/replay.png');
var replay_click = new Sprite('image/replay_click.png');
var resume = new Sprite('image/resume.png');
var resume_click = new Sprite('image/resume_click.png');
var pause = new Sprite('image/pause.png');
var pause_click = new Sprite('image/pause_click.png');

var timer_title_img = new Sprite('image/timer_title.png');
var semi_column = new Sprite('image/semi_column.png');
