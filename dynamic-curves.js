const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let elCanvas;
let points;

const sketch = ({ canvas }) => {
  points = [
    new Point({ x: 200, y: 540}),
    new Point({ x: 880, y: 540}),
    new Point({ x: 400, y: 300}),
    new Point({ x: 800, y: 700}),
    new Point({ x: 640, y: 700}),
  ];

  const curve = new QuadraticCurve({start: points[0], end: points[1], control: points[2]});

  canvas.addEventListener('mousedown', onMouseDown);
  elCanvas = canvas;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    curve.draw(context);

    points.forEach( point => {
      point.draw(context);
    })
  };
};

const onMouseDown = (e) => {
  console.log("mouse is pressed");
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeigth) * elCanvas.height;
  
  points.forEach(point => {
    point.isDragging = point.hitTest(x, y);
  })
};

const onMouseMove = (e) => {
  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;
  
  points.forEach(point => {
    if( point.isDragging) {
      point.x = x;
      point.y = y;
    }
  });

  console.log(x + " " + y);
  
};

const onMouseUp = (e) => {
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('mousemove', onMouseMove);
};

canvasSketch(sketch, settings);

class Point {
  constructor({ x, y, control = false })
  {
    this.x = x;
    this.y = y;
    this.control = control;
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control? 'red' : 'black';

    context.beginPath();
    context.arc( 0, 0, 10, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  hitTest(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dd = Math.sqrt(dx * dx, dy * dy);

    return dd < 20;
  }
}

class QuadraticCurve {
  constructor({start, end, control})
  {
    this.start = start;
    this.end = end;
    this.control = control;
  }

  draw(context) {
    context.save();

    context.beginPath();
    context.moveTo(this.start.x, this.start.y);
    context.quadraticCurveTo(this.control.x, this.control.y, this.end.x, this.end.y);
    context.stroke();

    context.restore();
  }

}
