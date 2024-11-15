// getRandomFile.js

const fs = require('fs');
const path = require('path');

/**
 * Returns a random file from the specified folder
 * @param {string} folderPath - The path to the folder to scan
 * @returns {string | null} - The path to a random file, or null if no files are found
 */
function getRandomFile(folderPath) {
    const files = fs.readdirSync(folderPath).filter(file => {
        const filePath = path.join(folderPath, file);
        return fs.statSync(filePath).isFile(); // Only include files
    });

    if (files.length === 0) {
        console.log("No files found in the directory.");
        return null;
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    return path.join(folderPath, files[randomIndex]);
}

module.exports = getRandomFile;
