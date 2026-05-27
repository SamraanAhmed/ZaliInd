const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const DIR = path.join(__dirname, 'public/SiteData');

const videosToProcess = [
  'DTF process Video.MOV',
  'embroidery Proceess Video.MOV',
  'Main page ground floor video.MOV',
  'Screen Print Process Video.MOV',
  'Sublimation Process Video.mp4',
  'DTF Heat Transfer Process.mp4'
];

async function processVideo(filename) {
  return new Promise((resolve, reject) => {
    const inPath = path.join(DIR, filename);
    const parsed = path.parse(filename);
    const outPath = path.join(DIR, parsed.name + '_opt.mp4');
    
    // Check if input exists
    if (!fs.existsSync(inPath)) {
      console.log(`Skipping ${filename}, does not exist`);
      return resolve();
    }
    
    console.log(`Converting ${filename}...`);
    
    ffmpeg(inPath)
      .outputOptions([
        '-c:v libx264',
        '-preset fast',
        '-crf 26',       // Good compression
        '-vf scale=-2:720', // Scale to 720p to load fast
        '-c:a aac',
        '-b:a 128k',
        '-movflags +faststart', // Crucial for iOS/Web playback
        '-pix_fmt yuv420p'      // Crucial for wide compatibility
      ])
      .toFormat('mp4')
      .on('end', () => {
        console.log(`Finished ${filename}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error converting ${filename}:`, err);
        resolve(); // Continue with next even if error
      })
      .save(outPath);
  });
}

async function main() {
  for (const v of videosToProcess) {
    await processVideo(v);
  }
  console.log('All videos processed.');
}

main();
