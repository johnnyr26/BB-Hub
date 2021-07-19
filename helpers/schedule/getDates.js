module.exports = () => {
    const date = new Date();

    let startYear;
    let endYear;

    if (date.getFullYear() >= 0 && date.getFullYear() < 7) {
        startYear = date.getFullYear() - 1;
    } else {
        startYear = date.getFullYear();
    }
    endYear = startYear + 1;
    return { startYear, endYear };
}