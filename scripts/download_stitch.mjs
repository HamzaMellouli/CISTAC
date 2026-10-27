import fs from 'fs';
import path from 'path';

const API_KEY = process.env.STITCH_API_KEY || '';
const PROJECT_ID = '8638452789122956738';

const BASE_DIR = path.resolve('stitch_designs');
const PUBLIC_MASCOT_DIR = path.resolve('frontend/public/mascot');
const SRC_MASCOT_DIR = path.resolve('frontend/src/assets/mascot');

[
  BASE_DIR,
  path.join(BASE_DIR, 'code'),
  path.join(BASE_DIR, 'screenshots'),
  path.join(BASE_DIR, 'mascot'),
  path.join(BASE_DIR, 'svgs'),
  path.join(BASE_DIR, 'docs'),
  PUBLIC_MASCOT_DIR,
  SRC_MASCOT_DIR
].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Load screens from list_screens json
const screensJsonPath = 'C:/Users/Smida/.gemini/antigravity-ide/brain/12754f9c-43db-44ad-90e9-883b84a9b595/.system_generated/steps/12/output.txt';
const { screens } = JSON.parse(fs.readFileSync(screensJsonPath, 'utf8'));

console.log(`Found ${screens.length} screens/items to download.`);

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': API_KEY
      }
    });
    if (!res.ok) {
      console.error(`Failed to download ${url}: HTTP ${res.status}`);
      return false;
    }
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    console.log(`Saved: ${destPath} (${buffer.byteLength} bytes)`);
    return true;
  } catch (err) {
    console.error(`Error downloading ${url}:`, err);
    return false;
  }
}

async function run() {
  for (const s of screens) {
    const screenId = s.name.split('/').pop();
    const title = s.title || screenId;
    console.log(`\nProcessing [${screenId}] ${title}...`);

    // Download screenshot if available
    if (s.screenshot && s.screenshot.downloadUrl) {
      const ext = s.screenshot.mimeType === 'image/jpeg' ? '.jpg' : '.png';
      
      // Determine destination
      let dest;
      if (title.toLowerCase().includes('mascot') || title.toLowerCase().includes('axolotl') || title.toLowerCase().includes('brian')) {
        let slug = 'brian-mascot';
        if (title.toLowerCase().includes('celebrat') || title.toLowerCase().includes('jumping')) slug = 'brian-celebrating';
        else if (title.toLowerCase().includes('waving') || title.toLowerCase().includes('friendly')) slug = 'brian-waving';
        else if (title.toLowerCase().includes('glasses') || title.toLowerCase().includes('pointer') || title.toLowerCase().includes('mentor')) slug = 'brian-mentor';
        else if (title.toLowerCase().includes('sleepy') || title.toLowerCase().includes('cozy') || title.toLowerCase().includes('nightcap')) slug = 'brian-sleepy';
        else if (title.toLowerCase().includes('explorer') || title.toLowerCase().includes('magnifying') || title.toLowerCase().includes('compass')) slug = 'brian-explorer';
        else if (title.toLowerCase().includes('component sheet')) slug = 'brian-component-sheet';
        else if (title.toLowerCase().includes('concept-a-symbol')) slug = 'concept-a-symbol';
        else if (title.toLowerCase().includes('concept-a-lockup')) slug = 'concept-a-lockup';
        else if (title.toLowerCase().includes('brian-concepts')) slug = 'brian-concepts';

        dest = path.join(BASE_DIR, 'mascot', `${slug}${ext}`);
        await downloadFile(s.screenshot.downloadUrl, dest);
        
        // Also copy to public/mascot and src/assets/mascot
        fs.copyFileSync(dest, path.join(PUBLIC_MASCOT_DIR, `${slug}${ext}`));
        fs.copyFileSync(dest, path.join(SRC_MASCOT_DIR, `${slug}${ext}`));
      } else {
        const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        dest = path.join(BASE_DIR, 'screenshots', `${safeTitle}-${screenId}${ext}`);
        await downloadFile(s.screenshot.downloadUrl, dest);
      }
    }

    // Download HTML/Code/SVG/MD if available
    if (s.htmlCode && s.htmlCode.downloadUrl) {
      let ext = '.html';
      let folder = 'code';
      if (s.htmlCode.mimeType === 'image/svg+xml' || title.endsWith('.svg')) {
        ext = '.svg';
        folder = 'svgs';
      } else if (s.htmlCode.mimeType === 'text/markdown' || title.endsWith('.md')) {
        ext = '.md';
        folder = 'docs';
      }

      const safeTitle = title.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/(^-|-$)/g, '');
      const dest = path.join(BASE_DIR, folder, `${safeTitle.replace(/\.(svg|md|html)$/, '')}-${screenId}${ext}`);
      await downloadFile(s.htmlCode.downloadUrl, dest);

      // If it's an SVG brand logo, also copy to branding
      if (ext === '.svg') {
        const brandDest = path.resolve(`frontend/src/assets/branding/${safeTitle}`);
        fs.copyFileSync(dest, brandDest);
        console.log(`Copied SVG to ${brandDest}`);
      }
    }
  }

  console.log('\nAll downloads complete!');
}

run();
