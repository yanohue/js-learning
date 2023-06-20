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

const numberOfEnemies = 25;

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

let gameFrame = 0; // Organize this line => gameFrame needs a deep look into

// Refactor idea: each type becomes its own class and extends the enemy class.

// The objective: facilitate changes to the movement pattern & more...

// Currently the pattern is defined by the class Enemy update() method,
// and is dependant of enemyTypes speed atribute, this interactions creates the JITTER movement pattern,
// Math.random() is used to create some variance between each enemy.
// The way its done now, its quite hardcoded.

// Thinking about aplying Math.sin() & Math.cos() to create a WAVE pattern movement,
// for both the x-axis and y-axis.

// Also, another pattern idea is to use Math.random() to generate a COORDINATE and 
// enemies gradually move towards that location.

// Ideas needs to be developed, tested & validated.

class Enemy {
    constructor(imgSrc, spriteWidth, spriteHeigth, size, speed){
        this.image = new Image();
        this.image.src = imgSrc;
        this.spriteWidth = spriteWidth;
        this.spriteHeight = spriteHeigth;

        this.width = this.spriteWidth * size;
        this.height = this.spriteHeight * size;

        this.speed = speed;

        this.x = Math.random() * (CANVAS_WIDTH - this.width);
        this.y = Math.random() * (CANVAS_HEIGTH - this.height);
        this.frame = 0;

        this.staggerFrames = Math.floor(Math.random() * 3 + 1);
    }
    update() {
        // child class override
    }
    // Refactor idea: new method staggerFrames
    draw(context) {
        context.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
};

class Jitter_bat extends Enemy {
    constructor() {
        super('enemy1.png', 293, 155, 0.4, Math.random() * 4 + 1);
    }
    update() {
        this.x += Math.random() * (2 * this.speed) - this.speed;
        this.y += Math.random() * (2 * this.speed) - this.speed;

        if(gameFrame % this.staggerFrames === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++; 
        }
    }
};

class Wave_bat extends Enemy {
    constructor() {
        super('enemy2.png', 266, 188, 0.5, Math.random() * 4 + 1);

        this.angle = Math.random() * 2;
        this.angleIncrement = Math.random() * 0.2
    }
    update() {
        this.x -= this.speed;
        this.y += Math.sin(this.angle);

        this.angle += this.angleIncrement;

        if(this.x + this.width < 0) {
            this.x = CANVAS_WIDTH;
        }
        if(gameFrame % this.staggerFrames === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++; 
        }
    }
};
class Tiny_ghost extends Enemy {
    constructor() {
        super('enemy3.png', 218, 177, 0.3, Math.random() * 4 + 1);
    }
    update() {
        // Develop movement pattern
    }
};
class Scary_saw extends Enemy {
    constructor() {
        super('enemy4.png', 213, 213, 0.6, Math.random() * 4 + 1);
    }
    update() {
        // Develop movement pattern
    }
};

for (let i = 0; i < numberOfEnemies; i++) {
    enemiesArray1.push(new Jitter_bat());
    enemiesArray2.push(new Wave_bat());
    enemiesArray3.push(new Tiny_ghost());
    enemiesArray4.push(new Scary_saw());
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

// to-do list
// Different animation for each enemyType
// Organize & Refactor