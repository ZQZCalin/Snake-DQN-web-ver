const CANVAS_WIDTH = 20;
const CANVAS_HEIGHT = 20;
const GRID_SIZE = 20;

const MANUAL_FPS = 3;
const TEST_FPS = 10;

const SNAKE_LENGTH = 3;

const COLLIDE_WALL = true;
const COLLIDE_BODY = true;
const EXTRA_WALL = [
    [6,7], [7,7], [8,7], [7,6], [7,8],
];
// const WALL_PIX_POS = true; // assume to be always true

const MANUAL = true;

const snakeSprite = new Sprite("image/skin_1.png");
const appleSprite = new Sprite("image/star.png");
const wallSprite = new Sprite("image/tile.png");
