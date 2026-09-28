export class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.radius = 8;

        this.vx = -250;
        this.vy = -250;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }
}