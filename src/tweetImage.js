// tweetImage.js

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Tweets an image with text using Twitter via Playwright
 * @param {string} tweetText - The text of the tweet
 * @param {string} imagePath - The file path to the image to upload
 * @param {string} secretPath - The file path to the .secret.json file with Twitter credentials
 * @returns {Promise<void>}
 */
async function tweetImage(tweetText, imagePath, secretPath) {
    return new Promise(async (resolve, reject) => {
        try {
            // Load credentials from .secret.json
            const credentials = JSON.parse(fs.readFileSync(secretPath, 'utf-8'));
            const { username, password } = credentials;

            const browser = await chromium.launch({ headless: false });
            const context = await browser.newContext();
            const page = await context.newPage();

            // Navigate to Twitter login page
            await page.goto('https://twitter.com/login');
            await page.waitForTimeout(2000); // Allow time for the page to load

            // Log in to Twitter
            await page.fill('input[name="text"]', username);
            await page.press('input[name="text"]', 'Enter');
            await page.waitForTimeout(2000); // Wait for password field to appear

            await page.fill('input[name="password"]', password);
            await page.click('div[data-testid="LoginForm_Login_Button"]');
            await page.waitForNavigation();

            // Navigate to tweet composer
            await page.goto('https://twitter.com/compose/tweet');
            await page.waitForTimeout(2000);

            // Type tweet text
            await page.fill('div[aria-label="Tweet text"]', tweetText);

            // Upload image
            const fileInput = await page.$('input[type="file"]');
            await fileInput.setInputFiles(imagePath); // Provide the path to your image file

            await page.waitForTimeout(2000); // Wait for the image to be uploaded

            // Post tweet
            await page.click('div[data-testid="tweetButtonInline"]');
            console.log('Tweet posted successfully!');

            await browser.close();
            resolve();

        } catch (error) {
            console.error('An error occurred:', error);
            reject(error);
        }
    });
}

module.exports = tweetImage;
