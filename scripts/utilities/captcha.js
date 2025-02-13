let captchaData = null;

/**
 * Generates a random alphanumeric string.
 * @param {number} length - Length of the captcha text.
 * @returns {string} Random captcha text.
 */
function generateRandomCaptcha(length) {
    const chars = "ABEFGHJKNOPQRSTUWYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Creates a canvas-based image captcha.
 * @returns {Object} An object with the captcha text and the image data URL.
 */
function generateCaptchaImage() {
    const text = generateRandomCaptcha(6);
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Some random noise lines
    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = "#ccc";
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
    }

    // Draw captcha text with slight rotation
    ctx.font = "30px Arial";
    ctx.fillStyle = "#000";
    ctx.textBaseline = "middle";
    const textWidth = ctx.measureText(text).width;
    const x = (canvas.width - textWidth) / 2;
    const y = canvas.height / 2;

    ctx.save();
    const angle = (Math.random() - 0.5) * 0.2; // small random rotation
    ctx.translate(x + textWidth / 2, y);
    ctx.rotate(angle);
    ctx.fillText(text, -textWidth / 2, 0);
    ctx.restore();

    const dataURL = canvas.toDataURL();
    captchaData = { text, dataURL };
    return captchaData;
}

/**
 * Refreshes the captcha by generating a new image.
 */
function refreshCaptcha() {
    generateCaptchaImage();
}
