export class Paddle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width = 100;
        this.height = 15;

        this.speed = 500;
    }

    update(dt, input, maxWidth) {
        if(input.left){
            this.x -= dt * this.speed;
        }

        if(input.right) {
            this.x += dt * this.speed;
        }

        if(this.x < 0) {
            this.x = 0;
        }

        if(this.x + this.width > maxWidth) {
            this.x = maxWidth - this.width;
        }
    }
}