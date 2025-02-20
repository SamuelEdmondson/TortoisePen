// @ts-check
export {};

// somewhere in your program you'll want a line
// that looks like:
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const ctx = canvas.getContext("2d");

// Resize the canvas
canvas.width = 800;
canvas.height = 600;

// Quad properties
const quad = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20, // Body radius
    armLength: 40, // Length of arms
    rotorRadius: 10, // Rotor radius
    angle: 0, // Angle of rotation for circular motion
    speed: 0.01, // Speed of circular motion
    rotorSpeeds: [0.2, 0.15, 0.1, 0.25], // Different speeds for rotors
    rotorAngles: [0, 0, 0, 0], // Initial angles for rotors
};

// Draw the quadcopter
function drawQuadcopter(x, y, angle, rotorAngles) {
    // Save the canvas state
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle); // Rotate the quadcopter to face the direction of travel

    // Draw the body
    ctx.beginPath();
    ctx.arc(0, 0, quad.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();

    // Draw the front indicator
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(quad.radius + 10, 0); // Front-facing line
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Rotor positions relative to the body
    const rotors = [
        { x: -quad.armLength, y: -quad.armLength }, // Top-left
        { x: quad.armLength, y: -quad.armLength }, // Top-right
        { x: -quad.armLength, y: quad.armLength }, // Bottom-left
        { x: quad.armLength, y: quad.armLength }, // Bottom-right
    ];

    // Draw the arms
    for (const rotor of rotors) {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(rotor.x, rotor.y);
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Draw the rotors
    for (let i = 0; i < rotors.length; i++) {
        const { x, y } = rotors[i];

        // Rotor hub
        ctx.beginPath();
        ctx.arc(x, y, quad.rotorRadius, 0, Math.PI * 2);
        ctx.fillStyle = "darkgray";
        ctx.fill();

        // Spinning blades
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotorAngles[i]);
        ctx.beginPath();
        ctx.moveTo(-quad.rotorRadius, 0);
        ctx.lineTo(quad.rotorRadius, 0);
        ctx.moveTo(0, -quad.rotorRadius);
        ctx.lineTo(0, quad.rotorRadius);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
    }

    // Restore the canvas state
    ctx.restore();
}

// Animation loop
/**
 * @param {DOMHighResTimeStamp} timestamp
 */
function loop(timestamp) {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update quadcopter position for circular motion
    quad.x = canvas.width / 2 + Math.cos(quad.angle) * 150; // 150 is the circle radius
    quad.y = canvas.height / 2 + Math.sin(quad.angle) * 150;

    // Update rotation angle so the quadcopter faces the direction of travel
    const travelAngle = quad.angle + Math.PI / 2;

    // Update rotor angles
    for (let i = 0; i < quad.rotorAngles.length; i++) {
        quad.rotorAngles[i] += quad.rotorSpeeds[i];
    }

    // Increment the quadcopter's circular motion angle
    quad.angle += quad.speed;

    // Draw the quadcopter
    drawQuadcopter(quad.x, quad.y, travelAngle, quad.rotorAngles);

    // Request the next frame
    window.requestAnimationFrame(loop);
}

// Start the animation
window.requestAnimationFrame(loop);