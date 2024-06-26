export class CollisionAnimation {
    constructor(game, x, y) {
        this.game = game;

        this.image = document.getElementById('collisionAnimation');

        this.spriteWidth = 100;
        this.SpriteHeight = 90;

        this.sizeModifier = Math.random() + 0.5;

        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.SpriteHeight * this.sizeModifier;

        this.x = x - this.width * 0.5;
        this.y = y - this.height * 0.5;

        this.frameX = 0;
        this.maxFrame = 4;
        this.fps = Math.random() * 10 + 5;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;

        this.sound = new Audio();
        this.sound.src = 'assets/boom.wav';
        this.sound.volume = 0.1;

        this.markedForDeletion = false;
    }

    draw(context) {
        context.save();
        context.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.SpriteHeight, this.x, this.y, this.width, this.height);
        context.restore();
    }

    update(deltatime) {
        this.x -= this.game.speed;

        if(this.frameX === 0) {
            this.sound.play();
        }

        if(this.frameTimer > this.frameInterval) {
            this.frameX++;
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltatime;
        }

        if(this.frameX > this.maxFrame) {
            this.markedForDeletion = true;
        }  
    }
}