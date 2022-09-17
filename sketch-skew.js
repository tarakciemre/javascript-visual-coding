const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1000, 1000 ],
  animate: true,
  name: seed,
};

const sketch = ({ context, width, height }) => {
  // is executed once
  random.setSeed(seed);
  let x, y, w, h, fill, stroke;

  const num = 400;
  const degrees = 0;

  const rects = [];

  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
  ];

  const mask = {
    radius: width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.58,
  };

  bgColor = random.pick(risoColors).hex;
  bgColor = 'black';

  for(let i = 0; i < num; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(30, 70);
    h = random.range(10, 70);

    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;

    rects.push({x, y, w, h, fill, stroke});
  }


  // render function
  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mask.x, mask.y);

    drawPolygon({context, radius: mask.radius, sides: mask.sides});

    context.lineWidth = 0;
    context.strokeStyle = 'black';
    context.stroke();
    context.clip();


    rects.forEach(rect => {
      const {x, y, w, h, fill, stroke} = rect;
      let shadowColor;

      // outer colored line
      context.save();
      context.translate(-mask.x, -mask.y);
      context.translate(x, y);
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 4;



      drawSkewedRect({context, w, h, degrees});

      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.4;
      
      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = 30;
      context.shadowOffsetY = -5;


      context.fill();
      context.shadowColor = null;
      context.stroke();

      context.globalCompositeOperation = 'source-over';

      context.lineWidth = 8;
      context.strokeStyle = 'black';
      context.stroke();
      

      context.restore();
    });

    context.restore();

    context.save();
    context.translate(mask.x, mask.y)
    drawPolygon({context, radius: mask.radius, sides: mask.sides});

    context.globalCompositeOperation = 'color-burn'
    context.lineWidth = 20;
    context.strokeStyle = rectColors[0].hex;
    context.stroke();

    context.restore();
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

const drawPolygon = ({context, radius = 100, sides = 3}) => {
  const slice = Math.PI * 2 / sides;

  context.beginPath();
  context.moveTo(0, -radius);

  for(let i = 1; i < sides; i++)
  {
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }
  context.closePath();
}

canvasSketch(sketch, settings);
