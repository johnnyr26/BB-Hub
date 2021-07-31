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
            to: "08:40"
        },
        {
            block: 2,
            from: "08:45",
            to: "09:35"
        },
        {
            block: 3,
            from: "09:40",
            to: "10:30"
        },
        {
            block: "LUNCH",
            from: "10:30",
            to: "11:30"
        },
        {
            block: 4,
            from: "11:35",
            to: "12:25"
        },
        {
            block: 5,
            from: "12:30",
            to: "13:20"
        },
        {
            block: 6,
            from: "13:25",
            to: "14:20"
        }
    ]
};

module.exports.SCHEDULE_STRUCTURE = SCHEDULE_STRUCTURE;
module.exports.HIGH_SCHOOL_SCHEDULE = HIGH_SCHOOL_SCHEDULE;