const morseCodes = [
    ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..",
    ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.",
    "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."
];

function hasMorseCode(str) {
    for (let code of morseCodes) {
        if (str.includes(code)) {
            return true;
        }
    }
    return false;
}