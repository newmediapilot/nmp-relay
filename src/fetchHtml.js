// fetchHtml.js

const { chromium } = require('@playwright/test');

/**
 * Fetches HTML content from a URL using Playwright
 * @param {string} url - The URL to fetch HTML from
 * @returns {Promise<string>} - A promise that resolves to the HTML content as a string
 */
async function fetchHtml(url) {
    const browser = await chromium.launch({ headless: false }); // Opens browser in non-headless mode
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const html = await page.content(); // Gets the full HTML of the page
        return html;
    } catch (error) {
        throw new Error(`Failed to fetch page content: ${error.message}`);
    } finally {
        await browser.close();
    }
}

// Check if the script is run directly
if (require.main === module) {
    const url = process.argv[2];

    if (!url) {
        console.error("Please provide a URL.");
        process.exit(1);
    }

    fetchHtml(url)
        .then((html) => {
            console.log(html);
        })
        .catch((error) => {
            console.error("An error occurred:", error);
        });
}

module.exports = fetchHtml;