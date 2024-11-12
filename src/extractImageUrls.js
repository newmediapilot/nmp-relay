// extractImageUrls.js

const _ = require('lodash');

/**
 * Extracts unique URLs that match the pattern "https://i.redd.it/*.jpeg" from HTML content
 * @param {string} html - The HTML content as a string
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of unique matched URLs
 */
function extractImageUrls(html) {
    return new Promise((resolve) => {
        const urlPattern = /https:\/\/i\.redd\.it\/[a-zA-Z0-9_-]+\.jpeg/g;
        const matchedUrls = html.match(urlPattern) || [];
        const uniqueUrls = _.uniq(matchedUrls); // Use lodash to remove duplicates
        resolve(uniqueUrls);
    });
}

module.exports = extractImageUrls;
