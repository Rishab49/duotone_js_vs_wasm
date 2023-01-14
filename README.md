# duotone_js_vs_wasm

link : https://duotone-js-vs-wasm.vercel.app/

## Introduciton
This app is for demonstration purposes to compare the calculation speed of javascript with wasm code(cpp code compiled to wasm using emscripten).

## Functioning
If you navigate to the web app, you will see a 2-column grid; on both sides, we have a canvas, a set of inputs and a button. Each button can be used to upload any image to the canvas; you can use the color inputs to change the image's tone; as you change the color by dragging the mouse around, you will see a real-time change in the individual canvases.
But you will feel that on the `web worker + WASM` side, the calculation speed is just little bit higher, and there are fewer frame drops during the mouse drag compared to the `web worker` side.

`note : for better observation use image > 5mb which you can find easily on websites likes pexels.com or unsplash.com`

## Takeaway
The key takeaway from this project is that if we have a large amount of data, but are performing simple operations on that data, then it does not matter much if we are using javascript or wasm for that. 

If you have some code optimisations from your side then please make a PR.
