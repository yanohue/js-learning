/** @type {HTMLCanvasElement} */
const canvas1 = document.getElementById('canvas1');
const canvas2 = document.getElementById('canvas2');
const canvas3 = document.getElementById('canvas3');
const canvas4 = document.getElementById('canvas4');

const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const ctx3 = canvas3.getContext('2d');
const ctx4 = canvas4.getContext('2d');

const CANVAS_WIDTH = 500;
const CANVAS_HEIGTH = 1000;

const numberOfEnemies = 10;

const enemiesArray1 = [];
const enemiesArray2 = [];
const enemiesArray3 = [];
const enemiesArray4 = [];

const enemyCanvas = [
    {
        context: ctx1,
        enemies: enemiesArray1,
    },
    {
        context: ctx2,
        enemies: enemiesArray2,
    },
    {
        context: ctx3,
        enemies: enemiesArray3,
    },
    {
        context: ctx4,
        enemies: enemiesArray4,
    },
]

let gameFrame = 0;

// refactor idea: each type extends the enemy class
const enemyTypes = [
    {
        name: 'Richard',
        imageSource: 'enemy1.png',
        spriteWidth: 293,
        spriteHeigth: 155,
        size: 0.4,
        speed: 2.5,
    },
    {
        name: 'Godfrey',
        imageSource: 'enemy2.png',
        spriteWidth: 266,
        spriteHeigth: 188,
        size: 0.5,
        speed: 3,
    },
    {
        name: 'Dimitri',
        imageSource: 'enemy3.png',
        spriteWidth: 218,
        spriteHeigth: 177,
        size: 0.3,
        speed: 4,
    },
    {
        name: 'Boca',
        imageSource: 'enemy4.png',
        spriteWidth: 213,
        spriteHeigth: 213,
        size: 0.6,
        speed: 5,
    }
];

class Enemy {
    constructor(imgSrc, sWidth, sHeigth, size, speed){
        this.image = new Image();
        this.image.src = imgSrc;

        this.spriteWidth = sWidth;
        this.spriteHeight = sHeigth;

        this.width = this.spriteWidth * size;
        this.height = this.spriteHeight * size;

        this.spd = speed;

        this.x = Math.random() * (CANVAS_WIDTH - this.width);
        this.y = Math.random() * (CANVAS_HEIGTH - this.height);
        this.frame = 0;

        this.staggerFrames = Math.floor(Math.random()* 3 + 1);
    }
    // update difines the enemy position
    update() {
        //refactor this function
        this.x += Math.random() * (2 * this.spd) - this.spd;
        this.y += Math.random() * (2 * this.spd) - this.spd;

        if(gameFrame % this.staggerFrames === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++; 
        }
    }
    draw(context) {
        context.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};

for (let i = 0; i < numberOfEnemies; i++) {
    enemiesArray1.push(new Enemy(enemyTypes[0].imageSource, enemyTypes[0].spriteWidth, enemyTypes[0].spriteHeigth, enemyTypes[0].size, enemyTypes[0].speed));
    enemiesArray2.push(new Enemy(enemyTypes[1].imageSource, enemyTypes[1].spriteWidth, enemyTypes[1].spriteHeigth, enemyTypes[1].size, enemyTypes[1].speed));
    enemiesArray3.push(new Enemy(enemyTypes[2].imageSource, enemyTypes[2].spriteWidth, enemyTypes[2].spriteHeigth, enemyTypes[2].size, enemyTypes[2].speed));
    enemiesArray4.push(new Enemy(enemyTypes[3].imageSource, enemyTypes[3].spriteWidth, enemyTypes[3].spriteHeigth, enemyTypes[3].size, enemyTypes[3].speed));
}

function animate() {
    enemyCanvas.forEach(canvas => {
        canvas.context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);
        canvas.enemies.forEach(enemy => {
            enemy.update();
            enemy.draw(canvas.context);
        });
    });
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();

// Different animation for each enemyType
// Organize & Refactor