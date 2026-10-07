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
        const hit =
            ball.x + ball.radius >= paddle.x &&
            ball.x - ball.radius <= paddle.x + paddle.width &&
            ball.y + ball.radius >= paddle.y &&
            ball.y - ball.radius <= paddle.y + paddle.height;

        if (!hit || ball.vy <= 0) return;
        if (ball.y > paddle.y + (paddle.height / 2)) return;

        const center = paddle.x + (paddle.width / 2);
        let offset = (ball.x - center) / (paddle.width / 2);

        offset = Math.max(-1, Math.min(1, offset));

        const direction = Math.sign(offset);
        ball.vx = direction * Math.abs(ball.vy) * Math.abs(offset);
        ball.vy *= -1;
    }

    static ballWithBrick(ball, brick) {
        const hit
            = ball.x + ball.radius >= brick.x &&
            ball.x - ball.radius <= brick.x + brick.width &&
            ball.y + ball.radius >= brick.y &&
            ball.y - ball.radius <= brick.y + brick.height &&
            brick.hp !== 0;
        
        if (!hit) return false;

        brick.hit();
        const left   = ball.x + ball.radius - brick.x;
        const right  = brick.x + brick.width - (ball.x - ball.radius);
        const top    = ball.y + ball.radius - brick.y;
        const bottom = brick.y + brick.height - (ball.y - ball.radius);

        const min = Math.min(left, right, top, bottom);

        switch (min) {
            case left:
                ball.x = brick.x - ball.radius;
                ball.vx *= -1;
                break;
            case right:
                ball.x = (brick.x + brick.width) + ball.radius;
                ball.vx *= -1;
                break;
            case top:
                ball.y = (brick.y - ball.radius);
                ball.vy *= -1;
                break;
            case bottom:
                ball.y = (brick.y+ brick.height + ball.radius);
                ball.vy *= -1;
                break;
            default:
                break;
        }
        return true;
    }
}