import p5, {
  Renderer,
} from 'p5';
import init, { p5SVG } from 'p5-svg';

const renderSvg = false;

renderSvg && init(p5);

const mousePos = new p5.Vector(0, 0);

export const design = (p5: p5SVG) => {
  p5.setup = () => {
    const cnv = p5.createCanvas(800, 400, p5.SVG) as unknown as Renderer;

    p5.noFill();

    renderSvg && p5.noLoop();

    cnv.mouseMoved(
      () => {
        mousePos.x = Math.round(p5.mouseX);
        mousePos.y = Math.round(p5.mouseY);
      }
    );
  };

  p5.draw = () => {
    p5.background(30);

    p5.stroke('#ed225d');
    p5.beginShape();

    [
      [169.09,  102.59],
      [254.42,  76.83],
      [271.18,  128.39],
      [186.2,   157.38],
      [238.95,  232.18],
      [194.48,  264.43],
      [138.95,  190.95],
      [84.87,   262.5],
      [41.69,   229.61],
      [94.44,   157.38],
      [8.8,     126.47],
      [25.58,   74.87],
      [111.56,  102.58],
      [111.56,  13.64],
      [169.1,   13.64],
      [169.09,  102.59]
    ].forEach(([x, y]) => {
      p5.vertex(x, y);
    });

    p5.endShape();

    p5.stroke(255);
    p5.text(`${mousePos.x}, ${mousePos.y}`, 10, 20);
    p5.circle(mousePos.x, mousePos.y, 100);
  };
};
