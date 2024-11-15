// src/processUrl.js

const fetchHtml = require('./fetchHtml');
const extractImageUrls = require('./extractImageUrls');
const downloadImages = require('./downloadImages');
const getRandomFile = require('./getRandomFile');
const tweetImage = require('./tweetImage');

/**
 * Processes a single URL and associated tweet by fetching HTML, downloading images, and tweeting the newest image.
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

    console.log("🖼️ Finding the newest downloaded image for tweeting...");
    const newestFile = await getRandomFile("./.images");
    console.log("🐦 Posting the tweet with the newest image...");
    await tweetImage(tweet, newestFile, "./.secret.json");
    console.log("✅ Tweet posted successfully!");
}

module.exports = processUrl;
