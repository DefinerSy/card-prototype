const fs = require('fs');
const path = require('path');
const { WaveFile } = require('wavefile');

const SAMPLE_RATE = 44100;
const DIR = path.join(__dirname, '../public/assets/audio');

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true });
}

// 辅助函数：生成并保存 WAV 文件
function saveWav(filename, samples) {
  const wav = new WaveFile();
  // 1 channel, 44100 sample rate, 16-bit
  wav.fromScratch(1, SAMPLE_RATE, '16', samples);
  fs.writeFileSync(path.join(DIR, filename), wav.toBuffer());
  console.log(`Generated: ${filename}`);
}

// 辅助函数：生成白噪声
function generateNoise(durationSec) {
  const length = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Int16Array(length);
  for (let i = 0; i < length; i++) {
    samples[i] = (Math.random() * 2 - 1) * 32767;
  }
  return samples;
}

// 辅助函数：应用简单的包络 (Attack, Decay, Sustain, Release)
function applyEnvelope(samples, attackSec, decaySec, sustainLevel, releaseSec) {
  const attackSamples = Math.floor(attackSec * SAMPLE_RATE);
  const decaySamples = Math.floor(decaySec * SAMPLE_RATE);
  const releaseSamples = Math.floor(releaseSec * SAMPLE_RATE);
  const totalSamples = samples.length;
  
  for (let i = 0; i < totalSamples; i++) {
    let env = 0;
    if (i < attackSamples) {
      env = i / attackSamples; // Linear attack
    } else if (i < attackSamples + decaySamples) {
      const p = (i - attackSamples) / decaySamples;
      env = 1.0 - p * (1.0 - sustainLevel); // Linear decay to sustain
    } else if (i < totalSamples - releaseSamples) {
      env = sustainLevel; // Sustain
    } else {
      const p = (i - (totalSamples - releaseSamples)) / releaseSamples;
      env = sustainLevel * (1.0 - p); // Linear release
    }
    samples[i] = Math.floor(samples[i] * env);
  }
  return samples;
}

// 辅助函数：生成正弦波/方波/锯齿波
function generateOscillator(durationSec, freqStart, freqEnd, type = 'sine') {
  const length = Math.floor(SAMPLE_RATE * durationSec);
  const samples = new Int16Array(length);
  let phase = 0;
  
  for (let i = 0; i < length; i++) {
    const t = i / length;
    // 指数频率滑动
    const freq = freqStart * Math.pow(freqEnd / freqStart, t);
    const phaseIncrement = (freq * 2 * Math.PI) / SAMPLE_RATE;
    phase += phaseIncrement;
    
    let val = 0;
    if (type === 'sine') val = Math.sin(phase);
    else if (type === 'square') val = Math.sin(phase) > 0 ? 1 : -1;
    else if (type === 'sawtooth') val = 2 * (phase / (2 * Math.PI) - Math.floor(phase / (2 * Math.PI) + 0.5));
    
    samples[i] = Math.floor(val * 16000); // 留点余量避免爆音
  }
  return samples;
}

// 1. sfx-click.wav (短促的点击声，类似纸张轻敲)
function generateClick() {
  let samples = generateNoise(0.05);
  samples = applyEnvelope(samples, 0.005, 0.02, 0, 0.025);
  saveWav('sfx-click.wav', samples);
}

// 2. sfx-card-hover.wav (极短的摩擦声)
function generateHover() {
  let samples = generateNoise(0.08);
  // 应用低通滤波效果 (简单平均)
  for(let i=1; i<samples.length; i++) samples[i] = (samples[i] + samples[i-1]) * 0.5;
  samples = applyEnvelope(samples, 0.02, 0.04, 0, 0.02);
  saveWav('sfx-card-hover.wav', samples);
}

// 3. sfx-card-play.wav (打牌声，类似纸张拍在桌面上)
function generateCardPlay() {
  let samples = generateNoise(0.15);
  // 增加一点低频冲击
  const thump = generateOscillator(0.15, 100, 20, 'sine');
  for(let i=0; i<samples.length; i++) samples[i] = (samples[i] * 0.5 + thump[i] * 0.5);
  samples = applyEnvelope(samples, 0.01, 0.05, 0.2, 0.09);
  saveWav('sfx-card-play.wav', samples);
}

// 4. sfx-slash.wav (挥剑声，快速的白噪声扫过)
function generateSlash() {
  let samples = generateNoise(0.3);
  samples = applyEnvelope(samples, 0.05, 0.1, 0.5, 0.15);
  saveWav('sfx-slash.wav', samples);
}

// 5. sfx-charge.wav (充能声，频率上升的波)
function generateCharge() {
  let samples = generateOscillator(0.6, 100, 600, 'sawtooth');
  samples = applyEnvelope(samples, 0.2, 0.2, 0.8, 0.2);
  saveWav('sfx-charge.wav', samples);
}

