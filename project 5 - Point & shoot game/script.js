const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let timeNow = 0;
let frameLatency = 0;
let sinceLastFrame = 0;

let frameInterval = 100;

let gameFrame = 0;

let enemies = [];
let numberOfEnemies = 25;

class Enemy {
    constructor(imgSrc, spriteWidth, spriteHeigth, size, speed){
        this.image = new Image();
        this.image.src = imgSrc;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeigth;

        this.width = this.spriteWidth * size;
        this.height = this.spriteHeight * size;

        this.speed = speed;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;

        this.staggerFrames = Math.floor(Math.random() * 3 + 1);

        this.isAlive = true;
        this.markedForDeletion = false;
    }
    update() {
        // child class override
    }
    draw() {
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
    death() {
        this.isAlive = false;
    }
};

class Wave_bat extends Enemy {
    constructor() {
        super('enemy2.png', 266, 188, 0.5, Math.random() * 4 + 1);

        this.angle = Math.random() * 2;
        this.angleIncrement = Math.random() * 0.2;
        this.multiplier = Math.random() * 7;
    }
    update() {
        this.x -= this.speed;
        this.y += this.multiplier * Math.sin(this.angle);

        this.angle += this.angleIncrement;

        if(this.x + this.width < 0) {
            this.x = canvas.width;
        }
        if(gameFrame % this.staggerFrames === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++; 
        }
    }
};

for(let i = 0; i < numberOfEnemies; i++) {
    enemies.push(new Wave_bat());
}

function animateEnemy(timestamp) {
    if(timeNow != 0) frameLatency = timestamp - timeNow;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    enemies.forEach(enemy => {
        enemy.update();
        enemy.draw();
    })

    timeNow = timestamp;

    if(Math.floor(frameInterval % frameLatency) === 0) {
        gameFrame++;
    }
    requestAnimationFrame(animateEnemy);
}
animateEnemy(0);

//====================================================

const explosions = [];
let canvasPosition = canvas.getBoundingClientRect();

class Explosion {
    constructor(x, y) {
        this.image = new Image();
        this.image.src = 'boom.png';

        this.spriteWidth = 200;
        this.spriteHeigth = 179;

        this.width = this.spriteWidth * 0.5;
        this.heigth = this.spriteHeigth * 0.5;

        this.x = x;
        this.y = y;

        this.frame = 0;
        this.staggerFrames = 0;

        this.angle = Math.random() * 6.2;

        this.sound = new Audio();
        this.sound.src = 'boom.wav'
        this.sound.volume = 0.2;
    }
    update() {
        if(this.frame === 0) {
            this.sound.play();
        };
        this.staggerFrames++;
        if(this.staggerFrames % 7 === 0) {
            this.frame++;
        }
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeigth, 0 - this.width * 0.5, 0 - this.heigth * 0.5, this.width, this.heigth);
        ctx.restore();
    }
}

function createExplosionAnimation(e) {
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY));
}

function animateExplosion() {
    for(let i = 0; i < explosions.length; i++){
        explosions[i].update();
        explosions[i].draw();
        if(explosions[i].frame > 5) {
            explosions.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animateExplosion);
}
animateExplosion();

//====================================================

window.addEventListener('click', function(e){

    enemies.forEach(enemy => {
        // condition = enemy hitbox collides with click coordinate
        if((e.x > enemy.x) && (e.x < enemy.x + enemy.width) && (e.y < enemy.y) && (e.y < enemy.y + enemy.height)) {
            console.log(`success`);
            createExplosionAnimation(e);
        }
        console.log(`fail`);
    });
});
