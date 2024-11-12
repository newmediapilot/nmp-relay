// tweetImage.js

const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const axios = require('axios');

/**
 * Posts a tweet with text and an image
 * @param {string} tweetText - The text of the tweet
 * @param {string} imageUrl - The URL of the image to upload
 * @param {string} secretPath - Path to .json file with Twitter API credentials
 * @returns {Promise<void>}
 */
async function tweetImage(tweetText, imageUrl, secretPath) {
    try {
        // Load Twitter API credentials from the secret JSON file
        const credentials = JSON.parse(fs.readFileSync(secretPath, 'utf-8'));
        const { appKey, appSecret, accessToken, accessSecret } = credentials;

        // Initialize Twitter API client
        const client = new TwitterApi({
            appKey,
            appSecret,
            accessToken,
            accessSecret,
        });

        // Download the image from the provided URL
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        // Upload the image to Twitter
        const mediaId = await client.v1.uploadMedia(imageBuffer, { type: 'image/jpeg' });

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
