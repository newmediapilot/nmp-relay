// src/countDown.js

function countDown(interval) {
    let remainingTime = interval;

    const countdownInterval = setInterval(() => {
        remainingTime -= 100;
        const percentComplete = Math.min(100, ((interval - remainingTime) / interval) * 100).toFixed(1);

        process.stdout.write(`\r⏳ Progress: ${percentComplete}% - Time left: ${remainingTime}ms `);

        if (remainingTime <= 0) {
            clearInterval(countdownInterval);
            process.stdout.write("\n🎉 Countdown complete!\n");
        }
    }, 100);
}

module.exports = countDown;
