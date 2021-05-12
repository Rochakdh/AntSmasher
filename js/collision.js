const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
let circles;
 
function getDistance(x1,y1,x2,y2){ 
    var xDistance = x2 - x1;
    var yDistance = y2 - y1;

    return Math.hypot(xDistance, yDistance);
};

class Ant {
    constructor(x,y,dx,dy){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy
    this.radius = 20
    this.size = 2
    this.mass = 0.2
    this.momentum = {
        x: Math.random()-0.5,
        y: Math.random()-0.5
    }
    
    };

    antImage = function(){
        let antImage = new Image();
        antImage.src = 'images/ant.png';
        c.drawImage(antImage, this.x , this.y );
    };

    move = function(){
        this.x += this.momentum.x;
        this.y += this.momentum.y;
    };

    collisionWithScreen = function(){
        if (this.x + this.size >= canvas.width || this.x - this.size <= 0)
            this.momentum.x = -this.momentum.x;
        if (this.y + this.size >= canvas.height || this.y - this.size <= 0)
            this.momentum.y = -this.momentum.y;
    };

    resolveCollision = function (anotherCircle){
        let collisionVector = { x: this.x - anotherCircle.x, y: this.y - anotherCircle.y };
        let distance = getDistance(this.x, this.y, anotherCircle.x, anotherCircle.y)
        let unitVector = {
          x: collisionVector.x / distance,
          y: collisionVector.y / distance,
        };
        let relativeVelocity = {
          x: this.momentum.x - anotherCircle.momentum.x,
          y: this.momentum.y - anotherCircle.momentum.y,
        };
        let speed = relativeVelocity.x * unitVector.x + relativeVelocity.y * unitVector.y;
        let impulse = (2 * speed) / (this.mass + anotherCircle.mass);
        this.momentum.x -= impulse * anotherCircle.mass * unitVector.x;
        this.momentum.y -= speed * anotherCircle.mass * unitVector.y;
        anotherCircle.momentum.x += speed * this.mass * unitVector.x;
        anotherCircle.momentum.y += speed * this.mass * unitVector.y;
    };
    
    collisionWithEachOther = function (circles){
        for (let i = 0; i < circles.length; i++) {
          if (this === circles[i]) continue;
          if (getDistance(this.x,this.y,circles[i].x,circles[i].y) - this.size*2 < 0){
            this.resolveCollision(circles[i]);
        }
        }
    };


}

function randomNumberFromRange(min,max){

    return size = Math.random() * (max - min) + min;
}

function randomPositionCircle(){
    var coordinates = {};
    coordinates.x = Math.random() * innerWidth;
    coordinates.y = Math.random() * innerHeight;

    return coordinates;
}

function init(){
    circles = []
    for (let i = 0; i < 60; i++ ){
        positionCoordinate = randomPositionCircle();
        x = positionCoordinate.x;
        y = positionCoordinate.y;
        let dx = randomNumberFromRange(-5, 5);
        let dy = randomNumberFromRange(-5, 5);
        if (i !== 0){
            for (let j=0; j < circles.length; j++){
                if (getDistance(x,y,circles[j].x,circles[j].y) - size*2 < 0){
                    positionCoordinate = randomPositionCircle();
                    x = positionCoordinate.x;
                    y = positionCoordinate.y;
                    j = -1;
                }
            }
        }
        circles.push(new Ant(x,y,dx,dy));
    }
    console.log(circles)
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(function(circle){
        circle.antImage();
        circle.move();
        circle.collisionWithScreen();
        circle.collisionWithEachOther(circles);
    });
}

init()
animate()