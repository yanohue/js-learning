/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGTH = canvas.height = 1000;
const numberOfEnemies = 10;
const enemiesArray1 = [];

let gameFrame = 0;

const enemyTypes = [
    {
        name: 'Richard',
        spriteWidth: 293,
        spriteHeigth: 155,
        imageSource: 'enemy1.png',
    },
    {
        name: 'Godfrey',
        spriteWidth: 266,
        spriteHeigth: 188,
        imageSource: 'enemy2.png',
    },
    {
        name: 'Dimitri',
        spriteWidth: 218,
        spriteHeigth: 177,
        imageSource: 'enemy3.png',
    },
    {
        name: 'Boca',
        spriteWidth: 213,
        spriteHeigth: 212,
        imageSource: 'enemy4.png',
    }
];

class Enemy {
    constructor(imgSrc, sWidth, sHeigth){
        this.image = new Image();
        this.image.src = imgSrc;

        this.spriteWidth = sWidth;
        this.spriteHeight = sHeigth;

        // refactor this to size
        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.speed = Math.random() * 4 - 2;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;

        this.flapSpeed = Math.floor(Math.random()* 3 + 1);
    }
    update() {
        //refactorthis
        this.x += Math.random() * 5 - 2.5;
        this.y += Math.random() * 5 - 2.5;

        // animate sprite => refactor to staggerFrames
        if(gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++; 
        }
    }
    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};

enemyTypes.forEach((enemy) => {
    for (let i = 0; i < numberOfEnemies; i++) {
        enemiesArray1.push(new Enemy(enemy.imageSource, enemy.spriteWidth, enemy.spriteHeigth));
    }
});


function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);
    enemiesArray1.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();

// New canvas for each enemyType
// Different animation for each enemyType
// Organize & Refactor