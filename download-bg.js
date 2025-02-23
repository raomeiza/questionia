const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const https = require('https');
const path = require('path');

// Provide your Pixabay API key here:
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;

// Arrays of colors and query words:
const COLORS = [
  "red","blue","green","yellow","purple","orange","brown","pink","black",
  "white","gray","cyan","magenta","lime","indigo"
];

const QUERY_WORDS = [
  "nature","health","technology","animals","architecture","art","beach",
  "business","city","clouds","education","fashion","food","forest","garden",
  "landscape","mountains","music","night","ocean","people","plants","science",
  "sky","space","sports","summer","travel","water","winter",
];

/**
 * Requests up to 'perPage' image results from Pixabay,
 * returning an array of objects with largeImageURL + previewURL.
 */
function fetchPixabayImages(color, query, perPage=50) {
  const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&colors=${encodeURIComponent(color)}&image_type=photo&per_page=${perPage}`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let raw = '';
      res.on('data', (chunk) => raw += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(raw);
          if (data.hits) {
            const results = data.hits.map(hit => ({
              large: hit.largeImageURL,
              preview: hit.previewURL
            }));
            resolve(results);
          } else {
            reject(new Error('No hits found in Pixabay response.'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => reject(err));
  });
}

/** Helper to download a single image via https and save to 'savePath'. */
function downloadImage(imageUrl, savePath, checkBeforeDownload=true) {
  if (checkBeforeDownload && fs.existsSync(savePath)) {
    console.log(`  Already downloaded: ${savePath}`);
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download '${imageUrl}' (${res.statusCode})`));
      }
      const fileStream = fs.createWriteStream(savePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(resolve));
      fileStream.on('error', (err) => reject(err));
    }).on('error', (err) => reject(err));
  });
}

/** Main driver: fetch images for each color/query and download both sizes. */
async function main() {
  for (const color of COLORS) {
    // Create a top-level folder for each color
    fs.mkdirSync(path.join(__dirname, "public", "bg", color), { recursive: true });
    // Also create a subfolder for placeholders (we'll nest queries under it)
    const placeholderRoot = `${path.join(__dirname, "public", "bg-placeholder")}`;
    fs.mkdirSync(placeholderRoot, { recursive: true });

    for (const query of QUERY_WORDS) {
      const subFolder = `${path.join(__dirname, "public", "bg", color)}/${query}`;
      fs.mkdirSync(subFolder, { recursive: true });
      const placeholderSubFolder = `${placeholderRoot}/${color}/${query}`;
      fs.mkdirSync(placeholderSubFolder, { recursive: true });

      console.log(`Fetching images for color="${color}", query="${query}"`);
      try {
        const imageList = await fetchPixabayImages(color, query, 50);
        console.log(`  Found ${imageList.length} images. Downloading...`);

        for (let i = 0; i < imageList.length; i++) {
          const { large, preview } = imageList[i];
          // Work out filenames and extensions
          const largeExt = large.split('.').pop().split('?')[0] || 'jpg';
          const previewExt = preview.split('.').pop().split('?')[0] || 'jpg';

          const largePath = `${subFolder}/${query}-${i}.${largeExt}`;
          const previewPath = `${placeholderSubFolder}/${query}-${i}.${previewExt}`;

          // Download the large image
          try {
            await downloadImage(large, largePath);
            console.log(`  Downloaded (large): ${largePath}`);
          } catch (err) {
            console.error(`  Error (large): ${err.message}`);
          }

          // Download the placeholder image
          try {
            await downloadImage(preview, previewPath);
            console.log(`  Downloaded (preview): ${previewPath}`);
          } catch (err) {
            console.error(`  Error (preview): ${err.message}`);
          }
        }
      } catch (err) {
        console.error(`  Error fetching for color="${color}", query="${query}": ${err.message}`);
      }
    }
  }
  console.log("All downloads complete.");
}

// Kick it off
main().catch(err => console.error("Script failed:", err));