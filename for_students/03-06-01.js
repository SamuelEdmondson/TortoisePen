// @ts-check
export {};

// somewhere in your program you'll want a line
// that looks like:
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const ctx = canvas.getContext("2d");

const waypoints = [];
const tortoises = [];

function floatEquals(a, b, epsilon = 0.01) {
    return Math.abs(a - b) < epsilon;
}


class Waypoint {
    constructor(posx, posy) {
        this.posx = posx;
        this.posy = posy; 
    }
}
canvas.onclick = function(event) {
    const x = event.clientX;
    const y = event.clientY;
    // unfortunately, X,Y is relative to the overall window -
    // we need the X,Y inside the canvas!
    // we know that event.target is a HTMLCanvasElement, so tell typescript
    let box = /** @type {HTMLCanvasElement} */(event.target).getBoundingClientRect();
    const mx = x-box.left;
    const my = y-box.top;

    waypoints.push(new Waypoint(mx, my));
};

// Resize the canvas
canvas.width = 800;
canvas.height = 600;

class Tortoise {
    constructor(posx, posy) {
        this.posx = posx;
        this.posy = posy;
        this.vx = 0;
        this.vy = 0;
        this.current_target = null;
        this.angle = 0;
        this.speed = 50*4;
        this.pawspeed = 0;
        this.shell_wiggle = 0;
        this.components = [];
        this.shell = new Shell(30, "darkgreen");
        this.head = new Head(10, "green");
        this.frontRightPaw = new Paw(16, "green");
        this.frontLeftPaw = new Paw(16, "green", Math.PI); // So the paws are offset, like a real tortoise!
        this.sine_wave = 0;
        this.tail = new Tail(3, "green");

        this.movement_states = ["idle", "moving_toward"];
        this.current_state = "idle";
    }

    draw() {
        ctx.save();
        ctx.translate(this.posx, this.posy);
        ctx?.rotate(this.angle)
        ctx?.scale(2, 2);

            ctx?.save();
            ctx?.translate(0, -35); // Head location
            this.head.draw();
            ctx?.restore();

            ctx?.save();
            ctx?.translate(10, -10);
            this.frontRightPaw.draw();
            ctx?.scale(-1, 1);
            ctx?.translate(20, 0);
            this.frontLeftPaw.draw();
            ctx?.restore();

            ctx?.save();
            ctx?.translate(10, 20);
            this.frontLeftPaw.draw();
            ctx?.scale(-1, 1);
            ctx?.translate(20, 0);
            this.frontRightPaw.draw();
            ctx?.restore();


            ctx?.save();
            ctx?.translate(0, -5);
            this.tail.draw();
            ctx?.restore();

            ctx?.save();
            ctx?.translate(0, 0);
            this.shell.draw(); // Save shell for last since we want everything under it
            ctx?.restore();

        ctx.restore();
    }

    update(deltaTime) {
        this.posx += this.vx * deltaTime;
        this.posy += this.vy * deltaTime;
        
        console.log(this.posx);
        if (waypoints.length != 0) {
            this.frontLeftPaw.start();
            this.frontRightPaw.start();

            this.current_state = "moving_toward";
            this.pawspeed = 5;
            this.shell_wiggle = 5;
            this.current_target = waypoints[0];

            const aiming_direction = {
                x: this.current_target.posx - this.posx,
                y: this.current_target.posy - this.posy
            }

            this.angle = Math.atan2(aiming_direction.y, aiming_direction.x) + Math.PI/2;

            this.vx = this.speed * (aiming_direction.x / Math.sqrt(aiming_direction.x**2 + aiming_direction.y**2));
            this.vy = this.speed * (aiming_direction.y / Math.sqrt(aiming_direction.x**2 + aiming_direction.y**2));

        }
        else {
            this.current_state = "idle";
            this.frontLeftPaw.stop();
            this.frontRightPaw.stop();
            this.vx = 0;
            this.vy = 0;
        }

        if (this.current_state == "moving_toward") {
            if (floatEquals(this.posx, this.current_target.posx, 100) && floatEquals(this.posy, this.current_target.posy, 100)) {
                waypoints.shift();
                this.pawspeed = 0;
                this.shell_wiggle = 0;
                this.current_state = "idle";
                this.frontLeftPaw.stop();
                this.frontRightPaw.stop();
            }
        }

        this.frontRightPaw.update(deltaTime);
        this.frontLeftPaw.update(deltaTime);
        this.shell.update(this.shell_wiggle, deltaTime);
        this.tail.update(deltaTime);
    }
}

