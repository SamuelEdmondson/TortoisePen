// @ts-check

export {};

import * as trisquare from "./03-02-TriSquare.js";

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const context = canvas.getContext('2d');
trisquare.drawTriSquare(context);

const slider = /** @type {HTMLInputElement} */ (document.getElementById("slider1"));

const text = /**@type {HTMLInputElement} */ (document.getElementById("text1"))

function sliderChange() {
    const val = slider.value;
    text.value = val;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.scale(Number(val), Number(val));
    trisquare.drawTriSquare(context);
    context.restore();
}
slider.oninput = sliderChange;
sliderChange();
