// src/processUrl.js

const fetchHtml = require('./fetchHtml');
const extractImageUrls = require('./extractImageUrls');
const downloadImages = require('./downloadImages');
const getNewestFile = require('./getNewestFile');
const tweetImage = require('./tweetImage');

/**
 * Processes a single URL and associated tweet by fetching HTML, downloading images, and tweeting the oldest image.
 * @param {Object} urlObj - Object containing `url` and `tweet` properties
 * @returns {Promise<void>}
 */
async function processUrl(urlObj) {
    const { url, tweet } = urlObj;

    console.log("🌐 Fetching HTML from URL:", url);
    const html = await fetchHtml(url);
    console.log("✅ Successfully fetched HTML.");

    console.log("🔍 Extracting image URLs from HTML content...");
    const imageUrls = await extractImageUrls(html);
    console.log(`📸 Found ${imageUrls.length} image URLs.`);

    console.log("💾 Downloading images from extracted URLs...");
    await downloadImages(imageUrls);
    console.log("📥 Image download complete.");

    console.log("🖼️ Finding the oldest downloaded image for tweeting...");
    const oldestFile = await getNewestFile("./.images");
    console.log("🐦 Posting the tweet with the oldest image...");
    await tweetImage(tweet, oldestFile, "./.secret.json");
    console.log("✅ Tweet posted successfully!");
}

module.exports = processUrl;
