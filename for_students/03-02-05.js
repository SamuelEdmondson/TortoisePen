// @ts-check
export {};

/** @type {HTMLCanvasElement} */
const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const context = canvas.getContext('2d');
const slider1 = /** @type {HTMLInputElement} */ (document.getElementById("slider1"));
const slider2 = /** @type {HTMLInputElement} */ (document.getElementById("slider2"));
const textX = /** @type {HTMLInputElement} */ (document.getElementById("text1"));
const textY = /** @type {HTMLInputElement} */ (document.getElementById("text2"));

function sliderChange() {
    const val1 = slider1.value;
    const val2 = slider2.value;
    textX.value = val1;
    textY.value = val2;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();
    context.scale(Number(val1), Number(val1));
    context.fillStyle = "RGBA(255,0,0,.5)";
    context.fillRect(0, 0, 20, 20);
    context.scale(Number(val2), Number(val2));
    context.fillStyle = "RGBA(0,0,255,.5)";
    context.fillRect(0, 0, 20, 20);
    context.restore();
}
slider1.oninput = sliderChange;
slider1.value = "1";
slider2.oninput = sliderChange;
slider2.value = "1";
sliderChange();
