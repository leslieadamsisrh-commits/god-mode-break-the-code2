export type CombatSound = "shell-insert" | "muzzle-click" | "shotgun-report" | "slam-stone" | "slam-metal" | "slam-fighter" | "jade-yelp" | "jade-cry";

const TAU = 2 * Math.PI;
const durations: Record<CombatSound, number> = {
 "shell-insert": .12, "muzzle-click": .07, "shotgun-report": .33, "slam-stone": .26, "slam-metal": .21,
 "slam-fighter": .14, "jade-yelp": .19, "jade-cry": .39,
};

export function renderCombatSound(kind: CombatSound, rate: number, variant: number) {
 const duration = durations[kind];
 const samples = new Float32Array(Math.ceil(duration * rate));
 let noiseState = 9137 + 2119 * variant;
 let bass = 0, previousNoise = 0, phase = 0;
 const heavy = kind === "jade-cry";

 for (let i = 0; i < samples.length; i++) {
  const t = i / rate;
  noiseState = (Math.imul(noiseState, 1664525) + 1013904223) >>> 0;
  const noise = noiseState / 2147483648 - 1;
  bass += (noise - bass) * (1 - Math.exp(-TAU * 520 / rate));
  const grit = noise - previousNoise * .66;
  previousNoise = noise;
  let value: number;

  if (kind === "shell-insert") {
   const latch=Math.max(0,t-.024);
   value=(grit*.32+Math.sin(TAU*740*t)*.50)*Math.exp(-t*91)+(t>.024?(bass*.46+Math.sin(TAU*380*latch)*.32)*Math.exp(-latch*66):0);
  } else if (kind === "muzzle-click") {
   value=(grit*.42+Math.sin(TAU*1180*t)*.37)*Math.exp(-t*117);
  } else if (kind === "shotgun-report") {
   const crack = (grit * .74 + bass * .42) * Math.exp(-t * 122);
   const thump = Math.sin(TAU * (102 * t - 121 * t * t)) * Math.exp(-t * 23) * .86;
   const tail = bass * (.4 * Math.exp(-t * 13) + (t > .058 ? .21 * Math.exp(-(t - .058) * 14) : 0));
   value = crack + thump + tail;
  } else if (kind === "slam-stone") {
   value = (bass * .8 + grit * .35) * Math.exp(-t * 58);
   // A few discrete fragments skip away after the first impact.
   for (let chip = 1; chip <= 3; chip++) {
    const age = t - (.03 * chip + .012 * chip * chip);
    if (age >= 0) value += (grit * .29 + Math.sin(TAU * (580 - chip * 96) * age) * .24) * Math.exp(-age * 83);
   }
  } else if (kind === "slam-metal") {
   value = grit * .63 * Math.exp(-t * 106) +
    (Math.sin(TAU * 780 * t) * .45 + Math.sin(TAU * 1467 * t) * .24 + Math.sin(TAU * 2212 * t) * .13) * Math.exp(-t * 29);
  } else if (kind === "slam-fighter") {
   value = grit * .3 * Math.exp(-t * 95) + (bass * .45 + Math.sin(TAU * (115 * t - 143 * t * t)) * .62) * Math.exp(-t * 42);
  } else {
   // Stylized open-vowel performance with pitch strain, breath and vowel movement.
   const progress = t / duration;
   const pitch = (heavy ? 318 : 372) + variant * 22 + (heavy ? 229 : 134) * Math.sin(Math.PI * progress) -
    125 * progress + 15 * Math.sin(TAU * 27 * t);
   phase += TAU * pitch / rate;
   const firstFormant = 630 + 260 * Math.sin(Math.PI * progress);
   const secondFormant = 1570 - 390 * progress;
   let vowel = 0;
   for (let harmonic = 1; harmonic <= 12; harmonic++) {
    const hz = harmonic * pitch;
    const weight = .6 * Math.exp(-(((hz - firstFormant) / 285) ** 2)) +
     .36 * Math.exp(-(((hz - secondFormant) / 330) ** 2)) +
     .20 * Math.exp(-(((hz - 2740) / 590) ** 2));
    vowel += Math.sin(phase * harmonic + harmonic * .21) * weight / Math.sqrt(harmonic);
   }
   const breath = (grit * .15 + bass * .25) * (1 + .5 * progress);
   const effort = Math.min(1, t / .026) * (1 - progress) ** .64 * (.86 + .14 * Math.sin(TAU * 33 * t));
   value = (vowel + breath) * effort;
  }
  const edge = Math.min(1, i / (rate * .001), (samples.length - 1 - i) / (rate * .017));
  samples[i] = Math.tanh(value * 1.4) * edge;
 }
 return samples;
}

const levels: Record<CombatSound, number> = {
 "shell-insert": .36, "muzzle-click": .31, "shotgun-report": .68, "slam-stone": .46, "slam-metal": .43,
 "slam-fighter": .30, "jade-yelp": .27, "jade-cry": .37,
};

export class CombatAudio {
 readonly input: GainNode;
 private readonly buffers = new Map<CombatSound, AudioBuffer[]>();
 private active = 0;
 private variation = 0;

 constructor(private readonly context: AudioContext) {
  this.input = context.createGain();
  const limiter = context.createDynamicsCompressor();
  limiter.threshold.value = -9;
  limiter.knee.value = 8;
  limiter.ratio.value = 8;
  limiter.attack.value = .002;
  limiter.release.value = .09;
  this.input.connect(limiter);
  limiter.connect(context.destination);
 }

 play(kind: string, pan: number) {
  if (!Object.prototype.hasOwnProperty.call(levels, kind)) return false;
  if (this.active >= (kind === "shotgun-report" ? 12 : 9)) return true;
  const sound = kind as CombatSound;
  let bank = this.buffers.get(sound);
  if (!bank) {
   bank = [];
   this.buffers.set(sound, bank);
  }
  const variant = this.variation++ % 3;
  const {context} = this;
  let buffer = bank[variant];
  if (!buffer) {
   const pcm = renderCombatSound(sound, context.sampleRate, variant);
   buffer = context.createBuffer(1, pcm.length, context.sampleRate);
   buffer.getChannelData(0).set(pcm);
   bank[variant] = buffer;
  }
  const source = context.createBufferSource();
  const gain = context.createGain();
  const stereo = context.createStereoPanner?.();
  this.active++;
  source.buffer = buffer;
  gain.gain.value = levels[sound];
  source.connect(gain);
  if (stereo) {
   stereo.pan.value = pan;
   gain.connect(stereo);
   stereo.connect(this.input);
  } else gain.connect(this.input);
  source.onended = () => {
   this.active--;
   source.disconnect();
   gain.disconnect();
   stereo?.disconnect();
  };
  source.start();
  return true;
 }
}
