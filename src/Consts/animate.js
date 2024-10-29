import { enemyKeys, playerKeys } from "../Controls/controls.js";
import { decideWinner, rectangularCollision } from "./helpers.js";


let time= 60;
let timeId= 0;

const handleTime= ({player, enemy}) => {
    if(document) {
        if(time > 0) {
            timeId= setTimeout(() => handleTime({player, enemy}), 1000);
            --time;
            // @ts-ignore
           document.getElementById("timer").textContent= String(time);
        } 
    
        if(time === 0) {
            // @ts-ignore
            document.getElementById("modal").style.display= "flex";
            decideWinner(player, enemy, timeId);
        }
    }
}


function animate(
        c, 
        canvas, 
        player, 
        enemy, 
        bgArray,
    ) {
    window.requestAnimationFrame(()  => animate(c, canvas, player, enemy, bgArray));

    // c.fillStyle= "black";
    c.fillRect(0,0, canvas.width, canvas.height);

    bgArray.map((bg) => {
        return bg.update();
    })

    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle= "rgba(255,255,255,0.05)"    
    player.update();
    enemy.update();

    // console.log(playerKeys.d);

    player.velocity.x= 0;
    enemy.velocity.x=0;

    if(bgArray[0].position.x <= -canvas.width || bgArray[0].position.x >= -canvas.width) {
        bgArray[0].position.x= 0;
    }

    // player horizontal movement
    if(playerKeys.a.pressed && player.lastKey === "a") {
        bgArray[0].position.x -= bgArray[0].scrollSpeed;
        player.velocity.x= -5;
        player.switchMovements("run");
    } else if(playerKeys.d.pressed && player.lastKey === "d") {
        bgArray[0].position.x += bgArray[0].scrollSpeed;
        player.velocity.x= 5;
        player.switchMovements("run");
    } else {
        player.switchMovements("idle");
    }

    // player verticle movement
    if(player.velocity.y < 0) {
        player.switchMovements("jump");
    } else if(player.velocity.y > 0) {
        player.switchMovements("fall");
    }

    // enemy movement
    if(enemyKeys.leftArrow.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x= -5;
        enemy.switchMovements("run");
    } else if(enemyKeys.rightArrow.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x= 5;
        enemy.switchMovements("run");
    } else {
        enemy.switchMovements("idle");
    }

    // enemy verticle mvement
    if(enemy.velocity.y < 0) {
        enemy.switchMovements("jump");
    } else if(enemy.velocity.y > 0) {
        enemy.switchMovements("fall");
    }

    // detect the colision when player is attacking
    if(rectangularCollision({player: player, enemy: enemy}) && player.isAttacking && player.currentFrames === 4
    ) {
        player.isAttacking= false;
        if(enemy.health > 0) {
            enemy.health -= player.attackVal; 
        };

        if(enemy.health <= 0) {
            enemy.switchMovements("death");
            enemy.dead= true;
        } else {
            enemy.switchMovements("take-hit")
        }

        // document.getElementById("enemy-life").style.width= enemy.health + "%";
        if(typeof gsap !== 'undefined') {
            gsap.to("#enemy-life", {width: enemy.health + "%"})
        }

        // console.log(enemy.health);
    }

    // if player misses
    if(player.isAttacking && player.currentFrames === 4) {
        player.isAttacking = false;
    }

    // detect the colision when enemy is attacking
    if(rectangularCollision({player: enemy, enemy: player}) && enemy.isAttacking && enemy.currentFrames === 1
    ) {
        enemy.isAttacking= false;
        if(player.health > 0) {
            player.health -= enemy.attackVal;
        };

        if(player.health <= 0) {
            player.switchMovements("death");
            player.dead= true;
        } else {
            player.switchMovements("take-hit")
        }

        // document.getElementById("player-life").style.width= player.health + "%";
        gsap.to("#player-life", {width: player.health + "%"})

    }

    // if enemy misses
    if(enemy.isAttacking && enemy.currentFrames === 1) {
        enemy.isAttacking = false;
    }

    // console.log(player.attackBox.position.y + player.attackBox.height, enemy.position.y)

    // game over logic when HP is 0
    if(document && player.health <= 0 || enemy.health <= 0) {
        // @ts-ignore
        document.getElementById("modal").style.display= "flex";
        decideWinner(player, enemy, timeId);
    }
};

export {animate, handleTime};