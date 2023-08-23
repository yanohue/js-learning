const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

ctx.font = '50px Impact';

let score = 0;
let gameOver = false;
let gameDifficulty = 0;

let timeToNextRaven = 0;
let ravenInterval = 500; 
let lastTime = 0; 

let ravens = [];

class Sprite {
    constructor(source, sw, sh, x, y, frameInterval) {
        this.image = new Image();
        this.image.src = source;

        this.spriteWidth = sw;
        this.spriteHeight = sh;

        this.sizeModifier = Math.random() * 0.6 + 0.4;

        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;

        this.x = x;
        this.y = Math.random() * (y - this.height);

        this.frame = 0;

        this.timeSinceLastFrame = 0;
        this.frameInterval = Math.random() * frameInterval + (frameInterval * 3);

        this.markedForDeletion = false
    }
    update(deltaTime) { // overrided in child class 
    }
    draw() {         // overrided in child class
    }
}

class Raven extends Sprite {
    constructor() {
        super('raven.png', 271, 194, canvas.width, canvas.height, 16);

        this.directionX = Math.random() * 5 + 3;
        this.directionY = Math.random() * 5 - 2.5;

        this.maxFrame = 4;

        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';
    }
    update(deltaTime) {
        if(this.y < 0 || this.y > canvas.height - this.height) {
            this.directionY = this.directionY * - 1;
        }
        this.x -= this.directionX;
        this.y += this.directionY;

        if(this.x < 0 - this.width) {
            this.markedForDeletion = true;
        }
        this.timeSinceLastFrame += deltaTime;

        if(this.timeSinceLastFrame > this.frameInterval) {    
            if(this.frame > this.maxFrame) {
                this.frame = 0;
            }
            else {
                this.frame++;
            }
            this.timeSinceLastFrame = 0;
        }
        if(this.x < 0 - this.width) {
            gameOver = true;
        }
    }
    draw() {
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}

let explosions = [];

class Explosion extends Sprite {
    constructor(x, y, size) {
        super('boom.png', 200, 179, x, y, 96);
        this.x = x;
        this.y = y;

        this.size = size;

        this.frameInterval = 96

        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.sound.volume = 0.1;
    }
    update(deltaTime) {
        if(this.frame === 0) {
            this.sound.play();
        }

        this.timeSinceLastFrame += deltaTime;

        if(this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;
            if(this.frame > 5) {
                this.markedForDeletion = true;
            }
        }
    }
    draw() {
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size / 4, this.size, this.size);
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 70);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 52, 72);
}

function drawGameOver() {
    ctx.textAlign = 'center';

    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.fillStyle = 'red';
    ctx.fillText('GAME OVER', canvas.width / 2 + 3, canvas.height / 2 + 3);

    ctx.fillStyle = 'black';
    ctx.fillText('my score: ' + score, canvas.width / 2, canvas.height / 2 + 100);
}

window.addEventListener('click', function(e) {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
    const pc = detectPixelColor.data;

    ravens.forEach(object => {
        if(object.randomColors[0] === pc[0] && object.randomColors[1] === pc[1] && object.randomColors[2] === pc[2]) {
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
    });
});

function animate(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);

    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    timeToNextRaven += deltaTime;

    if(timeToNextRaven > ravenInterval - gameDifficulty) {
        ravens.push(new Raven());
        timeToNextRaven = 0;
        ravens.sort(function(a,b) {
            return a.width - b.width;
        });
        console.log(gameDifficulty);
        gameDifficulty++;
    }
    drawScore();
    [...ravens, ...explosions].forEach(object => object.update(deltaTime));
    [...ravens, ...explosions].forEach(object => object.draw());
    ravens = ravens.filter(object => !object.markedForDeletion);
    explosions = explosions.filter(object => !object.markedForDeletion);
    if(!gameOver) {
        requestAnimationFrame(animate);
    } else {
        drawGameOver();
    }
}
animate(0);