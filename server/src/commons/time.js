 function convertTime(timeData) {
    const time = new Date(timeData).getTime() + 60 * 1000 * 60 * 7

    return new Date(time)
}
module.exports = {
    convertTime
}