export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.fillStyle = 'white'
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBall(ball) {
        const ctx = this.ctx;
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPaddle(paddle) {
        const ctx = this.ctx;
        ctx.fillStyle = "white";
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    drawBricks(bricks) {
        const ctx = this.ctx;
        for (const brick of bricks) {
            if (brick.hp === 0) {
                continue;
            }

            switch (brick.hp) {
                case 2:
                    ctx.fillStyle = "blue";
                    break;
                default:
                    ctx.fillStyle = "teal";
                    break;
            }

            ctx.fillRect(brick.x,
                brick.y,
                brick.width,
                brick.height);

            ctx.fillStyle = "white";
            const hpString = brick.hp.toString();
            ctx.font = "bold 12px Arial";
            ctx.fillText(hpString,
                brick.x + brick.width / 2,
                brick.y + brick.height / 2);

            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(brick.x,
                brick.y,
                brick.width,
                brick.height);
        }
    }
}