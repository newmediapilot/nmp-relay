// getOldestFile.js

const fs = require('fs');
const path = require('path');

/**
 * Returns the oldest modified file in the specified folder
 * @param {string} folderPath - The path to the folder to scan
 * @returns {string | null} - The path to the oldest file, or null if no files are found
 */
function getOldestFile(folderPath) {
    const files = fs.readdirSync(folderPath);

    if (files.length === 0) {
        console.log("No files found in the directory.");
        return null;
    }

    let oldestFile = null;
    let oldestTime = Infinity;

    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const fileStats = fs.statSync(filePath);

        if (fileStats.isFile() && fileStats.mtimeMs < oldestTime) {
            oldestTime = fileStats.mtimeMs;
            oldestFile = filePath;
        }
    });

    return oldestFile;
}

module.exports = getOldestFile;
