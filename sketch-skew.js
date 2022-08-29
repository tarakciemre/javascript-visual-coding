const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1000, 1000 ],
};

const sketch = ({ context, width, height }) => {
  // is executed once
  let x, y, w, h, fill, stroke;

  const num = 800;
  const degrees = 30;

  const rects = [];

  for(let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(100, 300);
    h = random.range(40, 200);

    fill = `rgba(0, 0, ${random.range(0, 256)})`;
    stroke = 'white';

    rects.push({x, y, w, h, fill, stroke});
  }


  // render function
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    rects.forEach(rect => {
      const {x, y, w, h, fill, stroke} = rect;

      context.save();
      context.translate(x, y);
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      
      drawSkewedRect({context, w, h, degrees});

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

    context.stroke();
    context.fill();

    context.restore();
}

canvasSketch(sketch, settings);
