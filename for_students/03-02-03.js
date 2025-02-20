// @ts-check

export {};

import * as trisquare from "./03-02-TriSquare.js";

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const context = canvas.getContext('2d');
const sliderX = /** @type {HTMLInputElement} */ (document.getElementById("slider1"));
const sliderY = /** @type {HTMLInputElement} */ (document.getElementById("slider2"));
const textX = /** @type {HTMLInputElement} */ (document.getElementById("text1"));
const textY = /** @type {HTMLInputElement} */ (document.getElementById("text2"));

function sliderChange() {
    const valX = sliderX.value;
    const valY = sliderY.value;
    textX.value = valX;
    textY.value = valY;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.scale(Number(valX), Number(valY));
    trisquare.drawTriSquare(context);
    context.restore();
}
sliderX.oninput = sliderChange;
sliderX.value = "1";
sliderY.oninput = sliderChange;
sliderY.value = "1";
sliderChange();
