let mod;

onmessage = async function (e) {
  switch (e.data.type) {
    case "register module":
      this.self.importScripts("../wasm/a.out.js");
      mod = await Module();
      break;
    case "convert to greyscale":
      let { pixels } = e.data;
      // console.log(pixels);
      let { greyscaleArray, greyscalePointer } = createGreyScale(pixels);
      this.postMessage({
        type: "converted to greyscale",
        greyscaleArray: greyscaleArray,
        greyscalePointer: greyscalePointer,
      });
      break;
    case "create duotone":
      let rgb1 = hexToRgb(e.data.color1);
      let rgb2 = hexToRgb(e.data.color2);
      let greyscaleArrayPointer = e.data.greyscalePointer;
      let length = e.data.length;

      let gradientPointer = mod._malloc(255 * 4);
      // allocating memory of gradient
      mod.HEAPU8.set(new Uint8ClampedArray(255 * 4), gradientPointer);
      //making gradient
      mod.ccall(
        "create_gradient",
        null,
        ["number", "number", "number", "number", "number", "number", "number"],
        [rgb1.r, rgb1.g, rgb1.b, rgb2.r, rgb2.g, rgb2.b, gradientPointer]
      );


      // let gradient = mod.HEAPU8.subarray(gradientPointer,gradientPointer+(255*4));
      // console.log(gradient);

      //making pointer of duotone array
      let duotoneArrayPointer = mod._malloc(length);
      //allocating dutone array memory
      mod.HEAPU8.set(new Uint8ClampedArray(length), duotoneArrayPointer);
      //making dutone image
      mod.ccall(
        "create_duotone",
        null,
        ["number", "number", "number", "number"],
        [greyscaleArrayPointer, gradientPointer, length, duotoneArrayPointer]
      );

      let newArr = mod.HEAPU8.subarray(
        duotoneArrayPointer,
        duotoneArrayPointer + length
      );

      newArr = new Uint8ClampedArray(newArr);
      
      this.postMessage({ type: "created duotone", pixels: newArr });

      mod._free(gradientPointer);
      mod._free(duotoneArrayPointer);
      break;
  }
};

function createGreyScale(pixels) {
  // console.log(pixels);
  greyscalePointer = mod._malloc(pixels.data.length);
  length = pixels.data.length;
  offsetLength = greyscalePointer + length;
  mod.HEAPU8.set(pixels.data, greyscalePointer);
  mod.ccall(
    "convert_to_greyscale",
    null,
    ["number", "number"],
    [greyscalePointer, length]
  );
  let newArr = mod.HEAPU8.subarray(greyscalePointer, offsetLength);
  let greyscaleArray = new Uint8ClampedArray(newArr);
  return { greyscaleArray: greyscaleArray, greyscalePointer: greyscalePointer };
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
