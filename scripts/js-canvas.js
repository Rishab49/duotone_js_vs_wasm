let worker = new Worker("../workers/js-worker.js");



[...document.querySelectorAll(".file_button")].forEach(e => e.addEventListener("click",(e) => e.target.parentElement.click()))

//VARIABLES
let js = document.querySelector("#js");
let js_file_input = js.querySelector("input[type='file']");
let js_canvas = js.querySelector("canvas");
let js_ctx = js_canvas.getContext("2d");
let js_color1 = js.querySelectorAll("input[type='color']")[0];
let js_color2 = js.querySelectorAll("input[type='color']")[1];
let greyArray = [];

// EVENT LISTENERS
js_color1.addEventListener("input", onChange);
js_color2.addEventListener("input", onChange);
js_file_input.addEventListener("change", onFileChange);

//CALLBACK ON_FIlE_CHANGE
function onFileChange(e) {
  let fileReader = new FileReader();

  fileReader.onload = function () {
    let img = new Image();
    img.src = fileReader.result;
    img.onload = function () {
      let height = img.height;
      let width = img.width;
      let aspect = width / height;
      js_canvas.height = 1000;
      js_canvas.width = 1000 * aspect;
      js_ctx.drawImage(img, 0, 0, 1000 * aspect, 1000);
      let pixels = js_ctx.getImageData(0, 0, js_canvas.width, js_canvas.height);
      worker.postMessage({ type: "convert to greyscale", pixels: pixels });
    };
  };

  fileReader.readAsDataURL(e.target.files[0]);
}

// CALLBACK  ON_COLOR_CHANGE
function onChange() {
  worker.postMessage({
    type: "create duotone",
    color1: js_color1.value,
    color2: js_color2.value,
    pixels: greyArray,
  });
}

// WORKER ONMESSAGE FUNCTION
worker.onmessage = function (e) {
  switch (e.data.type) {
    case "converted to greyscale":
      greyArray = e.data.greyPixels;
      worker.postMessage({
        type: "create duotone",
        color1: js_color1.value,
        color2: js_color2.value,
        pixels: e.data.greyPixels,
      });
      break;
    case "created duotone":
      js_ctx.putImageData(e.data.pixels, 0, 0);
      break;
  }
};
