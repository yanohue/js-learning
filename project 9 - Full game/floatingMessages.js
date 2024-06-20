export class FloatingMessage {
    constructor(value, x, y, targerX, targetY) {
        this.value = value;
        
        this.x = x;
        this.y = y;

        this.targerX = targerX;
        this.targetY = targetY

        this.markedForDeletion = false;
        this.timer = 0;
    }

    update() {
        this.x += (this.targerX - this.x) * 0.03;
        this.y += (this.targetY - this.y) * 0.03;
        this.timer++;
        if(this.timer > 100) {
            this.markedForDeletion = true;
        }
    }

    draw(context) {
        let color1 = 'white';
        let color2= 'black'
        if(this.value === '-5') {
            color1 = 'black';
            color2 = 'red';
        } 
        context.font = '20px Creepster';
        context.fillStyle = color1;
        context.fillText(this.value, this.x, this.y);
        context.fillStyle = color2;
        context.fillText(this.value, this.x - 2, this.y - 2);
    }
}