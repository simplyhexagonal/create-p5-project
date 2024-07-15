import p5, {
  Renderer,
  Oscillator,
  FFT,
} from 'p5';
import 'p5/lib/addons/p5.sound';
import init, { p5SVG } from 'p5-svg';

const renderSvg = false;

renderSvg && init(p5);

// Based on:
// https://web.archive.org/web/20240318061546/https://p5js.org/examples/sound-frequency-modulation.html

let carrier: Oscillator; // this is the oscillator we will hear
let modulator: Oscillator; // this oscillator will modulate the frequency of the carrier

let analyzer: FFT; // we'll use this visualize the waveform
let waveform: any[];

// the carrier frequency pre-modulation
const carrierBaseFreq = 440;

// min/max ranges for modulator
const modMaxFreq = 55.320;
const modMinFreq = 44.240;
const modMaxDepth = 150;
const modMinDepth = -150;

const toggleAudio = (cnv: Renderer) => {
  cnv.mouseOver(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.touchStarted(function() {
    carrier.amp(1.0, 0.01);
  });
  cnv.mouseOut(function() {
    carrier.amp(0.0, 0.01);
  });
}

export const design = (p5: p5SVG) => {
  p5.setup = () => {
    const cnv = p5.createCanvas(800, 400, p5.SVG) as unknown as Renderer;

    p5.noFill();

    renderSvg && p5.noLoop();

    carrier = new Oscillator(carrierBaseFreq, 'sine');
    carrier.amp(0); // set amplitude
    carrier.start(); // start oscillating

    // try changing the type to 'square', 'sine' or 'triangle'
    modulator = new Oscillator(modMinFreq, 'sawtooth');
    modulator.start();

    // add the modulator's output to modulate the carrier's frequency
    modulator.disconnect();
    carrier.freq(modulator);

    // create an FFT to analyze the audio
    analyzer = new FFT();

    // fade carrier in/out on mouseover / touch start
    toggleAudio(cnv);
  };

  p5.draw = () => {
    p5.background(30);

    // map mouseY to modulator freq between a maximum and minimum frequency
    let modFreq = p5.constrain(
      p5.map(p5.mouseY, (p5.height/4) * 3, (p5.height/4), modMinFreq, modMaxFreq),
      modMinFreq, modMaxFreq
    );
    modulator.freq(modFreq);

    // change the amplitude of the modulator
    // negative amp reverses the sawtooth waveform, and sounds percussive
    //
    let modDepth = p5.map(p5.mouseX, 0, p5.width, modMinDepth, modMaxDepth);
    modulator.amp(modDepth);

    // analyze the waveform
    waveform = analyzer.waveform();

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
      const waveMult = 20 * waveform[0];

      p5.vertex(
        ((x > 135) ? (x + waveMult) : (x - waveMult)) + p5.width * 0.5 - 135,
        ((y > 135) ? (y + waveMult) : (y - waveMult)) + p5.height * 0.5 - 135,
      );
    });

    p5.endShape();

    // draw the shape of the waveform
    p5.stroke('#00ff00');
    p5.strokeWeight(5);
    p5.beginShape();
    for (let i = 0; i < waveform.length; i++) {
      let x = p5.map(i, 0, waveform.length, 0, p5.width);
      let y = p5.map(waveform[i], -1, 1, -p5.height / 6, p5.height / 6);
      p5.vertex(x, y + p5.height * 0.5);
    }
    p5.endShape();

    p5.stroke('#ffffff');
    p5.strokeWeight(1);
    // add a note about what's happening
    p5.text('Modulator Frequency: ' + modFreq.toFixed(3) + ' Hz', 20, 20);
    p5.text(
      'Modulator Amplitude (Modulation Depth): ' + modDepth.toFixed(3),
      20,
      40
    );
    p5.text(
      'Carrier Frequency (pre-modulation): ' + carrierBaseFreq + ' Hz',
      p5.width / 2,
      20
    );
  };
};
