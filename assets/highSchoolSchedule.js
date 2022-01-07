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
            from: "09:50",
            to: "10:28"
        },
        {
            block: 2,
            from: "10:33",
            to: "11:11"
        },
        {
            block: 3,
            from: "11:16",
            to: "11:54"
        },
        {
            block: "LUNCH",
            from: "11:57",
            to: "12:33"
        },
        {
            block: 4,
            from: "12:36",
            to: "13:14"
        },
        {
            block: 5,
            from: "13:19",
            to: "13:57"
        },
        {
            block: 6,
            from: "14:02",
            to: "14:40"
        }
    ]
};

module.exports.SCHEDULE_STRUCTURE = SCHEDULE_STRUCTURE;
module.exports.HIGH_SCHOOL_SCHEDULE = HIGH_SCHOOL_SCHEDULE;