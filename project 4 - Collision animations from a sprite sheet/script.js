const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 500;
const CANVAS_HEIGTH = 700;

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

window.addEventListener('click', function(e){
    createAnimation(e);
});

function createAnimation(e) {
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY));
    console.log(explosions);
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);
    for(let i = 0; i < explosions.length; i++){
        explosions[i].update();
        explosions[i].draw();
        if(explosions[i].frame > 5) {
            explosions.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(animate);
}
animate();