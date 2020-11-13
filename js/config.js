const CANVAS_WIDTH = 20;
const CANVAS_HEIGHT = 20;
const GRID_SIZE = 20;

const MANUAL_FPS = 5;
const TEST_FPS = 10;

const SNAKE_LENGTH = 3;

const COLLIDE_WALL = true;
const COLLIDE_BODY = true;
const EXTRA_WALL = [
    [7,7], [7,8], [7,9], [8,7], [8,8], [8,9]
];
const WALL_PIX_POS = true;

const MANUAL = true;

const snakeSprite = new Sprite("image/skin_1.png");
const appleSprite = new Sprite("image/star.png");
const wallSprite = new Sprite("image/tile.png");
