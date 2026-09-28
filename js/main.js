import {Game} from './core/Game.js';
import {GameLoop} from './core/GameLoop.js';
import {Renderer} from './rendering/Renderer.js';

const canvas =
    document.querySelector('#game-canvas');

canvas.width = 800;
canvas.height = 600;

const game = new Game();

const renderer =
    new Renderer(canvas);

const loop = new GameLoop(
    (dt) => {
        game.update(dt);
    },

    () => {

        renderer.clear();

        renderer.drawBall(
            game.ball
        );

        renderer.drawPaddle(
            game.paddle
        );
    }
);

loop.start();