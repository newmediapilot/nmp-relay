// downloadImages.js

const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

/**
 * Takes screenshots of images by visiting each URL, waiting, and capturing the image element
 * @param {Array<string>} urls - Array of image URLs
 * @returns {Promise<void>} - A promise that resolves when all images are saved as screenshots
 */
async function downloadImages(urls) {
    const imagesFolder = path.resolve('.images');

    // Ensure the .images folder exists
    if (!fs.existsSync(imagesFolder)) {
        fs.mkdirSync(imagesFolder);
    }

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    for (const url of urls) {
        try {
            console.log(`Processing: ${url}`);
            await page.goto(url, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(1000); // Wait for 1 second

            // Find the image element with the exact src matching the URL
            const imageElement = await page.$(`img[src="${url}"]`);

            if (imageElement) {
                // Derive the image name from the URL
                const imageName = path.basename(url);
                const imagePath = path.join(imagesFolder, imageName);

                // Take a screenshot of the image element
                await imageElement.screenshot({ path: imagePath });
                console.log(`Screenshot saved: ${imageName}`);
            } else {
                console.error(`No matching image element found on page for URL: ${url}`);
            }
        } catch (error) {
            console.error(`Failed to capture screenshot for ${url}:`, error);
        }
    }

    await browser.close();
}

module.exports = downloadImages;
