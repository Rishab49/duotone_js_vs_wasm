let wasm_worker = new Worker("../workers/wasm-worker.js");
let mod;
let create_duotone;
let create_gradient;
let greyscalePointer,
  greyscaleArray = [],
  length,
  offsetLength;



  window.addEventListener("DOMContentLoaded",() => wasm_worker.postMessage({type:"register module"}))

let wasm = document.querySelector("#wasm");
let wasm_file_input = wasm.querySelector("input[type='file']");
let wasm_canvas = document.querySelector("#wasm").querySelector("canvas");
let wasm_ctx = wasm_canvas.getContext("2d");
let wasm_color1 = wasm.querySelectorAll("input[type='color']")[0];
let wasm_color2 = wasm.querySelectorAll("input[type='color']")[1];

let imageDataHeight;
let imageDataWidth;

wasm_file_input.addEventListener("change", onFileChange);
wasm_color1.addEventListener("input", onChange);
wasm_color2.addEventListener("input", onChange);



function onFileChange(e) {

  if(e.target.files[0] != undefined){

 
  let fileReader = new FileReader();

  fileReader.onload = function () {
    let img = new Image();
    img.src = fileReader.result;
    img.onload = function () {
      let height = img.height;
      let width = img.width;
      let aspect = width / height;
      wasm_canvas.height = 1000;
      wasm_canvas.width = 1000 * aspect;
      wasm_ctx.drawImage(img, 0, 0, 1000 * aspect, 1000);
      let imageData = wasm_ctx.getImageData(
        0,
        0,
        wasm_canvas.width,
        wasm_canvas.height
      );
      imageDataWidth = imageData.width;
      imageDataHeight = imageData.height;
      wasm_worker.postMessage({
        type: "convert to greyscale",
        pixels: imageData,
      });
    };
  };

  fileReader.readAsDataURL(e.target.files[0]);
}
}
function onChange() {
  wasm_worker.postMessage({
    type: "create duotone",
    color1: wasm_color1.value,
    color2: wasm_color2.value,
    length: greyscaleArray.length,
    greyscalePointer:greyscalePointer
  });
}

wasm_worker.onmessage = function (e) {
  switch (e.data.type) {
    case "converted to greyscale":
      greyscaleArray = e.data.greyscaleArray;
      greyscalePointer = e.data.greyscalePointer;
      wasm_worker.postMessage({
        type: "create duotone",
        color1: wasm_color1.value,
        color2: wasm_color2.value,
        length: greyscaleArray.length,
        greyscalePointer:greyscalePointer
      });
      break;
    case "created duotone":
      let newData = wasm_ctx.createImageData(imageDataWidth, imageDataHeight);
      newData.data.set(e.data.pixels);
      wasm_ctx.putImageData(newData, 0, 0);
  }
};
