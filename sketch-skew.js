const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

const settings = {
  dimensions: [ 1000, 1000 ],
};

const sketch = ({ context, width, height }) => {
  // is executed once
  let x, y, w, h, fill, stroke;

  const num = 50;
  const degrees = 10;

  const rects = [];

  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
  ];

  const bgColor = random.pick(risoColors).hex;

  for(let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(100, 300);
    h = random.range(40, 200);

    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;

    rects.push({x, y, w, h, fill, stroke});
  }


  // render function
  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    rects.forEach(rect => {
      const {x, y, w, h, fill, stroke} = rect;
      let shadowColor;

      context.save();
      context.translate(x, y);
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 20;



      drawSkewedRect({context, w, h, degrees});

      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.2;
      
      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = 30;
      context.shadowOffsetY = -5;


      context.fill();
      context.shadowColor = null;
      context.stroke();
      

      context.restore();
    })
  };
};

const drawSkewedRect = ({context, w = 600, h = 200, degrees = 20}) => {
    const angle = math.degToRad(degrees);
    const rx = Math.cos(angle) * w;
    const ry = Math.sin(angle) * w;

    context.save();
    context.translate(rx * -0.5, (ry + h) * -0.5);

    context.beginPath();

    context.moveTo(0, 0);
    context.lineTo(rx, ry);
    context.lineTo(rx, ry + h);
    context.lineTo(0, h);
    context.closePath();
  
    context.restore();
}

canvasSketch(sketch, settings);
