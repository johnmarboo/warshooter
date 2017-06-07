var stage, hero, queue, enemies = [],
    boss, bossAlive = false,
    bullets = [],
    levelText, gameOver, bossLevelText;
var keys = {
    u: false,
    d: false,
    l: false,
    r: false
};
var enemiesSS, explosionSS
var settings = {
    heroSpeed: 4,
    enemySpeed: 2,
    bulletSpeed: 3,
    damage: 15,
    fireRate: 30,
    lives: 3,
    enemyHealth: 100,
    level: 0,
};

function preload() {
    //    console.log("loaded");
    "use strict";
    stage = new createjs.Stage("ss");
    queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    queue.loadManifest([{
        id: "enemiesSS",
        src: 'army (4).json'
	}, {
        id: 'sound',
        src: 'tanklyd.mp3'
	}, {
        id: 'vunde',
        src: 'win.mp3'
	}, {
        id: 'explosionSS',
        src: 'boommain.json'
	}, {
        id: 'kaboom',
        src: 'bomb2.mp3'
	}]);
    queue.addEventListener('progress', function () {
        //        console.log("hi mom, preloading");
    });
    queue.addEventListener('complete', setup);
    //    console.log("hi im the setup complete");
}

function setup() {
    //    console.log("hi im the function setup");
    "use strict";
    enemiesSS = new createjs.SpriteSheet(queue.getResult("enemiesSS"))
    explosionSS = new createjs.SpriteSheet(queue.getResult("explosionSS"))
        //    explosionSS = new createjs.SpriteSheet(queue.getResult("explosionSS"))
    hero = new createjs.Sprite(enemiesSS, "sprite4"); // this crap isnt working if you see this Jonas. you will prob do. I tried everything. Prob some mistakes made with my json file. 
    hero.width = 16;
    hero.height = 16;
    hero.x = 300 - (72 / 2);
    hero.y = stage.canvas.height - hero.height
    levelText = new createjs.Text("", "30px Verdana", "#FFF");
    stage.addChild(levelText);
    nextLevel();
    stage.addChild(hero);
    window.addEventListener('keyup', fingerUp);
    window.addEventListener('keydown', fingerDown);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', heartBeat)
    gameOver = new createjs.Text("", "30px Verdana", "#FFF");
    stage.addChild(gameOver);
}

function nextLevel() {
    "use strict"
    settings.level++;
    // change text
    levelText.text = "level " + settings.level;
    // put it to the left of the screen
    levelText.x = -100;
    levelText.y = -100;
    levelText.textAlign = "center";
    levelText.textBaseline = "middle";
    // animate in
    createjs.Tween.get(levelText).to({
            x: 300,
            y: 400
        }, 1500, createjs.Ease.backOut).wait(500).to({
            x: 800,
            y: -100
        }, 1000)
        // animate out
        // sound
    createjs.Sound.play('vundet');
    console.log("go through")
        // Add boss
    if (settings.level == 3) {
        console.log("we are at lvl 3 ");
        boss = new createjs.Sprite(enemiesSS, "sprite4");
        boss.width = 16;
        boss.height = 16;
        boss.x = Math.floor(Math.random() * 550);
        boss.y = Math.floor(Math.random() * 550) + 100 * -1
        stage.addChild(boss);
        //        enemies.push(boss);
        bossAlive = true;
        console.log("boss is added");
    } else {
        console.log("enemies added to other lvls");
        addEnemies();
    }
}

function addEnemies() {
    for (var i = 0; i < settings.level; i++) {
        var temp = new createjs.Sprite(enemiesSS, "sprite5");
        temp.width = 16;
        temp.height = 16;
        temp.x = Math.floor(Math.random() * 550);
        temp.y = Math.floor(Math.random() * 550) + 100 * -1
        stage.addChild(temp);
        enemies.push(temp);
    }
}
// move enemies 
function moveEnemies() {
    "use strict"
    for (var i = enemies.length - 1; i >= 0; i--) {
        enemies[i].y += settings.enemySpeed;
        if (enemies[i].y > stage.canvas.height) {
            enemies[i].y = Math.floor(Math.random() * 550) + 100 * -1
            enemies[i].x = Math.floor(Math.random() * 550);
        }
    }
    createjs.Sound.play('fjern');
}
// Her bliver bossen tilføjet
function moveBoss() {
    if (settings.level == 3) {
        console.log("we are at lvl 3 ");
        boss.y++
    }
}

