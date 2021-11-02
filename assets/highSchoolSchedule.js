const SCHEDULE_STRUCTURE = {
    A: [1, 2, 3, 4, 5, 6],
    B: [3, 4, 5, 6, 7, 8],
    C: [5, 6, 7, 8, 1, 2],
    D: [7, 8, 1, 2, 3, 4],
    E: [3, 4, 5, 6, 7, 8],
    F: [1, 2, 3, 4, 5, 6],
    G: [7, 8, 1, 2, 3, 4],
    H: [5, 6, 7, 8, 1, 2]
}

const HIGH_SCHOOL_SCHEDULE = {
    schedule: SCHEDULE_STRUCTURE,
    times:[
        {
            block: 1,
            from: "07:50",
            to: "08:43"
        },
        {
            block: 2,
            from: "08:48",
            to: "09:41"
        },
        {
            block: 3,
            from: "09:46",
            to: "10:39"
        },
        {
            block: "LUNCH",
            from: "10:42",
            to: "11:28"
        },
        {
            block: 4,
            from: "11:31",
            to: "12:24"
        },
        {
            block: 5,
            from: "12:29",
            to: "13:22"
        },
        {
            block: 6,
            from: "13:27",
            to: "14:20"
        }
    ]
};

module.exports.SCHEDULE_STRUCTURE = SCHEDULE_STRUCTURE;
module.exports.HIGH_SCHOOL_SCHEDULE = HIGH_SCHOOL_SCHEDULE;