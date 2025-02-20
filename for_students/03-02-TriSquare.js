// @ts-check

export function drawTriSquare(context) {
    context.fillStyle = "goldenrod";
    context.fillRect(0, 0, 20, 20);
    context.fillStyle = "red";
    context.beginPath();
    context.moveTo(5, 5);
    context.lineTo(5, 15);
    context.lineTo(15, 10);
    context.fill();
}