// 6. sfx-magic.wav (施法声，高频正弦波)
function generateMagic() {
  let samples = generateOscillator(0.5, 800, 1200, 'sine');
  // 加上一点颤音 (AM)
  for(let i=0; i<samples.length; i++) {
    const lfo = Math.sin((i / SAMPLE_RATE) * 15 * 2 * Math.PI);
    samples[i] = samples[i] * (0.6 + 0.4 * lfo);
  }
  samples = applyEnvelope(samples, 0.1, 0.1, 0.5, 0.3);
  saveWav('sfx-magic.wav', samples);
}

// 7. sfx-hit.wav (受击声，低频方波加噪音)
function generateHit() {
  const noise = generateNoise(0.2);
  const square = generateOscillator(0.2, 150, 40, 'square');
  const samples = new Int16Array(noise.length);
  for(let i=0; i<samples.length; i++) {
    samples[i] = (noise[i] * 0.7 + square[i] * 0.8);
  }
  saveWav('sfx-hit.wav', applyEnvelope(samples, 0.01, 0.1, 0.2, 0.09));
}

// 8. sfx-win.wav (胜利，简单的琶音上升)
function generateWin() {
  const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
  const noteDuration = 0.15;
  const length = Math.floor(SAMPLE_RATE * noteDuration * notes.length);
  const samples = new Int16Array(length);
  
  for(let n=0; n<notes.length; n++) {
    const osc = generateOscillator(noteDuration, notes[n], notes[n], 'square');
    const envOsc = applyEnvelope(osc, 0.02, 0.05, 0.5, 0.08);
    const offset = Math.floor(n * noteDuration * SAMPLE_RATE);
    for(let i=0; i<envOsc.length; i++) {
      samples[offset + i] = envOsc[i] * 0.5;
    }
  }
  saveWav('sfx-win.wav', samples);
}

// 9. sfx-lose.wav (失败，频率下降)
function generateLose() {
  let samples = generateOscillator(1.0, 300, 50, 'sawtooth');
  samples = applyEnvelope(samples, 0.1, 0.4, 0.5, 0.5);
  saveWav('sfx-lose.wav', samples);
}

// 10. bgm-lobby.wav (大厅背景音，低沉的嗡嗡声循环)
function generateLobbyBGM() {
  const duration = 4.0;
  const length = Math.floor(SAMPLE_RATE * duration);
  const samples = new Int16Array(length);
  
  for(let i=0; i<length; i++) {
    const t = i / SAMPLE_RATE;
    // 两个低频正弦波叠加产生缓慢的拍频
    const val1 = Math.sin(t * 50 * 2 * Math.PI);
    const val2 = Math.sin(t * 51 * 2 * Math.PI);
    // 加上一点极低频的噪音模拟风声
    const noise = (Math.random() * 2 - 1) * 0.1;
    samples[i] = Math.floor((val1 * 0.4 + val2 * 0.4 + noise) * 10000);
  }
  // 为了无缝循环，淡入淡出首尾
  applyEnvelope(samples, 0.5, 0, 1.0, 0.5);
  saveWav('bgm-lobby.wav', samples);
}

// 11. bgm-battle.wav (战斗背景音，有节奏的低音鼓点)
function generateBattleBGM() {
  const bpm = 120;
  const beatDuration = 60 / bpm;
  const measures = 2; // 2小节
  const duration = beatDuration * 4 * measures; 
  const length = Math.floor(SAMPLE_RATE * duration);
  const samples = new Int16Array(length);
  
  for(let m=0; m<measures * 4; m++) {
    // 每拍一个低音鼓 (Kick)
    const kick = generateOscillator(0.2, 120, 30, 'sine');
    const envKick = applyEnvelope(kick, 0.01, 0.1, 0, 0.09);
    
    const offset = Math.floor(m * beatDuration * SAMPLE_RATE);
    for(let i=0; i<envKick.length; i++) {
      if (offset + i < length) {
        samples[offset + i] += envKick[i];
      }
    }
    
    // 在反拍加一个闭镲 (Hi-hat)
    if (m % 2 !== 0) {
      const hat = generateNoise(0.05);
      const envHat = applyEnvelope(hat, 0.005, 0.02, 0, 0.025);
      const hatOffset = Math.floor((m * beatDuration + beatDuration/2) * SAMPLE_RATE);
      for(let i=0; i<envHat.length; i++) {
        if (hatOffset + i < length) {
           samples[hatOffset + i] += envHat[i] * 0.3;
        }
      }
    }
  }
  saveWav('bgm-battle.wav', samples);
}

// 执行生成
console.log('Generating synthesized audio files...');
generateClick();
generateHover();
generateCardPlay();
generateSlash();
generateCharge();
generateMagic();
generateHit();
generateWin();
generateLose();
generateLobbyBGM();
generateBattleBGM();
console.log('Done!');
