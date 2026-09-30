export class Collision {

    static ballWithWall(ball, width) {

        //Top wall
        if (ball.y - ball.radius <= 0) {
            ball.y = ball.radius;
            ball.vy *= -1;
        }

        //Right wall
        if (ball.x + ball.radius >= width) {
            ball.x = width - ball.radius;
            ball.vx *= -1;
        }

        //Left wall
        if (ball.x - ball.radius <= 0) {
            ball.x = ball.radius;
            ball.vx *= -1;
        }
    }

    static ballWithPaddle(ball, paddle) {
        if (ball.x + ball.radius >= paddle.x &&
            ball.x - ball.radius <= paddle.x + paddle.width &&
            ball.y + ball.radius >= paddle.y &&
            ball.y - ball.radius <= paddle.y + paddle.height
            && ball.y >= 0) {

            ball.y = paddle.y - ball.radius;
            ball.vy *= -1;
        }
    }

    static ballWithBrick(ball, brick) {
        if (ball.x + ball.radius >= brick.x &&
            ball.x - ball.radius <= brick.x + brick.width &&
            ball.y + ball.radius >= brick.y &&
            ball.y - ball.radius <= brick.y + brick.height &&
            brick.hp !== 0
            ) {
            brick.hit();
            ball.vy *= -1;
        }
    }
}