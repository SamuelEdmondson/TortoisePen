// @ts-check
export {};

// somewhere in your program you'll want a line
// that looks like:
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const ctx = canvas.getContext("2d");

const waypoints = [];
const tortoises = [];
const bugs = [];
const splinePaths = [];

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
        ctx.strokeStyle = "black"; // Outline color
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        ctx.arc(this.posx, this.posy, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(this.posx, this.posy, this.size * 0.6, 0, Math.PI * 2);
        ctx.stroke();
        
        let segments = 8;
        for (let i = 0; i < segments; i++) {
            let angle = (i / segments) * 2 * Math.PI;
            let innerRadius = this.size * 0.6;
            let outerRadius = this.size * 0.95;
            let x1 = this.posx + innerRadius * Math.cos(angle);
            let y1 = this.posy + innerRadius * Math.sin(angle);
            let x2 = this.posx + outerRadius * Math.cos(angle);
            let y2 = this.posy + outerRadius * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
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
        ctx?.fillRect(0, 0 - this.size, this.size * 1.6, this.size);

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

function catmullRom(p0, p1, p2, p3, t) {
    const t2 = t * t;
    const t3 = t2 * t;
    const x = 0.5 * ((2 * p1.x) +
                     (-p0.x + p2.x) * t +
                     (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                     (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
    const y = 0.5 * ((2 * p1.y) +
                     (-p0.y + p2.y) * t +
                     (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                     (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
    return { x, y };
}

class SplinePath {
    /**
     * @param {Array<{x: number, y: number}>} points
     * @param {number} samplesPerSegment
     */
    constructor(points, samplesPerSegment = 100) {
        this.points = points;
        this.samplesPerSegment = samplesPerSegment;
        this.samples = [];
        this.totalLength = 0;
        this.computeSamples();
    }

    computeSamples() {
        this.samples = [];
        let cumulativeLength = 0;
        const n = this.points.length;
        const segments = n - 1;
        for (let i = 0; i < segments; i++) {
            let p0;
            let p1;
            let p2;
            let p3;
            p0 = this.points[(i - 1 + n) % n];
            p1 = this.points[i % n];
            p2 = this.points[(i + 1) % n];
            p3 = this.points[(i + 2) % n];
            for (let j = 0; j <= this.samplesPerSegment; j++) {
                const t = j / this.samplesPerSegment;
                const u = i + t;
                const point = catmullRom(p0, p1, p2, p3, t);
                if (this.samples.length === 0) {
                    this.samples.push({ u, x: point.x, y: point.y, length: 0 });
                } else {
                    const prev = this.samples[this.samples.length - 1];
                    const dx = point.x - prev.x;
                    const dy = point.y - prev.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    cumulativeLength += dist;
                    this.samples.push({ u, x: point.x, y: point.y, length: cumulativeLength });
                }
            }
        }
        this.totalLength = cumulativeLength;
    }

    getPoint(u) {
        const i = Math.floor(u);
        const t = u - i;
        const n = this.points.length;
        const idx = Math.min(i, n - 2);
        const p0 = idx === 0 ? this.points[idx] : this.points[idx - 1];
        const p1 = this.points[idx];
        const p2 = this.points[idx + 1];
        const p3 = (idx + 2 < n) ? this.points[idx + 2] : this.points[idx + 1];
        return catmullRom(p0, p1, p2, p3, t);
    }

    getPointAtDistance(s) {
        s = s % this.totalLength;
        let low = 0, high = this.samples.length - 1;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (this.samples[mid].length < s) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        const sample2 = this.samples[low];
        const sample1 = this.samples[low - 1] || this.samples[0];
        const segmentLength = sample2.length - sample1.length;
        const factor = segmentLength === 0 ? 0 : (s - sample1.length) / segmentLength;
        const x = sample1.x + factor * (sample2.x - sample1.x);
        const y = sample1.y + factor * (sample2.y - sample1.y);
        return { x, y };
    }

    getTangentAtDistance(s) {
        const delta = 0.1;
        const p1 = this.getPointAtDistance(s);
        const p2 = this.getPointAtDistance(s + delta);
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const mag = Math.sqrt(dx * dx + dy * dy) || 1;
        return { x: dx / mag, y: dy / mag };
    }

    draw(ctx) {
        ctx.save();
        ctx.strokeStyle = "purple";
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (this.samples.length > 0) {
            ctx.moveTo(this.samples[0].x, this.samples[0].y);
            for (let i = 1; i < this.samples.length; i++) {
                ctx.lineTo(this.samples[i].x, this.samples[i].y);
            }
        }
        ctx.stroke();
        ctx.restore();
    }
}

class Bug {
    constructor(path, speed) {
        this.path = path;
        this.speed = speed;
        this.distanceTraveled = 0;
        this.pos = { x: 0, y: 0 };
        this.angle = 0;
    }

    update(deltaTime) {
        this.distanceTraveled = (this.distanceTraveled + this.speed * deltaTime) % this.path.totalLength;
        this.pos = this.path.getPointAtDistance(this.distanceTraveled);
        const tangent = this.path.getTangentAtDistance(this.distanceTraveled);
        this.angle = Math.atan2(tangent.y, tangent.x);
    }

    draw() {
        const { x, y } = this.pos;
        ctx.save();
        ctx.translate(x, y);
        // Rotate so the bug faces along the path's tangent (adjusted by 90°)
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(5, 5);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

const controlPoints = [
    { x: 0, y: 100 },
    { x: 300, y: 50 },
    { x: 500, y: 150 },
    { x: 600, y: 400 },
    { x: 400, y: 550 },
    { x: 200, y: 33 }
];

const splinePath = new SplinePath(controlPoints, 100);

function createRandomSplinePathWithBug() {
    // Random number of control points with random x and random y values
    const controlPoints = Array.from({ length: 6 }, () => ({
        x: Math.random() * 800,
        y: Math.random() * 600
      }));

      controlPoints.unshift({x: 0, y: Math.random() * 600});
      controlPoints.push({x:800, y: Math.random() * 600});

      const splinePath = new SplinePath(controlPoints);
      bugs.push(new Bug(new SplinePath(controlPoints), Math.random() * 200))
      splinePaths.push(splinePath);
}


bugs.push(new Bug(splinePath, 100));

const numBugs = 50;
for (let i = 0; i < numBugs; i++) {
    createRandomSplinePathWithBug();
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

    waypoints.forEach(waypoint => {
        ctx.fillStyle = "red";
        ctx.fillRect(waypoint.posx, waypoint.posy, 30, 30);
    })

    const debugView = document.getElementById("debugView");
    if (debugView.checked) {
        // Get a random debug path from the array
        splinePaths[0].draw(ctx);
    }

    bugs.forEach(bug => {
        bug.update(deltaTime);
        bug.draw();
    });
    
    tortoises.forEach(tortoise => {
        tortoise.draw();
        tortoise.update(deltaTime);
    });

    // Request the next frame
    window.requestAnimationFrame(loop);
}

// Start the animation
window.requestAnimationFrame(loop);