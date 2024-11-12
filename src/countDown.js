// src/countDown.js

function countDown(interval) {
    let remainingTime = interval;

    const countdownInterval = setInterval(() => {
        remainingTime -= 100;

        // Calculate the percentage complete
        const percentComplete = Math.min(100, ((interval - remainingTime) / interval) * 100).toFixed(1);

        // Calculate HH:MM:SS
        const hours = String(Math.floor(remainingTime / 3600000)).padStart(2, '0');
        const minutes = String(Math.floor((remainingTime % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((remainingTime % 60000) / 1000)).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}:${seconds}`;

        // Display countdown progress
        process.stdout.write(`\r⏳ Progress: ${percentComplete}% - Time left: ${remainingTime}ms || ${formattedTime} || Time until next tweet`);

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            process.stdout.write("\n🎉 Countdown complete!\n");
        }
    }, 100);
}

module.exports = countDown;
