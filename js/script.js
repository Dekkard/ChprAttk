var view, id1, id2, id3, id4;

function beginCampaign() {
    view = "game";
    game();
}

function beginEndless() {
    view = "game";
    game();
    endlessMode();
}

function setup() {
    view = "config";
    document.getElementById("menu").classList.remove("main");
    document.getElementById("menu").classList.add("hide");

    document.getElementById(view).classList.remove("hide");
    document.getElementById(view).classList.add("main-flex");
}

function pressedTrue(e) {
    // console.log(e);
    if (movement[e.key]) {
        movement[e.key].pressed = true;
    }
    if (action[e.key]) {
        action[e.key].pressed = true;
    }
}

function pressedFalse(e) {
    if (movement[e.key]) {
        movement[e.key].pressed = false;
    }
    if (action[e.key]) {
        action[e.key].pressed = false;
    }
}

function game() {
    document.getElementById("p-hp").innerText = "50";
    document.getElementById("hpbar-gr").style.width = "200px";
    document.getElementById("p-ammo").innerText = "500";

    document.getElementById("menu").classList.remove("main");
    document.getElementById("menu").classList.add("hide");

    document.getElementById(view).classList.remove("hide");
    document.getElementById(view).classList.add("main-flex");

    /* var player = document.createElement("div");
    var img = document.createElement("img");
    player.classList.add("player");
    player.id = "player";
    player.style.top = "350px";
    player.style.left = "0px";
    img.src = "images/chopper.png";
    player.append(img);
    document.getElementById(view).prepend(player); */

    document.addEventListener("keydown", pressedTrue);
    document.addEventListener("keyup", pressedFalse);

    id1 = window.setInterval(() => {
        Object.keys(movement).forEach(key => {
            movement[key].pressed && movement[key].func()
        });
        Object.keys(action).forEach(key => {
            action[key].pressed && action[key].func()
        });
    }, 15);

    id2 = window.setInterval(() => {
        bullets = document.getElementsByClassName("bullet");
        enemies = document.getElementsByClassName("enemy");
        Object.values(bullets).forEach((b) => {
            var bLeft = parseInt(b.style.left) + b.clientWidth;
            var bTop = parseInt(b.style.top) + (b.clientHeight / 2);
            Object.values(enemies).forEach((e) => {
                var eLeft = parseInt(e.style.left)
                var eTop = parseInt(e.style.top)
                var maxLeftLim = e.clientWidth + eLeft;
                var maxTopLim = e.clientHeight + eTop;
                if ((maxLeftLim > bLeft && eLeft <= bLeft) & (maxTopLim > bTop && eTop <= bTop)) {
                    var hp = parseInt(e.getElementsByClassName("health")[0].innerText);
                    e.getElementsByClassName("health")[0].innerText = hp - 5;
                    b.remove()
                }
            });
        });
        ebullets = document.getElementsByClassName("e-bullet");
        player = document.getElementById("player");
        Object.values(ebullets).forEach((eb) => {
            var bLeft = parseInt(eb.style.left) + (eb.clientWidth / 2);
            var bTop = parseInt(eb.style.top) + (eb.clientHeight / 2);
            var eLeft = parseInt(player.style.left)
            var eTop = parseInt(player.style.top)
            var maxLeftLim = player.clientWidth + eLeft;
            var maxTopLim = player.clientHeight + eTop;
            if ((maxLeftLim > bLeft && eLeft <= bLeft) & (maxTopLim > bTop && eTop <= bTop)) {
                var hp = parseInt(document.getElementById("p-hp").innerText);
                var hpbar = parseInt(document.getElementById("hpbar-gr").style.width);
                document.getElementById("hpbar-gr").style.width = 200*(1/(50/(hp-1))) + "px";
                document.getElementById("p-hp").innerText = hp - 1;
                eb.remove();
                if (hp <= 0) {
                    back();
                }
            }
        });
    }, 50);

    id3 = window.setInterval(() => {
        enemies = document.getElementById("enemies").children;
        Object.values(enemies).forEach((e) => {
            var hp = parseInt(e.getElementsByClassName("health")[0].innerText);
            if (hp <= 0) e.remove();
        });
    }, 25);
}

function endlessMode() {
    id4 = window.setInterval(() => {
        spawnEnemies();
    }, Math.random() * 3500 + 25);
}

function ungame() {
    document.removeEventListener("keydown", pressedTrue);
    document.removeEventListener("keyup", pressedFalse);
    despawnEnemies();
    window.clearInterval(id1);
    window.clearInterval(id2);
    window.clearInterval(id3);
    window.clearInterval(id4);
}

function back() {
    ungame();
    document.getElementById(view).classList.add("hide");
    document.getElementById(view).classList.remove("main-flex");
    document.getElementById("menu").classList.add("main");
    document.getElementById("menu").classList.remove("hide");
}

