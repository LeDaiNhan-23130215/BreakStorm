export class GameLoop {
    constructor(update, render) {
        this.update = update;
        this.render = render;
        this.lastTime = 0;
    }

    start() {
        requestAnimationFrame((time) => {
            this.lastTime = time;
            this.loop(time);
        });
    }

    loop(currentTime) {
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.update(dt);
        this.render();
        requestAnimationFrame(this.loop.bind(this));
    }
}