class Shell {
    constructor(size, color) {
        this.size = size;
        this.color = color;
        this.posx = 0;
        this.posy = 0;
        this.sinWave = 0;
    }

    draw() {
        ctx.save();
        ctx.strokeStyle = "black"; // Black outline
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        ctx.arc(this.posx, this.posy, this.size, 0, Math.PI * 2);
        ctx.stroke();
        ctx?.fill();
        ctx.restore();
    }

    update(shell_wiggle, deltaTime) {
        this.sinWave += deltaTime * shell_wiggle;

        this.posx = 3 * Math.sin(this.sinWave);
        this.posy = 2 * Math.sin(this.sinWave);
    }
}

class Head {
    constructor(size, color) {
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx?.save();
        ctx.strokeStyle = "black";
        ctx.fillStyle = this.color;

        ctx?.beginPath();
        ctx?.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx?.stroke();
        ctx?.fill();
        ctx?.restore();
    }
}

class Paw {
    constructor(size, color, offset = 0) {
        this.size = size;
        this.color = color;
        this.rotation = 0;
        this.sineWave = 0 + offset;
        this.pawspeed = 5;
        this.is_stopped = false;
    }

    draw() {
        ctx?.save();
        ctx.strokeStyle = "black";
        ctx.fillStyle = this.color;

        ctx?.rotate(this.rotation);
        ctx?.fillRect(0, 0 - this.size, this.size * 2, this.size);

        ctx?.restore();
    }

    update(deltaTime) {
        if (this.is_stopped) {
            return;
        }
        this.sineWave += deltaTime * this.pawspeed;
        this.rotation = ((Math.PI / 13) * Math.sin(this.sineWave)) + (Math.PI / 12);
    }

    start() {
        this.is_stopped = false;
    }

    stop() {
        this.is_stopped = true;
    }
}

class Tail {
    constructor(size, color) {
        this.size = size;
        this.color = color;
        this.rotation = 0;
        this.sineWave = Math.random();
    }

    draw() {
        ctx?.save();
        ctx?.rotate(this.rotation);
        ctx.beginPath();
        ctx.moveTo(25, 0);
        ctx.lineTo(0, 50);
        ctx.lineTo(-25, 0);
        ctx.closePath();

        ctx.fillStyle = this.color; // Set fill color
        ctx.fill(); // Fill the triangle

        ctx.strokeStyle = "black"; // Set border color
        ctx.stroke(); // Outline the triangle
        ctx?.restore();
    }

    update(deltaTime) {
        this.sineWave += deltaTime * 4;
        this.rotation = .1 * Math.sin(this.sineWave)
    }
}


tortoises.push(new Tortoise(100, 100));

var lastTime = 0;
// Animation loop
/**
 * @param {DOMHighResTimeStamp} timestamp
 */
function loop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "lightblue";
    ctx?.fillRect(0, 0, canvas.width, canvas.height);

    let deltaTime = (timestamp - lastTime) / 1000; // Convert to seconds
    lastTime = timestamp;
    // Clear the canvas
    tortoises.forEach(tortoise => {
        tortoise.draw();
        tortoise.update(deltaTime);
    });
    // Request the next frame
    window.requestAnimationFrame(loop);
}

// Start the animation
window.requestAnimationFrame(loop);