function spawnEnemies() {
    var spawnLim = 350;
    var enemy = document.createElement("div");
    var hp = document.createElement("p");
    enemy.classList.add("enemy");
    hp.classList.add("health");
    hp.id = "health";
    hp.innerText = "50";
    enemy.appendChild(hp);
    enemy.style.top = (Math.random() * 750 - 70) - enemy.clientHeight + "px";
    enemy.style.left = (Math.random() * (750 - spawnLim)) + spawnLim - enemy.clientWidth + "px";
    document.getElementById("enemies").appendChild(enemy);
    var id;
    var idE = setInterval(() => {
        if (!enemy.isConnected) {
            clearInterval(idE);
            clearInterval(id);
        }
        var target = document.getElementById("player");
        var tTop = parseInt(target.style.top) + (target.clientHeight / 2);
        var tLeft = parseInt(target.style.left) + (target.clientWidth / 2);

        var bullet = document.createElement("div");
        bullet.classList.add("e-bullet");
        bullet.style.top = parseInt(enemy.style.top) + 37 + "px";
        bullet.style.left = parseInt(enemy.style.left) + 12 + "px";
        document.getElementById(view).appendChild(bullet);

        var hip = Math.sqrt(Math.pow(parseInt(bullet.style.top) - tTop, 2) + Math.pow(parseInt(bullet.style.left) - tLeft, 2));
        var bDirTop = (parseInt(bullet.style.top) - tTop) / hip;
        var bDirLeft = (parseInt(bullet.style.left) - tLeft) / hip;
        id = setInterval(() => {
            if (!enemy.isConnected)
                clearInterval(idE);

            var bTop = parseInt(bullet.style.top);
            var bLeft = parseInt(bullet.style.left);
            if ((bLeft >= 740 || bLeft <= 0) || (bTop >= 740 || bTop <= 0)) {
                try {
                    bullet.remove();
                } catch (DOMException) { }
                clearInterval(id);
            } else {
                bullet.style.top = bTop - bDirTop * 10 + "px";
                bullet.style.left = bLeft - bDirLeft * 10 + "px";
            }
        }, 2);
    }, 3000);
}

function despawnEnemies() {
    Object.values(document.getElementById("enemies").children).forEach((e) => {
        e.remove();
    });
}

const movement = {
    w: {
        pressed: false, func: function () {
            var player = document.getElementById("player");
            var pos = 0;
            var id = setInterval(function () {
                var top = parseInt(player.style.top);
                if (pos == 10 || top == 0)
                    clearInterval(id);
                else {
                    pos++;
                    player.style.top = top - 1 + "px";
                }
            }, 15);
        }
    },
    s: {
        pressed: false, func: function () {
            var player = document.getElementById("player");
            var pos = 0;
            var id = setInterval(function () {
                var top = parseInt(player.style.top);
                if (pos == 10 || top == 750 - player.clientHeight - 70)
                    clearInterval(id);
                else {
                    pos++;
                    player.style.top = top + 1 + "px";
                }
            }, 15);
        }
    },
    a: {
        pressed: false, func: function () {
            var player = document.getElementById("player");
            var pos = 0;
            var id = setInterval(function () {
                var left = parseInt(player.style.left);
                if (pos == 10 || left == 0)
                    clearInterval(id);
                else {
                    pos++;
                    player.style.left = left - 1 + "px";
                }
            }, 15);
        }
    },
    d: {
        pressed: false, func: function () {
            var player = document.getElementById("player");
            var pos = 0;
            var id = setInterval(function () {
                var left = parseInt(player.style.left);
                if (pos == 10 || left == 750 - player.clientWidth)
                    clearInterval(id);
                else {
                    pos++;
                    player.style.left = left + 1 + "px";
                }
            }, 15);
        }
    }
}
const action = {
    " ": {
        pressed: false, func: function () {
            var player = document.getElementById("player");
            var ammo = parseInt(document.getElementById("p-ammo").innerText);
            if (ammo > 0) {
                var top = player.style.top;
                var left = player.style.left;
                var bullet = document.createElement("div");
                bullet.classList.add("bullet");
                bullet.style.top = parseInt(top) + 25 + "px";
                bullet.style.left = parseInt(left) + 89 + "px";
                document.getElementById(view).appendChild(bullet);
                document.getElementById("p-ammo").innerText = ammo - 1;
                var id = setInterval(function () {
                    if (parseInt(bullet.style.left) >= 745) {
                        try {
                            bullet.remove();
                        } catch (DOMException) { }
                        clearInterval(id);
                    } else {
                        bullet.style.left = parseInt(bullet.style.left) + 10 + "px";
                    }
                }, 1);
            }
        }
    },
    b: {
        pressed: false, func: function () {
            this.pressed = false;
            back();
        }
    }
}