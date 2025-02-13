function timeToEmoji(){
    const now = new Date();
    const hour = now.getHours();
    if(hour === 0 || hour === 12){
        return "🕛";
    }
    if(hour === 1 || hour === 13){
        return "🕐";
    }
    if(hour === 2 || hour === 14){
        return "🕑";
    }
    if(hour === 3 || hour === 15){
        return "🕒";
    }
    if(hour === 4 || hour === 16){
        return "🕓";
    }
    if(hour === 5 || hour === 17){
        return "🕔";
    }
    if(hour === 6 || hour === 18){
        return "🕕";
    }
    if(hour === 7 || hour === 19){
        return "🕖";
    }
    if(hour === 8 || hour === 20){
        return "🕗";
    }
    if(hour === 9 || hour === 21){
        return "🕘";
    }
    if(hour === 10 || hour === 22){
        return "🕙";
    }
    if(hour === 11 || hour === 23){
        return "🕚";
    }
}