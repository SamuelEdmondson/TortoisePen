// @ts-check
export {};

import * as trisquare from "./03-02-TriSquare.js";

const canvas1 = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
const context1 = canvas1.getContext('2d');
context1.scale(2,1);
context1.scale(1,0.25);
context1.scale(4,4);
context1.scale(.5,1);
trisquare.drawTriSquare(context1);

const canvas2 = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas2"));
const context2 = canvas2.getContext('2d');
// student should change this one line to have values so that the picture matches
context2.scale(4, 1);
trisquare.drawTriSquare(context2);

