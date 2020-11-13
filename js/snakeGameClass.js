/*
1. stateType:
  - 0: boolean vector of size 12
  - 1:
2.

*/

class snakeGame {
    constructor(params) {
        // defaults
        this.FPS = 10;
        this.snakeLength = 3;

        this.collideWall = true;
        this.collideBody = true;
        this.extraWalls = null;

        this.snakeSprite = new colorGrid("green");
        this.appleSprite = new colorGrid("red");
        this.wallSprite = new colorGrid("black");

        this.manual = true;

        this.stateType = "12bool";
        this.rewardType = "eat-die-close-away";
        this.rewardValues = [10, -100, 1, -1];

        for (var key in params) {
            // Game-side Attributes
            if (key == "collideWall") this.collideWall = params[key];
            if (key == "collideBody") this.collideBody = params[key];
            if (key == "extraWalls") this.extraWalls = params[key];

            if (key == "snakeSprite") this.snakeSprite = params[key];
            if (key == "appleSprite") this.appleSprite = params[key];
            if (key == "wallSprite") this.wallSprite = params[key];

            if (key == "FPS") this.FPS = params[key];

            // Train-side Attributes
            if (key == "stateType") this.stateType = params[key];
            if (key == "rewardType") this.rewardType = params[key];
            if (key == "rewardValues") this.rewardValues = params[key];

            // Game Elements
            if (key == "snakeLength") this.snakeLength = params[key];
            if (key == "manual") this.manual = params[key];
        }

        // Mandatory
        this.canvas = params["canvas"];
        this.dpr = this.canvas.dpr;
        this.gridSize = params["gridSize"] * this.dpr;
        this.width = params["width"] * this.gridSize;
        this.height = params["height"] * this.gridSize;

        this.extraWalls = generateExtraWalls(this.extraWalls, this.gridSize, true);

        // initialize
        this.timer = null;

        this.snake = null;
        this.apple = null;

        this.done = 0;
        this.score = 0;
        this.best_score = 0;
        this.key_pressed = 0;

        this.reset();
        this.render();

        if (this.manual) {
            // player mode
            this.keyboard_events();
        }
    }

    // STATICS
    _direction(action){
      const DIRECTION_ARR = ["U","R","D","L"];
      return DIRECTION_ARR[action];
    }

    _action(direction){
      const DIRECTION_ARR = ["U","R","D","L"];
      return DIRECTION_ARR.indexOf(direction);
    }

    // state space
    update_state() {
        if (this.stateType == "12bool") {
            return this.update_state_12bool().print();
        }
    }
    
    update_state_12bool() {
        // return a js array
        // update state from this.snake and this.apple
        // called after this.snake and this.apple are updated
        var new_state = Array(12).fill(0);

        // Direction of Snake
        if (this.snake.direction == "U") {
            new_state[0] = 1;
        } else if (this.snake.direction == "R") {
            new_state[1] = 1;
        } else if (this.snake.direction == "D") {
            new_state[2] = 1;
        } else if (this.snake.direction == "L") {
            new_state[3] = 1;
        }

        // Apple position (wrt snake head)
        // (0,0) at Top-Left Corner: U: -y; R: +x
        if (this.apple.y < this.snake.y) {
            // apple north snake
            new_state[4] = 1
        }
        if (this.apple.x > this.snake.x) {
            // apple east snake
            new_state[5] = 1
        }
        if (this.apple.y > this.snake.y) {
            // apple south snake
            new_state[6] = 1
        }
        if (this.apple.x < this.snake.x) {
            // apple west snake
            new_state[7] = 1
        }

        // Obstacle (Walls, body) position (wrt snake head)
        var test_snake;
        const test_case = {
            "U": {oppo: "D", x: 0, y: -this.gridSize, state: 8},
            "R": {oppo: "L", x: this.gridSize, y: 0, state: 9},
            "D": {oppo: "U", x: 0, y: this.gridSize, state: 10},
            "L": {oppo: "R", x: -this.gridSize, y: 0, state: 11}
        };
        for (var key in test_case) {
            var test = test_case[key];
            if (this.snake.direction != test["oppo"]) {
                test_snake = new Snake(
                    this.snake.x + test["x"], this.snake.y + test["y"], 
                    1, "U", this.gridSize, this.width, this.height
                )
                if (test_snake.collideWithWall(this.extraWalls)) {
                    new_state[test["state"]] = 1;
                }
            }
        }
        return tf.tensor2d(new_state, [1,12]);
    }

    // reward function

    // functions
    reset() {
        // return a js array
        this.done = 0;
        this.score = 0;

        this.snake = new Snake(
            getRandInt(5*this.gridSize, this.width-5*this.gridSize, this.gridSize),
            getRandInt(5*this.gridSize, this.width-5*this.gridSize, this.gridSize),
            this.snakeLength, this._direction(getRandInt(0,4)), this.gridSize,
            this.width, this.height
        );

        this.apple = new Apple(this.gridSize, 0, 0, this.width, this.height);
        this.move_apple();

        // add update_state if used for training
        return this.update_state();
    }

