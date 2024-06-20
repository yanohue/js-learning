import { Player } from "./player.js";
import { InputHandler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from "./enemies.js";
import { UI } from "./UI.js";

window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game {
        constructor(width, height) {
            this.debug = false; // debug shows hitboxes

            this.width = width;
            this.height = height;
            
            this.groundMargin = 80;
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);

            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);

            this.enemies = [];
            this.enemyTimer = 0;
            this.enemyInterval = 1000;

            this.particles = [];
            this.maxParticles = 200;

            this.collisions = [];

            this.floatingMessages = [];

            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black';

            this.time = 0;
            this.maxTime = 30000;
            this.gameOver = false;

            this.lives = 5;

            // this is here because we need the game object fully loaded
            // else the game crashes
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }

        update(deltatime) {
            this.time += deltatime;
            if(this.time > this.maxTime) {
                this.gameOver = true;
            }
            this.background.update();
            this.player.update(this.input.keys, deltatime);

            // handle enemies
            if(this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltatime;
            }
            this.enemies.forEach((enemy, index) => {
                enemy.update(deltatime);
            });
            
            // handle messages
            this.floatingMessages.forEach(message => {
                message.update();
            });

            // handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
            });
            if(this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }

            // handle collision sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltatime);
            });

            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }

        draw(context) {
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
            this.UI.draw(context);
        }

        addEnemy() {
            if(this.speed > 0 && Math.random() < 0.5) {
                this.enemies.push(new GroundEnemy(this));
            } else if(this.speed > 0) {
                this.enemies.push(new ClimbingEnemy(this));
            }
            this.enemies.push(new FlyingEnemy(this));
        }
    }
    
    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;
    function animate(timestamp) {
        const deltatime = timestamp - lastTime;
        lastTime = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltatime);
        game.draw(ctx);
        if(!game.gameOver) {
            requestAnimationFrame(animate)
        }
    }
    animate(0);
});