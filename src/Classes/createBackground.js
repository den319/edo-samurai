import { c, canvas } from "../Canvas/canvas.js";

export class CreateBackground {

    constructor({position, imageSrc, scrollSpeed= 1}) {
        this.position= position;
        this.scrollSpeed= scrollSpeed;
        this.image= new Image();
        this.image.src= imageSrc;
        this.resizeCanvas();

        window.addEventListener("resize", () => this.resizeCanvas());
    }

    resizeCanvas() {
        if(canvas) {
            canvas.width= window.innerWidth;
            canvas.height= window.innerHeight;
        }
    }

    draw() {
        if(c && canvas)
            c.drawImage(this.image, this.position.x, this.position.y, canvas.width, canvas.height);
    }

    
    update() {
        // this.position.x -= this.scrollSpeed;

        // if(this.position.x <= -canvas.width) {
        //     this.position.x= 0;
        // }

        this.draw();
    }
};