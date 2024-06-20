import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerState.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from "./floatingMessages.js"; 

export class Player {
    constructor(game) {
        this.game = game;

        this.image = document.getElementById('player');
        this.width = 100;
        this.height = 91.3;

        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 4;
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;

        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;

        this.speed = 0;
        this.maxSpeed = 5; // pixel per frame

        this.verticalSpeed = 0;
        this.gravity = 1;

        this.states = [
            new Sitting(this.game),
            new Running(this.game),
            new Jumping(this.game),
            new Falling(this.game),
            new Rolling(this.game),
            new Diving(this.game),
            new Hit(this.game),
        ];
        this.currentState = null;
    }

    update(input, deltatime) {
        this.checkCollision();
        this.currentState.handleInput(input);

        // horizontal movement 
        this.x += this.speed;

        if(input.includes('ArrowRight') && this.currentState !== this.states[6]) {
            this.speed = this.maxSpeed;
        } else if(input.includes('ArrowLeft') && this.currentState !== this.states[6]) {
            this.speed = -this.maxSpeed;
        } else {
            this.speed = 0;
        }

        // horizontal boundaries
        if(this.x < 0) {
            this.x = 0;
        }
        if(this.x > this.game.width - this.width) {
            this.x = this.game.width - this.width;
        }

        // vertical movement 
        this.y += this.verticalSpeed;
        if(!this.onGround()) {
            this.verticalSpeed += this.gravity;
        } else {
            this.verticalSpeed = 0;
        }
        
        // vertical boundaries
        if(this.y > this.game.height - this.height - this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin;
        }

        // sprite animation
        if(this.frameTimer > this.frameInterval) {
            if(this.frameX < this.maxFrame) {
                this.frameX++;
            } else {
                this.frameX = 0;
            }
            this.frameTimer = 0;
        } else {
            this.frameTimer += deltatime;
        }

    }

    draw(context) {
        if(this.game.debug) {
            context.strokeRect(this.x, this.y, this.width, this.height);
        }
        context.drawImage(
            this.image, 
            this.frameX * this.width, 
            this.frameY * this.height, 
            this.width, 
            this.height, 
            this.x, 
            this.y, 
            this.width, 
            this.height
        );
    }

    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state, speedModifier) {
        this.game.speed = this.game.maxSpeed * speedModifier;

        this.currentState = this.states[state];
        this.currentState.enter();
    }

    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if(
                enemy.x < this.x + this.width && 
                enemy.x + this.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if(this.currentState === this.states[4] || this.currentState === this.states[5]) {
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50));
                } else {
                    this.setState(6, 0);
                    this.game.score -= 5;
                    this.game.floatingMessages.push(new FloatingMessage('-5', enemy.x, enemy.y, 150, 50));
                    this.game.lives--;
                    if(this.game.lives <= 0) {{
                        this.game.gameOver = true;
                    }}
                }
            }
        });
    }
}