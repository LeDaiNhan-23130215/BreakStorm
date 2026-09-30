import { Ball } from '../entities/Ball.js';
import { Paddle } from '../entities/Paddle.js';
import { Collision } from '../system/collision.js';
import { Level } from '../level/level.js';
export class Game {

    constructor(input) {
        this.level = new Level();
        this.width = 800;
        this.height = 600;

        this.ball = new Ball(
            this.width / 2,
            this.height / 2
        );

        this.paddle = new Paddle(
            this.width / 2 - 50,
            this.height - 40
        );

        this.input = input;
    }

    update(dt) {
        this.ball.update(dt);
        this.paddle.update(dt, this.input, this.width);

        Collision.ballWithWall(
            this.ball,
            this.width,
        )

        Collision.ballWithPaddle(
            this.ball,
            this.paddle
        )

        for (const brick of this.level.bricks) {
            Collision.ballWithBrick(
                this.ball,
                brick
            );
        }
    }
}