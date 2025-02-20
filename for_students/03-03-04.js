// @ts-check
export {};

import * as trisquare from "./03-02-TriSquare.js";

/**
 *
 * @param {CanvasRenderingContext2D} context
 */
function picture(context) {
    trisquare.drawTriSquare(context);
}

// note we use the braces to get new scopes so we can re-use variable names
{ // box 1 - regular canvas coordinate system
    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
    const context = canvas.getContext("2d");
    picture(context);
}

{ // box 2 - flip coordinate system, translate first
    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas2"));
    const context = canvas.getContext("2d");
    context.translate(0, canvas.height);
    context.scale(1, -1);
    picture(context);
}

{ // box 3 - flip coordinate system, scale first
    const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas3"));
    const context = canvas.getContext("2d");
    context.scale(1, -1);
    context.translate(0, -canvas.height);
    picture(context);
}
