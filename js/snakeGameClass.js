/*
1. stateType:
  - 0: boolean vector of size 12
  - 1:
2.

*/

class snakeGame {
    constructor(
        canvas, width, height, gridSize, FPS,
        snakeLength, snakeSprite, appleSprite, wallSprite,
        collideWall=true, collideBody=true, extraWalls=null,
        stateType=0, rewardType=0, rewardValues=null,
        manual=true
    ) {
        // Game-side Attributes
        this.canvas = canvas;
        this.dpr = this.canvas.dpr;
        this.gridSize = gridSize * this.dpr;
        this.width = width * this.gridSize;
        this.height = height * this.gridSize;

        this.collideWall = collideWall;
        this.collideBody = collideBody;
        this.extraWalls = extraWalls;

        this.FPS = FPS;
        this.timer = null;

        // Train-side Attributes
        this.stateType = stateType;
        this.rewardType = rewardType;
        this.rewardValues = rewardValues;

        // if (this.stateType == 0) {
        //     this.state = np.zeros((12,));
        //     this.state_size = 12;
        // }
        // this.action_size = 4

        // Game Elements
        this.snakeLength = snakeLength;
        this.snakeSprite = snakeSprite;
        this.appleSprite = appleSprite;
        this.wallSprite = wallSprite;

        this.snake = null;
        this.apple = null;

        this.done = 0;
        this.score = 0;
        this.best_score = 0;
        this.key_pressed = 0;

        this.reset();
        this.render();
        if (manual) this.keyboard_events();
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

    // functions
    set_canvas() {
        return null;
    }

    reset() {
        this.done = 0;
        this.score = 0;

        this.snake = new Snake(
            getRandInt(5*this.gridSize, this.width-5*this.gridSize, this.gridSize),
            getRandInt(5*this.gridSize, this.width-5*this.gridSize, this.gridSize),
            this.snakeLength, this._direction(getRandInt(0,4)), this.gridSize,
            this.width, this.height
        );

        this.apple = new Apple(
            this.gridSize,
            getRandInt(0, this.width, this.gridSize),
            getRandInt(0, this.height, this.gridSize),
            this.width, this.height
        );

        // add update_state if used for training
        return this.update_state();
    }

    /*
    def update_state(self):
        # update state from this.snake and this.apple
        # called after this.snake and this.apple are updated
        new_state = np.zeros((this.state_size, ))

        # Direction of Snake
        if this.snake.direction == "U":
            new_state[0] = 1
        if this.snake.direction == "R":
            new_state[1] = 1
        if this.snake.direction == "D":
            new_state[2] = 1
        if this.snake.direction == "L":
            new_state[3] = 1

        # Apple position (wrt snake head)
        # (0,0) at Top-Left Corner: U: -y; R: +x
        if this.apple.y < this.snake.y:
            # apple north snake
            new_state[4] = 1
        if this.apple.x > this.snake.x:
            # apple east snake
            new_state[5] = 1
        if this.apple.y > this.snake.y:
            # apple south snake
            new_state[6] = 1
        if this.apple.x < this.snake.x:
            # apple west snake
            new_state[7] = 1

        # Obstacle (Walls, body) position (wrt snake head)
        body_x = [rect.x for rect in this.snake.body]
        body_y = [rect.y for rect in this.snake.body]
        body_pos = [(rect.x, rect.y) for rect in this.snake.body]
        if this.snake.direction != "D" and \
        (this.snake.y <= 0 or (this.snake.x, this.snake.y-GRIDSIZE) in body_pos):
            # obstacle at north
            new_state[8] = 1
        if this.snake.direction != "L" and \
        (this.snake.x >= WIDTH-GRIDSIZE or (this.snake.x+GRIDSIZE, this.snake.y) in body_pos):
            # obstacle at east
            new_state[9] = 1
        if this.snake.direction != "U" and \
        (this.snake.y >= HEIGHT-GRIDSIZE or (this.snake.x, this.snake.y+GRIDSIZE) in body_pos):
            # obstacle at south
            new_state[10] = 1
        if this.snake.direction != "R" and \
        (this.snake.x <= 0 or (this.snake.x-GRIDSIZE, this.snake.y) in body_pos):
            # obstacle at west
            new_state[11] = 1

        this.state = new_state
        return this.state
    */
    update_state() {
        return null;
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
        // draw extra wall
        if (this.extraWalls != null){
            this.extraWalls.forEach((part, i) => {
                part.draw(context, this.wallSprite);
            });
        }
        this.snake.body.forEach((part, i) => {
            part.draw(context, this.snakeSprite);
        });
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
        if (this.snake.collideWithBody()
        || this.snake.collideWithWall()) {
            this.done = 1;
            this.end_game();
        }
        if (this.snake.head.collideRect(this.apple.rect)) {
            var avoid = this.snake.body.map(part => [part.x, part.y]);
            if (this.extraWalls != null){
                var avoid_wall = this.extraWalls.map(part => [part.x, part.y]);
                avoid = avoid.concat(avoid_wall);
            }
            console.log(avoid);
            this.apple.move(avoid);
            this.score += 1;
            if (this.score > this.best_score) {
                this.best_score = this.score;
            }
        } else {
          this.snake.deleteTail();
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
