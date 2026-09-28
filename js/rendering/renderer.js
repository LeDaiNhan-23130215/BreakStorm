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
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPaddle(paddle) {
        this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
}