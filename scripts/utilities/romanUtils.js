const romanToValue = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
};

function romanToInt(roman) {
    let total = 0;
    let prevValue = 0;
    for (let i = roman.length - 1; i >= 0; i--) {
        const current = romanToValue[roman[i]];
        if (!current) continue;
        if (current < prevValue) {
            total -= current;
        } else {
            total += current;
        }
        prevValue = current;
    }
    return total;
}

function multiplyRomanNumeralsInString(str) {
    // Matches sequences of Roman letters
    const romanRegex = /[IVXLCDM]+/g;
    const matches = str.match(romanRegex) || [];

    let product = 1;
    for (const match of matches) {
        product *= romanToInt(match.toUpperCase());
    }
    return product;
}
