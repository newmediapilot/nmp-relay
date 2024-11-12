// index.js
const fetchHtml = require('./src/fetchHtml.js');
const extractImageUrls = require('./src/extractImageUrls.js');
const downloadImages = require('./src/downloadImages.js');
const getOldestFile = require('./src/getOldestFile.js');
const tweetImage = require('./src/tweetImage.js');

// Define the global shared object at the top
const sharedData = {
    url: "https://old.reddit.com/r/dankmemes/"
};

// Array of functions to run in sequence
const tasks = [
    async (data) => {
        const {url} = data;
        data.html = await fetchHtml(url);
        return Promise.resolve();
    },
    async (data) => {
        const {html} = data;
        data.urls = await extractImageUrls(html);
        return Promise.resolve();
    },
    async (data) => {
        const {urls} = data;
        return await downloadImages(urls);
    },
    async (data) => {
        const image = await getOldestFile("./.images");
        return Promise.resolve(); // await tweetImage("testing", image, "./.secret.json");
    }
];

// Function to run tasks sequentially
async function runTasks(tasks, data) {
    for (let task of tasks) {
        await task(data); // Inject shared data into each task
    }
}

// Main execution with error handling
(async () => {
    try {
        await runTasks(tasks, sharedData);
        console.log("All tasks completed successfully.");
    } catch (error) {
        console.error("An error occurred:", error);
    }
})();