    move_apple() {
        var avoid = this.snake.body.map(part => [part.x, part.y]);
        if (this.extraWalls != null){
            var avoid_wall = this.extraWalls.map(part => [part.x, part.y]);
            avoid = avoid.concat(avoid_wall);
        }
        this.apple.move(avoid);
    }

    update_score() {
        this.score = this.snake.body.length() - this.snakeLength;
        return this.score;
    }

/*
    def reward(self, state, next_state):
        # test reward function 1:
        # score of apple v.s. snake, lower score means closer
        s1 = np.sum(state[4:8])
        s2 = np.sum(next_state[4:8])

        if s1 < s2:
            # far away from apple
            return -1
        if s1 > s2:
            # closer to apple
            return 1

        # other cases
        return 0

    def step(self, action):
        """
        about reward:
        Two base rewards:
        - die: -100
        - get apple: 10
        Additional rewards:
        - NAIVE:
            - closer to apple: 1
            - away from apple: -1
        - DETECT_ENCLOSE:
            -
        """

        # BE VERY CAREFUL ABOUT THE POSITION & POINTER ISSUES !!!!!

        if this.done:
            return

        current_state = this.state
        current_snake = this.snake
        pos_current = [current_snake.x, current_snake.y]

        reward_ = 0

        # update direction
        # opposite_direction = (DIRECTION_INVERSE[this.snake.direction] + 2) % 4
        if action != (DIRECTION_INVERSE[this.snake.direction] + 2) % 4:
            this.snake.direction = DIRECTION[action]

        # update game/motion, done, and reward_
        this.snake.addHead()
        if this.snake.isDead() or this.snake.isOutOfBounds(WIDTH, HEIGHT):
            # game-over
            this.done = 1
            reward_ = -100
        if not(this.snake.head.colliderect(this.apple.rect)):
            # not eat apple
            this.snake.deleteTail()
        else:
            # eat apple
            avoid = [(rect.x, rect.y) for rect in this.snake.body]
            this.apple.move(avoid=avoid)
            reward_ = 10

        next_state = this.update_state()

        if reward_ == 0:
            pos_next = [this.snake.x, this.snake.y]
            pos_apple = [this.apple.x, this.apple.y]
            d1 = euclidean(pos_apple, pos_current)
            d2 = euclidean(pos_apple, pos_next)

            if d1 > d2:
                reward_ = 1
            else:
                reward_ = -1

        return next_state, reward_, this.done, this.update_score()
*/

    render() {
        var context = this.canvas.context;
        context.clearRect(0,0,this.width,this.height);
        // snake
        this.snake.body.forEach((part, i) => {
            part.draw(context, this.snakeSprite);
        });
        // extra wall
        if (this.extraWalls != null){
            this.extraWalls.forEach((part, i) => {
                part.draw(context, this.wallSprite);
            });
        }
        // apple
        this.apple.rect.draw(context, this.appleSprite);
    }

    run() {
        // store value of this
        var self = this;
        this.timer = setInterval(function(){
            self.forward_manual();
            self.key_pressed = 0;
        }, 1000/this.FPS);
    }

    end_game() {
        clearInterval(this.timer);
        console.log("You DIED!");
    }

    forward_manual() {
        // move
        this.snake.addHead(this.collideWall);
        // round conclude
        if (this.snake.collideWithWall(this.extraWalls)) {
            this.done = 1;
            this.end_game();
            this.render();
            return;
        }
        // new time logic
        const tempTail = this.snake.deleteTail();
        if (this.snake.collideWithBody()) {
            this.done = 1;
            this.end_game();
        }
        if (this.snake.head.collideRect(this.apple.rect)) {
            // add tail back
            this.snake.addTail(tempTail);
            // move apple
            this.move_apple();

            this.score += 1;
            if (this.score > this.best_score) {
                this.best_score = this.score;
            }
        } else {
            // no longer needs to deleteTail() because we use another time logic
            // this.snake.deleteTail();
        }
        // render
        this.render();
    }

    keyboard_events() {
        // key control of snake
        document.body.addEventListener("keydown", (event) => {
            if (this.done) {
                console.log("Game ended");
                return null;
            }
            if (this.key_pressed) {
                console.log("key pressed in this round");
                return null;
            } else {
                this.key_pressed = 1;
            }
            const ARROW_ACTION = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
            const key = ARROW_ACTION.indexOf(event.key);

            // change direction if not opposite directoin
            const current_key = this._action(this.snake.direction);
            const opposite_key = (this._action(this.snake.direction) + 2) % 4;
            if (key != opposite_key && key != current_key) {
                this.snake.direction = this._direction(key);
            }
        });
    }

}
