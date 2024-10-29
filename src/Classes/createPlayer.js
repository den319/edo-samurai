import { c, canvas } from "../Canvas/canvas.js";
import { gravity } from "../Consts/config.js";

export class CreatePlayer {

    constructor({position, velocity, color= "red", offset={x:0, y:0 }, imageSrc, scale=1, maxFrames=1, movements, 
            attackVal, attackBox}) {
        this.position= position;
        this.velocity= velocity;
        this.height= 150;
        this.width= 50;
        this.lastKey= "";
        this.offset=offset,
        this.attackBox= {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width || 0,
            height: attackBox.height || 0,
        },
        this.color= color;
        this.isAttacking= false;
        this.health= 100;
        this.image= new Image();
        this.image.src= imageSrc || "";
        this.scale= scale;
        this.maxFrames= maxFrames;
        this.currentFrames= 0;
        this.elapsedFrames= 0;
        this.holdedFrames= 5;
        this.movements= movements;
        this.dead= false;
        this.attackVal= attackVal;
        this.allowToMove= false;

        if(movements) {
            for(const movement in this.movements) {
                if(movement) {
                    movements[movement].image= new Image();
                    // @ts-ignore
                    movements[movement].image.src= movements[movement].imagePath;
                }
            }
        }


        // console.log(this.movements)
    }

    draw() {
        c && c.drawImage(
            this.image,
            this.currentFrames * (this.image.width / this.maxFrames),
            0,
            this.image.width / this.maxFrames,
            this.image.height,
            this.position.x - (this.width) - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.maxFrames) * this.scale,
            this.image.height * this.scale,
        )
    }

    
    update() {
        if(canvas && this.attackBox.position) {
            this.draw();
            
            this.attackBox.position.x = this.position.x - this.attackBox.offset.x;
            this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    
            // draw attack-box
            // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    
            // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    
            if(this.position.y + this.velocity.y < canvas.height && this.position.y + this.velocity.y > 10) {
                this.position.y += this.velocity.y;
            } else if(this.position.y + this.velocity.y <= 10) {
                this.switchMovements("fall");
            }
    
            // console.log("y-position: ", this.position.y, this.velocity.y)
            if(this.position.x + this.width + this.velocity.x + 50 < canvas.width && this.position.x +this.width + this.velocity.x >= 100) {
                this.position.x += this.velocity.x;
            }
    
            // gravity function
            if(this.position.y + this.height + this.velocity.y >= canvas.height-((Number(canvas.height) * 15) / 100)) {
                this.velocity.y= 0;
            } else {
                this.velocity.y += gravity;
            }
    
            // player-frames animation
            this.elapsedFrames++;
    
            if(this.elapsedFrames % this.holdedFrames === 0) {
                if(this.currentFrames < this.maxFrames - 1) {
                    this.currentFrames++;
                }else if(this.currentFrames === this.maxFrames - 1 && this.dead) {
                    return;
                } else {
                    this.currentFrames= 0;
                }
            }
        }
    }

    attack() {
        this.switchMovements("attack-1")
        this.isAttacking= true;
    }

    switchMovements(movement) {

        if(this.image === this.movements.death.image) {
            if(this.currentFrames === this.movements.death.maxFrames - 1) {
                this.dead= true;
                return;
            }
            return;
        }

        // overriding other animations while attacking
        if(this.image === this.movements.attack1.image && this.currentFrames < this.movements.attack1.maxFrames-1) return;

        // overriding other animations while taking damage
        if(this.image === this.movements.takeHit.image && this.currentFrames < this.movements.takeHit.maxFrames-1) {
            return;
        }

        // if(movement !== "idle") {
        //     console.log({
        //         image: this.image,
        //         movementImage: this.movements.takeHit.image,
        //         currentFrame: this.currentFrames,
        //         maxFrames: this.movements.takeHit.maxFrames-1,
        //         movement: movement,
        //         movements: this.movements,
        //     });
        // };

        switch(movement) {
            case "idle":
                if(this.image !== this.movements.idle.image) {
                    if(this.movements.idle.image) {
                        this.image= this.movements.idle.image;
                        this.maxFrames= this.movements.idle.maxFrames;
                        this.currentFrames= 0;
                    }
                }
                break;
            case "run":
                if(this.movements.run.image && this.image !== this.movements.run.image) {
                    this.image= this.movements.run.image;
                    this.maxFrames= this.movements.run.maxFrames;
                    this.currentFrames= 0;
                }
                break;
            case "jump":
                if(this.movements.jump.image && this.image !== this.movements.jump.image) {
                    this.image= this.movements.jump.image;
                    this.maxFrames= this.movements.jump.maxFrames;
                    this.currentFrames= 0;
                }
                break;
            case "fall":
                if(this.movements.fall.image && this.image !== this.movements.fall.image) {
                    this.image= this.movements.fall.image;
                    this.maxFrames= this.movements.fall.maxFrames;
                    this.currentFrames= 0;
                }
                break;
            case "attack-1":
                if(this.movements.attack1.image && this.image !== this.movements.attack1.image) {
                    this.image= this.movements.attack1.image;
                    this.maxFrames= this.movements.attack1.maxFrames;
                    this.currentFrames= 0;
                }
                break;
            case "take-hit":
                if(this.movements.takeHit.image && this.image !== this.movements.takeHit.image) {
                    this.image= this.movements.takeHit.image;
                    this.maxFrames= this.movements.takeHit.maxFrames;
                    this.currentFrames= 0;
                }
                break; 
            case "death":
                if(this.movements.death.image && this.image !== this.movements.death.image) {
                    this.image= this.movements.death.image;
                    this.maxFrames= this.movements.death.maxFrames;
                    this.currentFrames= 0;
                }
                break;                 
        }
    }
} 