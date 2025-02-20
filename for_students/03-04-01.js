// @ts-check
export {};

import * as trisquare from "./03-02-TriSquare.js";

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const canvasC = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas2"));

const context = canvas.getContext('2d');
const contextC = canvasC.getContext('2d');

const slider = /** @type {HTMLInputElement} */ (document.getElementById("slider1"));
const text = /** @type {HTMLInputElement} */ (document.getElementById("text1"));

function sliderChange() {
    const val = slider.value;
    text.value = val;
    // draw the first canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.rotate(Number(val) * Math.PI);
    trisquare.drawTriSquare(context);
    context.restore();
    // draw the second canvas
    contextC.clearRect(0, 0, canvas.width, canvas.height);
    contextC.save();
    contextC.translate(canvas.width / 2, canvas.height / 2);
    // draw axes BEFORE rotating
    contextC.beginPath();
    contextC.lineWidth = 1;
    contextC.strokeStyle = 'black';
    contextC.moveTo(-canvas.width / 2, 0);
    contextC.lineTo(canvas.width / 2, 0);
    contextC.moveTo(0, -canvas.height / 2);
    contextC.lineTo(0, canvas.height / 2);
    contextC.stroke();
    contextC.rotate(Number(val) * Math.PI);
    trisquare.drawTriSquare(contextC);
    contextC.restore();

}
slider.oninput = sliderChange;
sliderChange();
