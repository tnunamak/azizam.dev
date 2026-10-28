// Writes waveform peaks for the home page audio chips from the clips in public/media.
// Run after changing a clip: node scripts/audio-peaks.mjs
// Needs ffmpeg on PATH. Output: src/data/audio-peaks.json (committed, so the build needs no ffmpeg).
import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const run = promisify(execFile);
const BARS = 48;
const RATE = 8000;
const clips = ['use-speech.mp3', 'use-music.mp3'];
const out = {};

for (const clip of clips) {
  const file = new URL(`../public/media/${clip}`, import.meta.url).pathname;
  const { stdout } = await run('ffmpeg', ['-v', 'error', '-i', file, '-ac', '1', '-ar', String(RATE), '-f', 's16le', '-'], { encoding: 'buffer', maxBuffer: 256 * 1024 * 1024 });
  const samples = new Int16Array(stdout.buffer, stdout.byteOffset, Math.floor(stdout.byteLength / 2));
  const per = Math.ceil(samples.length / BARS);
  const peaks = [];
  for (let i = 0; i < BARS; i++) {
    let max = 0;
    for (let j = i * per; j < Math.min(samples.length, (i + 1) * per); j++) max = Math.max(max, Math.abs(samples[j]));
    peaks.push(Number((max / 32768).toFixed(3)));
  }
  const top = Math.max(...peaks) || 1;
  out[clip] = {
    duration: Number((samples.length / RATE).toFixed(2)),
    peaks: peaks.map((p) => Number((p / top).toFixed(3))),
  };
}

await writeFile(new URL('../src/data/audio-peaks.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log('wrote', Object.keys(out).map((k) => `${k} (${out[k].duration}s)`).join(', '));
