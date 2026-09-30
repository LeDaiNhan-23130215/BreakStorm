export class Brick {
    constructor(x, y, height, width, hp) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.hp = hp;
    }

    hit() {
        this.hp -= 1;
    }
}