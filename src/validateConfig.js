// validateConfig.js

const axios = require('axios');
const fs = require('fs').promises;

/**
 * Loads the config file and returns its contents as a JavaScript object.
 * @returns {Promise<Object>} - The configuration object.
 */
async function loadConfig() {
    try {
        const data = await fs.readFile('config.json', 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error("Failed to load config.json: " + error.message);
    }
}

/**
 * Validates that each URL in the configuration returns a non-404 page.
 * @returns {Promise<Object>} - A promise with the validation results.
 */
async function validateConfig() {
    try {
        const config = await loadConfig();

        if (!config || !Array.isArray(config.urls)) {
            throw new Error("Invalid configuration: 'urls' must be an array.");
        }

        const results = await Promise.all(
            config.urls.map(async ({ url }) => {
                try {
                    const response = await axios.get(url);
                    if (response.status === 404) {
                        console.log(`❌ URL not found (404): ${url}`);
                        return { url, valid: false };
                    } else {
                        console.log(`✅ URL valid: ${url}`);
                        return { url, valid: true };
                    }
                } catch (error) {
                    console.log(`❌ Error accessing URL: ${url} - ${error.message}`);
                    return { url, valid: false };
                }
            })
        );

        const invalidUrls = results.filter(result => !result.valid);

        if (invalidUrls.length > 0) {
            console.log("\nValidation completed with errors:");
            invalidUrls.forEach(({ url }) => console.log(`❌ Invalid URL: ${url}`));
        } else {
            console.log("\nAll URLs validated successfully!");
        }

        return { success: invalidUrls.length === 0, invalidUrls };

    } catch (error) {
        console.error("Validation error:", error.message);
        return { success: false, error: error.message };
    }
}

module.exports = validateConfig;
