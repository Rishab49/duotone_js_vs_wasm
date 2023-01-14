# duotone_js_vs_wasm

link : 

## Introduciton
This app is for demonstration purpose to compare the calculation speed of javascript with wasm code(cpp code compiled to wasm using emscripten).

## Functioning
If you navigate to the web app you will see 2 column grid, on the both side we have a canvas and set of inputs and a button. Each button can be used to upload any image to the canvas and you can use the color inputs to change the tone of the image, as you will change the color by dragging the mouse around you will see a realtime change in the respective canvases.
But you will feel that on the `web worker + WASM` side the speed of calculation is higher and there is less framedrops during the mouse drag as compared to the `web worker` side.

`note : for better observation use image > 5mb which you can find easily on websites likes pexels.com or unsplash.com`

If you have some code optimisations from your side then please make a PR.
