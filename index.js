// index.js
const fs = require('fs');
const processUrl = require('./src/processUrl');
const validateConfig = require('./src/validateConfig'); // Import the validateConfig function

// Process command-line arguments for the config file and interval
const args = process.argv.slice(2);
const configArg = args.find(arg => arg.startsWith('--config='));
const intervalArg = args.find(arg => arg.startsWith('--interval='));

if (!configArg) {
    console.error("❌ Error: Please specify a --config file.");
    process.exit(1);
}

const configPath = configArg.split('=')[1];
const interval = intervalArg ? parseInt(intervalArg.split('=')[1], 10) : 3600000; // Default interval: 1 hour (3600000 ms)

// Load config file
let config;
try {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
} catch (error) {
    console.error("❌ Error: Failed to load config file:", error);
    process.exit(1);
}

// Function to run tasks with a random URL selection at each interval
async function runTasks(urls, interval) {
    while (true) { // Infinite loop to continually run the tasks
        // Inline random selection of a URL object
        const urlObj = urls[Math.floor(Math.random() * urls.length)];

        try {
            await processUrl(urlObj);
            console.log("🎉 Task completed for the random URL:", urlObj.url);
        } catch (error) {
            console.error("❌ An error occurred while processing the URL:", urlObj.url, error);
        }

        console.log(`⏳ Waiting for ${interval} milliseconds before picking the next random URL...`);
        await new Promise(resolve => setTimeout(resolve, interval));
    }
}

// Main execution
(async () => {
    if (!config.urls || !Array.isArray(config.urls)) {
        console.error("❌ Error: Config file must contain an array of URLs under 'urls'.");
        process.exit(1);
    }

    console.log("🚀 Validating URLs in the provided config file...");

    // Run validateConfig and proceed only if all URLs are valid
    const validationResult = await validateConfig(config);

    if (!validationResult.success) {
        console.error("❌ Validation failed. Please fix the following invalid URLs:");
        validationResult.invalidUrls.forEach(({ url }) => console.error(`❌ Invalid URL: ${url}`));
        process.exit(1); // Exit if validation fails
    }

    console.log("✅ All URLs validated successfully. Starting tasks...");

    // Run the tasks with random URL selection at each interval
    await runTasks(config.urls, interval);
})();
