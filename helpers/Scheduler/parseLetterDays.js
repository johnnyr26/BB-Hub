module.exports =  letterDays => {
    return letterDays.split(',').map(letter => letter.trim());
}