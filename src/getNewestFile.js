// getNewestFile.js

const fs = require('fs');
const path = require('path');

/**
 * Returns the newest modified file in the specified folder
 * @param {string} folderPath - The path to the folder to scan
 * @returns {string | null} - The path to the newest file, or null if no files are found
 */
function getNewestFile(folderPath) {
    const files = fs.readdirSync(folderPath);

    if (files.length === 0) {
        console.log("No files found in the directory.");
        return null;
    }

    let newestFile = null;
    let newestTime = -Infinity;

    files.forEach(file => {
        const filePath = path.join(folderPath, file);
        const fileStats = fs.statSync(filePath);

        if (fileStats.isFile() && fileStats.mtimeMs > newestTime) {
            newestTime = fileStats.mtimeMs;
            newestFile = filePath;
        }
    });

    return newestFile;
}

module.exports = getNewestFile;
