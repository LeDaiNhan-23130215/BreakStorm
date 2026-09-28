import { Ball } from '../entities/Ball.js';
import { Paddle } from '../entities/Paddle.js';
import { Collision } from '../system/collision.js';

export class Game {

    constructor() {

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
    }

    update(dt) {
        this.ball.update(dt);
        this.paddle.update(dt);

        Collision.ballWithWall(
            this.ball,
            this.width,
            this.height
        )
    }
}