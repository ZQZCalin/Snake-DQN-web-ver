/*
1. All coordinates are in actual coordinats
2. (0,0) is at the TOP-LEFT corner
*/

class colorGrid {
    constructor(color) {
        const colorList = {
            red: "#B22222", purple: "#4B0082", green: "#9ACD32",
            blue: "#6495ED", yellow: "#DAA520", black: "#333333",
        };
        if (color in colorList) {
            this.color = colorList[color];
        } else {
            this.color = color;
        }
    }
    draw(ctx, x, y, w, h) {
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, w, h);
    }
}

class Rect {
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw(context, sprite) {
        sprite.draw(context, this.x, this.y, this.w, this.h);
    }

    contains(point) {
        // check whether p is in [x,x+w) x [y,y+h)
        // inclusive in x and y; exclusive in x+w, y+h
        var x = point[0];
        var y = point[1];
        if (
          x >= this.x &&
          x < this.x + this.w  &&
          y >= this.y &&
          y < this.y + this.h
        ) {
            return true;
        } else {
            return false;
        }
    }

    collideRect(rect, overlap=true){
        if (!(overlap)) {
            // weak collision detection:
            // point collision; does not consider area overlap
            if (this.x == rect.x || this.y == rect.y){
                return true;
            } else {
                return false;
            }
        } else {
            // strong collision; detects area collision
            if (this.contains([rect.x, rect.y])
            || rect.contains([this.x, this.y])){
                return true;
            } else {
                return false;
            }
        }
    }
}


class Snake {
    // Snake object for snake game.
    // Attributes:
    // - length
    // - x
    // - y
    // - color
    // - direction
    // - boxSize
    // - body
    direction = "U";
    length = 1;
    constructor(x, y, length, direction, boxSize, board_x, board_y) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.direction = direction;

        this.boxSize = boxSize;
        this.board_x = board_x;
        this.board_y = board_y;

        this.body = [];
        this.initialize();
        this.head = this.body[0];
    }

    initialize() {
        var k1 = 0; var k2 = 0;
        if (this.direction == "R") k1 = -1;
        if (this.direction == "L") k1 = 1;
        if (this.direction == "U") k2 = 1;
        if (this.direction == "D") k2 = -1;

        for (var i = 0; i < this.length; i++){
            var tempRect = new Rect(
                this.x + k1*i * this.boxSize,
                this.y + k2*i * this.boxSize,
                this.boxSize, this.boxSize
            );
            this.body.push(tempRect);
        }
    }

    // change direction
    changeDirection(direction) {
        // input: direction in [0, 1, 2, 3]
        const DIRECTION = ["U", "R", "D", "L"];

        const current = DIRECTION.indexOf(this.direction);
        const opposite = (current + 2) % 4;

        if (direction != opposite && direction != current) {
            this.direction = DIRECTION[direction];
        }
    }

    // move a step forward
    addHead(collideWall=true) {
        var k1 = 0; var k2 = 0;
        if (this.direction == "R") k1 = 1;
        if (this.direction == "L") k1 = -1;
        if (this.direction == "U") k2 = -1;
        if (this.direction == "D") k2 = 1;

        if (!(collideWall)) {
            this.x = (this.x + k1*this.boxSize) % this.board_x;
            this.y = (this.y + k2*this.boxSize) % this.board_y;
        } else {
            this.x = (this.x + k1*this.boxSize);
            this.y = (this.y + k2*this.boxSize);
        }

        var newHead = new Rect(
            this.x, this.y,
            this.boxSize, this.boxSize
        );
        this.body.unshift(newHead);
        this.head = this.body[0];
    }

    deleteTail() {
        return this.body.pop();
    }

    addTail(tail) {
        this.body.push(tail);
    }

    collideWithBody() {
        for (var i = 1; i < this.body.length; i++) {
            var part = this.body[i];
            if (this.head.collideRect(part)) {
                return true
            }
        }
        return false;
    }

    collideWithWall(extraWalls=null) {
        // normal wall check
        var wallRect = new Rect(0, 0, this.board_x, this.board_y);
        if ( !(wallRect.contains([this.x, this.y])) ) {
            return true;
        }
        // extra wall check
        if (extraWalls == null) return false;

        var bool = false;
        extraWalls.forEach(part => {
            if (this.head.collideRect(part)) {
                bool = true;
            }
        });
        return bool;
    }

    addHead_snakeTwo(max_width, max_height) {
        return null;
    }
}


class Apple {
    /*
    Apple Object for the snake game.
    Attributes:
    - boxLength
    - x
    - y
    */
    constructor(boxLength, x, y, board_x, board_y) {
        this.boxLength = boxLength;
        this.x = x;
        this.y = y;
        this.board_x = board_x;
        this.board_y = board_y;
        this.rect = new Rect(this.x, this.y, this.boxLength, this.boxLength);
    }

    // avoid: list of (x,y) arrays
    move(avoid=null) {
      const avoidCompare = (a, b) => arrayEqual(a, b);
      while (true) {
          var rand_x = getRandInt(0, this.board_x, this.boxLength);
          var rand_y = getRandInt(0, this.board_y, this.boxLength);
          var inAvoid = arrayContains(avoid, [rand_x,rand_y], avoidCompare);
          if (avoid == null || !(inAvoid)){
              break;
          }
      }
      // to do construct a more efficient random for large avoid.
      this.rect = new Rect(rand_x, rand_y, this.boxLength, this.boxLength);
      this.x = rand_x;
      this.y = rand_y;
    }
}
