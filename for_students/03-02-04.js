// @ts-check
export {};

import * as trisquare from "./03-02-TriSquare.js";

/** @type {HTMLCanvasElement} */
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const context = canvas.getContext('2d');
const slider = /** @type {HTMLInputElement} */ (document.getElementById("slider1"));
const text = /** @type {HTMLInputElement} */ (document.getElementById("text1"));

function sliderChange() {
    const val = slider.value;
    text.value = val;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.scale(Number(val), Number(val));
    context.fillStyle = "goldenrod";
    context.fillRect(10, 10, 20, 20);
    context.restore();
}
slider.oninput = sliderChange;
slider.value = "1";
sliderChange();
