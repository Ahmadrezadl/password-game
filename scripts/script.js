// DOM elements
const languageSelect = document.getElementById("languageSelect");
const gameTitle = document.getElementById("gameTitle");
const passwordInput = document.getElementById("passwordInput");
const rulesContainer = document.getElementById("rulesContainer");
const passwordRetypeInput = document.getElementById("passwordRetypeInput");
const retypeBtn = document.getElementById("retypeBtn");
const winMessage = document.getElementById("winMessage");
const alertMessage = document.getElementById("alertMessage");

// State
let currentLang = "en";
let totalRules = 0;
let finalPassword = "";
let currentPassword = "";
let maxUnlockedIndex = 0;
let statuses = [];

// Additional data
const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
    "farvardin", "ordibehesht", "khordad", "tir", "mordad", "shahrivar",
    "mehr", "aban", "azar", "dey", "bahman", "esfand"
];

const romanNumerals = [
    "I", "II", "III", "IV", "V", "VI",
    "VII", "VIII", "IX", "X", "XI", "XII"
];

const sponsors = {
    en: ["pepsi", "starbucks", "shell"],
    fa: ["tapsi", "myket", "baziness"]
};

// ------------------- Language & Rendering ------------------- //

function updateLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    gameTitle.textContent = t.gameTitle;
    passwordRetypeInput.placeholder = t.retypePlaceholder;
    retypeBtn.textContent = t.retypeBtn;
    winMessage.textContent = t.winMessage;
    alertMessage.textContent = t.alertMessage;

    totalRules = t.rules.length;

    if (!statuses.length) {
        statuses = new Array(totalRules).fill("failed");
        maxUnlockedIndex = 0;
    }

    // If new rules were added in the translations, expand the statuses array
    if (statuses.length < totalRules) {
        const oldLen = statuses.length;
        statuses.length = totalRules;
        for (let i = oldLen; i < totalRules; i++) {
            statuses[i] = "failed";
        }
    }

    reCheckAllRules();
    renderRules();
}

// Render the rules dynamically
function renderRules() {
    rulesContainer.innerHTML = "";
    const t = translations[currentLang];

    // We only render up to maxUnlockedIndex
    for (let i = maxUnlockedIndex; i >= 0; i--) {
        const ruleDiv = document.createElement("div");
        ruleDiv.classList.add("rule");

        // Passed or failed?
        let icon = "❌";
        let cssClass = "ruleFailed";
        if (statuses[i] === "passed") {
            icon = "✅";
            cssClass = "rulePassed";
        }
        ruleDiv.classList.add(cssClass);

        // Header
        const ruleHeader = document.createElement("div");
        ruleHeader.classList.add("ruleHeader");
        ruleHeader.textContent = `${icon} ${t.ruleWord} ${i + 1}`;

        // Body
        const ruleBody = document.createElement("div");
        ruleBody.classList.add("ruleBody");

        // The text from translations
        let ruleText = t.rules[i] || `Undefined rule #${i + 1}`;

        // If it's the captcha rule (index 9), we show the rule text + the image
        if (i === 9) {
            // Show text describing the captcha
            // e.g. "Your password must include the following captcha:"
            const description = document.createElement("p");
            description.textContent = ruleText;
            ruleBody.appendChild(description);

            // Then show the captcha image
            if (captchaData && captchaData.dataURL) {
                const img = document.createElement("img");
                img.src = captchaData.dataURL;
                img.alt = "Captcha";
                img.style.verticalAlign = "middle";
                ruleBody.appendChild(img);
            } else {
                ruleBody.appendChild(document.createTextNode("Captcha not loaded."));
            }
        } else {
            // Normal rules: just show the text
            ruleBody.textContent = ruleText;
        }

        ruleDiv.appendChild(ruleHeader);
        ruleDiv.appendChild(ruleBody);
        rulesContainer.appendChild(ruleDiv);
    }
}

// ------------------- Rule Checking ------------------- //

function reCheckAllRules() {
    for (let i = 0; i <= maxUnlockedIndex; i++) {
        const passes = checkRule(i, currentPassword);
        statuses[i] = passes ? "passed" : "failed";
    }

    // Try to unlock subsequent rules if the current one is passed
    while (
        maxUnlockedIndex < totalRules - 1 &&
        statuses[maxUnlockedIndex] === "passed"
        ) {
        maxUnlockedIndex++;
        statuses[maxUnlockedIndex] = checkRule(maxUnlockedIndex, currentPassword)
            ? "passed"
            : "failed";
    }
}

function checkRule(ruleIndex, password) {
    switch (ruleIndex) {
        case 0:
            return password.length >= 5;
        case 1:
            return /\d/.test(password);
        case 2:
            return /[A-Z]/.test(password);
        case 3:
            return /[!@#$%^&*(),.?":{}|<>]/.test(password);
        case 4:
            // sum of digits = 25
            const sumDigits = password
                .split('')
                .reduce((sum, c) => sum + (/\d/.test(c) ? parseInt(c) : 0), 0);
            return sumDigits === 25;
        case 5:
            // includes a month
            return months.some(month => password.toLowerCase().includes(month));
        case 6:
            // includes a Roman numeral (any of I..XII)
            return romanNumerals.some(rn => password.includes(rn));
        case 7:
            // includes sponsor
            return sponsors[currentLang].some(s => password.toLowerCase().includes(s));
        case 8:
            // The Roman numerals in your password should multiply to 35
            return multiplyRomanNumeralsInString(password) === 35;
        case 9:
            // Captcha rule
            return captchaData && password.includes(captchaData.text);
        default:
            return true;
    }
}

// ------------------- Event Listeners ------------------- //

passwordInput.addEventListener("input", () => {
    currentPassword = passwordInput.value;
    reCheckAllRules();
    renderRules();

    // If the last rule is passed, show the retype input
    if (statuses[totalRules - 1] === "passed") {
        finalPassword = currentPassword;
        passwordInput.style.display = "none";
        passwordRetypeInput.style.display = "block";
        retypeBtn.style.display = "inline-block";
    } else {
        passwordRetypeInput.style.display = "none";
        retypeBtn.style.display = "none";
        alertMessage.style.display = "none";
    }
});

retypeBtn.addEventListener("click", () => {
    if (passwordRetypeInput.value === finalPassword) {
        passwordRetypeInput.style.display = "none";
        retypeBtn.style.display = "none";
        alertMessage.style.display = "none";
        winMessage.style.display = "block";
    } else {
        alertMessage.style.display = "block";
    }
});

languageSelect.addEventListener("change", (e) => {
    updateLanguage(e.target.value);
});

// ------------------- Initialization ------------------- //

updateLanguage("en");      // default language
refreshCaptcha();          // create an initial captcha
