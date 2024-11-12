// tweetImage.js

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

/**
 * Tweets an image with text using Twitter SSO via Google and Playwright
 * @param {string} tweetText - The text of the tweet
 * @param {string} imagePath - The file path to the image to upload
 * @param {string} secretPath - The file path to the .secret.json file with Google credentials
 * @returns {Promise<void>}
 */
async function tweetImage(tweetText, imagePath, secretPath) {
    return new Promise(async (resolve, reject) => {
        try {
            // Load Google credentials from .secret.json
            const credentials = JSON.parse(fs.readFileSync(secretPath, 'utf-8'));
            const { googleUsername, googlePassword } = credentials;

            const browser = await chromium.launch({ headless: false });
            const context = await browser.newContext();
            const page = await context.newPage();

            // Navigate to Twitter login page
            await page.goto('https://twitter.com/login');
            await page.waitForTimeout(2000); // Allow time for the page to load

            // Click on the "Log in with Google" button
            await page.click('text="Sign in with Google"');

            // Switch to the Google login popup
            const [googlePopup] = await Promise.all([
                context.waitForEvent('page'), // Wait for the new page to open
                page.click('text="Sign in with Google"'), // Click the Google SSO button
            ]);

            // Google login steps in the new popup
            await googlePopup.fill('input[type="email"]', googleUsername);
            await googlePopup.click('#identifierNext'); // Click "Next" after entering email
            await googlePopup.waitForTimeout(2000); // Wait for password field to appear

            await googlePopup.fill('input[type="password"]', googlePassword);
            await googlePopup.click('#passwordNext'); // Click "Next" after entering password

            await googlePopup.waitForNavigation(); // Wait for Google login to complete

            // Go back to the main Twitter page
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
