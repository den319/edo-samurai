import { c, canvas as coreCanvas } from "./src/Canvas/canvas.js";
import { CreateBackground } from "./src/Classes/createBackground.js";
import { CreatePlayer } from "./src/Classes/createPlayer.js";
import { animate, handleTime } from "./src/Consts/animate.js";
import { enemyKeys, playerKeys } from "./src/Controls/controls.js";
    

const canvas= coreCanvas;

if(c && canvas) 
    c.fillRect(0, 0, canvas.width, canvas.height);

const closeTress= new CreateBackground({
    position: {
        x: 0,
        y: 0,
    },
    scrollSpeed: 1.5,
    imageSrc: "/src/Assets/background/Example.webp"
});
// const midTrees= new CreateBackground({
//     position: {
//         x: 0,
//         y: 0,
//     },
//     scrollSpeed: 1,
//     imageSrc: "/src/Assets/background/mid-trees.webp"
// });
// const farTrees= new CreateBackground({
//     position: {
//         x: 0,
//         y: 0,
//     },
//     scrollSpeed: 0.5,
//     imageSrc: "/src/Assets/background/far-trees.webp"
// });

const playerTotalHealth= document.getElementById("player-life");
const playerRemainingHealth= document.getElementById("player-damage-taken");

const healthbarHeight= canvas ? (canvas.height * 3) / 100 + "px" : "25px";

playerTotalHealth.style.height= healthbarHeight;
playerRemainingHealth.style.height= healthbarHeight;

const enemyTotalHealth= document.getElementById("enemy-life");
const enemyRemainingHealth= document.getElementById("enemy-damage-taken");

enemyTotalHealth.style.height= healthbarHeight;
enemyRemainingHealth.style.height= healthbarHeight;

// console.log("canvas height: ", healthbarHeight)


const player= new CreatePlayer({
    position: {
        x: canvas ? canvas.width / 5 : 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x:230,
        y:200
    },
    imageSrc: "/src/Assets/player/player-1/Idle.webp",
    maxFrames: 8,
    attackVal: 15,
    scale: 3,
    movements: {
        idle: {
            imagePath: "/src/Assets/player/player-1/Idle.webp",
            maxFrames: 8,
        },
        run: {
            imagePath: "/src/Assets/player/player-1/Run.webp",
            maxFrames: 8,
        },
        jump: {
            imagePath: "/src/Assets/player/player-1/Jump.webp",
            maxFrames: 2,
        },
        fall: {
            imagePath: "/src/Assets/player/player-1/Fall.webp",
            maxFrames: 2,
        },
        attack1: {
            imagePath: "/src/Assets/player/player-1/Attack1.webp",
            maxFrames: 6,
        },
        takeHit: {
            imagePath: "/src/Assets/player/player-1/Take Hit.webp",
            maxFrames: 4,
        },
        death: {
            imagePath: "/src/Assets/player/player-1/Death.webp",
            maxFrames: 6,
        }
    },
    attackBox: {
        offset: {
            x: -60,
            y: 50
        },
        width: 220,
        height: 50,
    }
});
// console.log(canvas.width)

const enemy= new CreatePlayer({
    position: {
        x: canvas && Number(canvas.width - canvas.width / 4) || 0,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x:220,
        y:220
    },
    imageSrc: "/src/Assets/player/player-2/Idle.webp",
    maxFrames: 4,
    attackVal: 10,
    scale: 3,
    movements: {
        idle: {
            imagePath: "/src/Assets/player/player-2/Idle.webp",
            maxFrames: 4,
        },
        run: {
            imagePath: "/src/Assets/player/player-2/Run.webp",
            maxFrames: 8,
        },
        jump: {
            imagePath: "/src/Assets/player/player-2/Jump.webp",
            maxFrames: 2,
        },
        fall: {
            imagePath: "/src/Assets/player/player-2/Fall.webp",
            maxFrames: 2,
        },
        attack1: {
            imagePath: "/src/Assets/player/player-2/Attack1.webp",
            maxFrames: 4,
        },
        takeHit: {
            imagePath: "/src/Assets/player/player-2/Take hit.webp",
            maxFrames: 3,
        },
        death: {
            imagePath: "/src/Assets/player/player-2/Death.webp",
            maxFrames: 7,
        }
    },
    attackBox: {
        offset: {
            x: 220,
            y: 50,
        },
        width: 220,
        height: 50,
    }
});

handleTime({player:player, enemy:enemy});

(c && canvas) && animate(c, canvas, player, enemy, [closeTress]);

const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const hasKeyboard = window.matchMedia("(pointer: fine)").matches;

