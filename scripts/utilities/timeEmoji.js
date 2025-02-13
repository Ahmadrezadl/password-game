function timeToEmoji() {
    const hourToEmoji = {
        0: "🕛", 1: "🕐", 2: "🕑", 3: "🕒", 4: "🕓", 5: "🕔",
        6: "🕕", 7: "🕖", 8: "🕗", 9: "🕘", 10: "🕙", 11: "🕚"
    };

    const now = new Date();
    let hour = now.getHours();
    if (hour > 11) {
        hour -= 12;
    }
    return hourToEmoji[hour];
}