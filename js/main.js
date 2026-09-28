import {Game} from './core/Game.js';
import {GameLoop} from './core/GameLoop.js';
import {Renderer} from './rendering/Renderer.js';
import {Input} from './core/input.js';

const canvas =
    document.querySelector('#game-canvas');

canvas.width = 800;
canvas.height = 600;

const input = new Input();
const game = new Game(input);

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