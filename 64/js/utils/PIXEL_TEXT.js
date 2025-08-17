const PIXEL_TEXT = {};
PIXEL_TEXT.textCanvas = (
  text,
  width = 64,
  rowHeight = 5,
  colors = {
    0: "#000000",
    1: "#FFFFFF",
    2: "#CCCCCC",
  },
  kerning = 1,
  rowKerning = 1,
) => {
  const canvasWidth = PIXEL_TEXT.measureWidth(text, kerning);
  let canvasHeight = rowHeight + rowKerning + rowKerning;
  // console.log("canvasWidth:", canvasWidth);
  const rowArr = [];
  const charArr = text.split("");
  let str = "";
  for (let i = 0; i < charArr.length; i++) {
    const char = charArr[i];
    str += char;
    const w = PIXEL_TEXT.measureWidth(str, kerning);
    if (w > width) {
      rowArr.push(str.slice(0, -1));
      str = char;
    }
  }
  if (str) rowArr.push(str);
  // console.log("rowArr:", rowArr);
  if (rowArr.length > 1) {
    const rowCanvasArr = rowArr.map((row) => {
      return PIXEL_TEXT.textCanvas(
        row,
        width,
        rowHeight,
        colors,
        kerning,
        rowKerning,
      );
    });
    canvasHeight = rowCanvasArr.length * (rowHeight + rowKerning) + rowKerning;
    // console.log("canvasHeight:", canvasHeight);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = canvasHeight; // Assuming a fixed height for simplicity
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = colors["0"];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    rowCanvasArr.forEach((rowCanvas, i) => {
      ctx.drawImage(rowCanvas, 0, i * (rowHeight + rowKerning));
    });
    return canvas;
  } else {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = canvasHeight; // Assuming a fixed height for simplicity
    // console.log("canvasHeight:", canvasHeight);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = colors["0"];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let xo = kerning;
    rowArr[0].split("").forEach((char, index) => {
      const glyph = getGlyph(char);
      if (glyph) {
        const glyphStrArr = glyph.data.split("");
        ctx.fillStyle = colors[glyphStrArr[0]];
        for (let i = 0; i < glyphStrArr.length; i++) {
          const colorIndex = glyphStrArr[i];
          if (colorIndex !== "0") {
            ctx.fillStyle = colors[colorIndex];
            const x = xo;
            const y = Math.floor(i / glyph.w);
            const pixelX = x + (i % glyph.w);
            ctx.fillRect(pixelX, y, 1, 1);
          }
        }
        xo += glyph.w + kerning;
      }
    });
    return canvas;
  }
};
PIXEL_TEXT.measureWidth = (text, kerning = 1) => {
  let width =
    text.split("").reduce((acc, char) => {
      const glyph = getGlyph(char);
      return acc + (glyph ? kerning + glyph.w : 0);
    }, 0) + kerning;
  return width;
};
function getGlyph(char) {
  return PIXEL_FONT.data[char] || PIXEL_FONT.data["?"];
}