function fingerUp(e) {
    "use strict";
    console.log(e.keyCode);
    switch (e.keyCode) {
    case 37:
        keys.l = false;
        break;
    case 38:
        keys.u = false;
        break;
    case 39:
        keys.r = false;
        break;
    case 40:
        keys.d = false;
        break;
    case 32:
        fire();
        break;
    }
}

function fingerDown(e) {
    "use strict";
    switch (e.keyCode) {
    case 37:
        keys.l = true;
        break;
    case 38:
        keys.u = true;
        break;
    case 39:
        keys.r = true;
        break;
    case 40:
        keys.d = true;
        break;
    }
}

function explode(x, y) {
    var ex = new createjs.Sprite(explosionSS, "explosionframes");
    stage.addChild(ex);
    ex.x = x;
    ex.y = y;
    ex.addEventListener('animationend', function () {
        //        console.log("over");
        stage.removeChild(ex);
    })
    createjs.Sound.play('kaboom');
}

function fire() {
    console.log("fire!!!");
    var temp = new createjs.Bitmap("kugle3.png");
    //    temp.graphics.beginFill("#FFF").drawCircle(0, 0, 2);
    temp.x = hero.x + hero.width / 2;
    temp.y = hero.y;
    temp.width = 4;
    temp.height = 4;
    bullets.push(temp);
    stage.addChild(temp);
    createjs.Sound.play('sound');
}

function moveHero() {
    //    console.log("nu skal du bevæge dig")
    "use strict";
    if (keys.l) {
        hero.x -= settings.heroSpeed;
        if (hero.x < 0) {
            hero.x = 0;
        }
    }
    if (keys.r) {
        hero.x += settings.heroSpeed;
        if (hero.x > 600 - hero.width) {
            hero.x = 600 - hero.width;
        }
    }
    if (keys.u) {
        hero.y -= settings.heroSpeed;
    }
    if (keys.d) {
        hero.y += settings.heroSpeed;
    }
}

function moveBullets() {
    "use strict"
    for (var i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= settings.bulletSpeed;
        if (bullets[i].y < -1) {
            stage.removeChild(bullets[i]);
            bullets.splice(i, 1)
        }
    }
}

function hitTest(rect1, rect2) {
    if (rect1.x >= rect2.x + rect2.width || rect1.x + rect1.width <= rect2.x || rect1.y >= rect2.y + rect2.height || rect1.y + rect1.height <= rect2.y) {
        return false;
    }
    return true;
}

function doCollisonChecking() {
    "use strict"
    //enemy vs hero 
    for (var i = enemies.length - 1; i >= 0; i--) {
        if (hitTest(hero, enemies[i])) {
            settings.lives--
                stage.removeChild(enemies[i])
            enemies.splice(i, 1);
            explode(hero.x + hero.width / 2, hero.y);
            if (settings.lives <= 0) {
                console.log("dead");
            }
        }
        // change text
    }
    // enemy vs boss @@@@@@@@@@@@
    if (bossAlive) {
        if (hitTest(hero, boss)) {
            settings.lives--
                stage.removeChild(boss);

            if (settings.lives <= 0) {

                console.log("boss is dead");
            }
        }
    }
    // bullet vs boss
    //bullet vs enemies
    for (var e = enemies.length - 1; e >= 0; e--) {
        var removeEnemy = false;
        for (var b = bullets.length - 1; b >= 0; b--) {
            //            console.log("comnparing", e, b)
            if (hitTest(enemies[e], bullets[b])) {
                explode(bullets[b].x, bullets[b].y);
                stage.removeChild(bullets[b]);
                removeEnemy = true;
                bullets.splice(b, 1)
                console.log(enemies);
            }
        }
        if (removeEnemy) {
            stage.removeChild(enemies[e]);
            enemies.splice(e, 1)
        }
    }
    //  if(hitTest(enemies[e], bullets[b]))
    if (enemies.length === 0 && !bossAlive) {
        nextLevel();
    }
}

function heartBeat(e) {
    "use strict";
    moveHero();
    moveBoss()
    stage.update(e);
    moveEnemies();
    moveBullets();
    doCollisonChecking();
}
window.addEventListener('load', preload);