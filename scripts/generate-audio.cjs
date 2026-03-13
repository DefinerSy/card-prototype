const fs = require('fs');
const path = require('path');

// A tiny valid 8kHz 8-bit mono WAV file containing silence
const silentWavBase64 = "UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
const wavBuffer = Buffer.from(silentWavBase64, 'base64');

const files = [
  'bgm-lobby.wav',
  'bgm-battle.wav',
  'sfx-click.wav',
  'sfx-card-hover.wav',
  'sfx-card-play.wav',
  'sfx-slash.wav',
  'sfx-charge.wav',
  'sfx-magic.wav',
  'sfx-hit.wav',
  'sfx-win.wav',
  'sfx-lose.wav'
];

const dir = path.join(__dirname, '../public/assets/audio');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

files.forEach(file => {
  fs.writeFileSync(path.join(dir, file), wavBuffer);
  console.log(`Created ${file}`);
});
