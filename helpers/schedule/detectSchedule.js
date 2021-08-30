const letterDayRegex = /([A-H],?)*[A-H]$/;

module.exports = importDataString => {
    let classDelimiter;
    let cellDelimiter;
    if (importDataString.includes("\t")) {
        classDelimiter = "\n";
        cellDelimiter = "\t";
    } else {
        throw new Error('Unable to detect delimiter. Please copy and paste again.');
    }
    const classes = importDataString.split(classDelimiter)
        .map(aClass => aClass.split(cellDelimiter).map(val => val.trim()));
    if (classes.some(attributes => attributes[0] && attributes[0].match(letterDayRegex))) {
        return true;
    } else if (classes.some(attributes => attributes[2] && attributes[2].match(letterDayRegex))) {
        return true;
    } else {
        throw new Error('Unable to detect schedule type. Please copy and paste again.');
    }
}