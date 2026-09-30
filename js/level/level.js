import {Brick} from "../entities/brick.js";

export class Level {
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 0, 0, 0],
            [1, 1, 1, 1, 0, 0, 0, 0],
            [1, 1, 1, 1, 0, 0, 0, 0],
            [1, 1, 1, 1, 0, 0, 0, 0],
            [1, 1, 1, 2, 0, 0, 0, 0],
        ]

        this.bricks = [];
        this.rows = this.grid.length;
        this.cols = this.grid[0].length;
        this.createBrick();
    }

    createBrick() {
        const brickWidth = 80;
        const brickHeight = 25;
        const gap = 0;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = col * (brickWidth + gap);
                const y = row * (brickHeight + gap);
                if (this.grid[row][col] >= 1) {
                    this.bricks.push(
                        new Brick(x, y, brickHeight, brickWidth, this.grid[row][col])
                    );
                }
            }
        }
        return this.bricks
    }
}