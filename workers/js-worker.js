onmessage = function (e) {
  switch (e.data.type) {
    case "convert to greyscale":
      let { pixels } = e.data;
      let pixelCount = pixels.data.length;
      convert_to_greyscale(pixels.data, pixelCount);
      this.postMessage({ type: "converted to greyscale", greyPixels: pixels });
      break;
    case "create duotone":
      let { color1, color2 } = e.data;
      let gradient = createGradient(color1, color2);
      let newPixels = createDuotone(e.data.pixels, gradient);
      this.postMessage({ type: "created duotone", pixels: newPixels });
      break;
  }
};

function convert_to_greyscale(pixels, pixelCount) {
  for (var i = 0, r, g, b, a, avg; i < pixelCount; i += 4) {
    // Gets every color and the alpha channel (r, g, b, a)
    r = pixels[i + 0];
    g = pixels[i + 1];
    b = pixels[i + 2];
    a = pixels[i + 3];

    // Gets the avg
    avg = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
    pixels[i + 0] = avg;
    pixels[i + 1] = avg;
    pixels[i + 2] = avg;
  }
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

function createGradient(color1, color2) {
  var rgb1 = hexToRgb(color1);
  var rgb2 = hexToRgb(color2);
  var gradient = [];
  for (var i = 0; i < 256 * 4; i += 4) {
    gradient[i] = ((256 - i / 4) * rgb1.r + (i / 4) * rgb2.r) / 256;
    gradient[i + 1] = ((256 - i / 4) * rgb1.g + (i / 4) * rgb2.g) / 256;
    gradient[i + 2] = ((256 - i / 4) * rgb1.b + (i / 4) * rgb2.b) / 256;
    gradient[i + 3] = 255;
  }
  return gradient;
}

function createDuotone(pixels, gradient) {
  var d = pixels.data;
  for (var i = 0; i < d.length; i += 4) {
    d[i] = gradient[d[i] * 4];
    d[i + 1] = gradient[d[i + 1] * 4 + 1];
    d[i + 2] = gradient[d[i + 2] * 4 + 2];
  }
  return pixels;
}
