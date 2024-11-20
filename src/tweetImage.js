// tweetImage.js

const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

/**
 * Posts a tweet with text and a local image file
 * @param {string} tweetText - The text of the tweet
 * @param {string} imagePath - The local file path to the image to upload
 * @param {string} secretPath - Path to .json file with Twitter API credentials
 * @returns {Promise<void>}
 */
async function tweetImage(tweetText, imagePath, secretPath) {
    try {
        // Load Twitter API credentials from the secret JSON file
        const credentials = JSON.parse(fs.readFileSync(secretPath, 'utf-8'));
        const { appKey, appSecret, accessToken, accessTokenSecret } = credentials;

        // Initialize Twitter API client
        const client = new TwitterApi({
            appKey,
            appSecret,
            accessToken,
            accessSecret: accessTokenSecret,
        });

        // Read the image file as a buffer
        const imageBuffer = fs.readFileSync(path.resolve(imagePath));

        // Determine the MIME type of the image (defaults to jpeg if unknown)
        const mimeType = 'image/jpeg';

        // Upload the image to Twitter
        const mediaId = await client.v1.uploadMedia(imageBuffer, { mimeType });

        // Post the tweet with the uploaded image
        const tweet = await client.v2.tweet({
            text: tweetText,
            media: { media_ids: [mediaId] },
        });

        console.log('Tweet posted:', tweet);
    } catch (error) {
        console.error('Error posting tweet:', error);
    }
}

module.exports = tweetImage;