// console.log(isTouch, hasKeyboard)

if(hasKeyboard) {
    window.addEventListener("keydown", (event) => {
        if(!player.dead && player.allowToMove){
            switch(event.key) {
                case "d":
                    playerKeys.d.pressed= true;
                    player.lastKey= "d";
                    break;
        
                case "a":
                    playerKeys.a.pressed= true;
                    player.lastKey= "a";
                    break;
        
                case "w":
                    player.velocity.y= -20;
                    break;
        
                case " ":
                    player.attack();
                    break;
             }
        }
        
    
        if(!enemy.dead && enemy.allowToMove){
            switch(event.key) {
               case "ArrowRight":
                   enemyKeys.rightArrow.pressed= true;
                   enemy.lastKey= "ArrowRight";
                   break;
       
               case "ArrowLeft":
                   enemyKeys.leftArrow.pressed= true;
                   enemy.lastKey= "ArrowLeft";
                   break;
       
               case "ArrowUp":
                   enemy.velocity.y= -20;
                   break;
       
               case "ArrowDown":
                   enemy.attack();
                   break;
            }
        }
    });
    
    window.addEventListener("keyup", (event) => {
        switch(event.key) {
            case "d":
                playerKeys.d.pressed= false;
               break;
    
            case "a":
                playerKeys.a.pressed= false;
                break;
        }
    
        switch(event.key) {
            case "ArrowRight":
                enemyKeys.rightArrow.pressed= false;
                break;
    
            case "ArrowLeft":
                enemyKeys.leftArrow.pressed= false;
                break; 
        }
    
    });
} else if (isTouch){
    const mobileControls= document.getElementById("mobile-controls");
    // const upArrowTouch= document.getElementById("arrow-up");
    // const leftArrowTouch= document.getElementById("arrow-left");
    // const rightArrowTouch= document.getElementById("arrow-right");
    // const attackTouch= document.getElementById("attack");

    mobileControls.style.display= "flex"

    window.addEventListener("touchstart", (event) => {
        document.getElementById(event.target.id).addEventListener("contextmenu", (event) => {
            event.preventDefault(); // Disable the default long-press menu
        });
        if(!player.dead && player.allowToMove){
            switch(event.target.id) {
                case "arrow-right":
                    playerKeys.d.pressed= true;
                    player.lastKey= "d";
                    break;
        
                case "arrow-left":
                    playerKeys.a.pressed= true;
                    player.lastKey= "a";
                    break;
        
                case "arrow-up":
                    player.velocity.y= -20;
                    break;
        
                case "attack":
                    player.attack();
                    break;
             }
        }
        
    
        // if(!enemy.dead && enemy.allowToMove){
        //     switch(event.key) {
        //        case "ArrowRight":
        //            enemyKeys.rightArrow.pressed= true;
        //            enemy.lastKey= "ArrowRight";
        //            break;
       
        //        case "ArrowLeft":
        //            enemyKeys.leftArrow.pressed= true;
        //            enemy.lastKey= "ArrowLeft";
        //            break;
       
        //        case "ArrowUp":
        //            enemy.velocity.y= -20;
        //            break;
       
        //        case "ArrowDown":
        //            enemy.attack();
        //            break;
        //     }
        // }
    });
    
    window.addEventListener("touchend", (event) => {
        switch(event.target.id) {
            case "arrow-right":
                playerKeys.d.pressed= false;
               break;
    
            case "arrow-left":
                playerKeys.a.pressed= false;
                break;
        }
    
        // switch(event.key) {
        //     case "ArrowRight":
        //         enemyKeys.rightArrow.pressed= false;
        //         break;
    
        //     case "ArrowLeft":
        //         enemyKeys.leftArrow.pressed= false;
        //         break; 
        // }
    
    });
}

 

const audioButton= document.getElementById("audio-button-parent");
const audio= document.getElementById("audio-button");

audioButton && audioButton.addEventListener("click", (e) => {
    const bgAudio = document.getElementById("background-audio");

    if(bgAudio && audio) {
        if(bgAudio.paused) {
            bgAudio.play();
            audio.src= "/src/Assets/svg/volume-up.svg"
        } else {
            bgAudio.pause();
            audio.src="/src/Assets/svg/volume-mute.svg"
        }
    }
});

const modal= document.getElementById("rematch-button");

modal.addEventListener("click", () => {
    location.reload();
});

// console.log("location", location)


const introModal= document.getElementById("introduction-modal");
const startFightButton= document.getElementById("start-fight-button");

startFightButton.addEventListener("click", () => {
    introModal.style.display= "none";
    player.allowToMove= true;
    enemy.allowToMove= true;
})