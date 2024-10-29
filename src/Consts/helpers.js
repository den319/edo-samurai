
function rectangularCollision({player, enemy}) {
    if(player.attackBox && enemy.attackBox) {

        return  ( 
            // @ts-ignore
            player.attackBox.position.x + player.attackBox.width >= enemy.position.x && player.attackBox.position.x <= enemy.position.x + enemy.width  && player.attackBox.position.y + player.attackBox.height >= enemy.position.y && player.attackBox.position.y <= enemy.position.y + enemy.height
        )
    }

    return false;
}

function decideWinner(player, enemy, timeId) {
    clearTimeout(timeId);
    if(document && player.health === enemy.health) {
        // @ts-ignore
        document.getElementById("decision").textContent= "Match Is Draw";
    } else if(player.health < enemy.health) {
        // @ts-ignore
        document.getElementById("decision").textContent= "Enemy Won!";
    } else if(player.health > enemy.health) {
        // @ts-ignore
        document.getElementById("decision").textContent= "Player Won!";
    }
}

export {rectangularCollision, decideWinner}