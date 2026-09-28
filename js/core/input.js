export class Input{
    constructor(){
        this.left = false;
        this.right = false;

        window.addEventListener('keydown', (event) => {
            if(event.key === 'ArrowLeft') {
                this.left = true;
            }

            if(event.key === 'ArrowRight') {
                this.right = true;
            }
        });

        window.addEventListener('keyup', (event) => {
            if(event.key === 'ArrowLeft') {
                this.left = false;
            }

            if(event.key === 'ArrowRight') {
                this.right = false;
            }
        })
    }
}