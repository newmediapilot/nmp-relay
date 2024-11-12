// index.js
const fs = require('fs');
const processUrl = require('./src/processUrl');

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

// Function to run tasks sequentially for each URL in config with interval delay
async function runTasks(urls, interval) {
    for (const urlObj of urls) {
        try {
            await processUrl(urlObj);
            console.log("🎉 All tasks completed for this URL.");
        } catch (error) {
            console.error("❌ An error occurred while processing this URL:", error);
        }

        // Wait for the specified interval before processing the next URL
        if (urls.indexOf(urlObj) < urls.length - 1) {
            console.log(`⏳ Waiting for ${interval} milliseconds before processing the next URL...`);
            await new Promise(resolve => setTimeout(resolve, interval));
        }
    }
}

// Main execution
(async () => {
    if (!config.urls || !Array.isArray(config.urls)) {
        console.error("❌ Error: Config file must contain an array of URLs under 'urls'.");
        process.exit(1);
    }

    console.log("🚀 Starting the process with the provided config file...");
    await runTasks(config.urls, interval);
    console.log("✅ All URLs processed successfully.");
})();
