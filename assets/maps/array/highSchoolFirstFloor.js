const FIRST_FLOOR = [
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'FITT', 'FITT', 'FITT', 'FITT', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL' ],
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'FITT', 'FITT', 'FITT', 'FITT', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'MCAF', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL' ],
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'MCAF', 'MCAF', 'PATH', 'MCAF', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL' ],
    [ 'STAI', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'WALL', 'MCAF', 'MCAF', 'PATH', 'MCAF', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL' ],
    [ 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'MCAF', 'MCAF', 'PATH', 'MCAF', 'WALL', 'WALL', 'STAI', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL' ],
    [ 'H107', 'H107', 'PATH', 'PATH', 'WALL', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL' ],
    [ 'H107', 'H107', 'WALL', 'PATH', 'WALL', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'STAI' ],
    [ 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'PATH', 'STAI' ],
    [ 'H108', 'H108', 'PATH', 'PATH', 'WALL', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'OUTD' ],
    [ 'H108', 'H108', 'WALL', 'WALL', 'WALL', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL' ],
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'COMM', 'WALL', 'BAND', 'BAND', 'BAND', 'BAND', 'BAND', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'PATH', 'H105', 'H105' ],
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'COMM', 'WALL', 'BAND', 'BAND', 'BAND', 'BAND', 'BAND', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'H105', 'H105' ], 
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'HGYM', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'COMM', 'WALL', 'BAND', 'BAND', 'BAND', 'BAND', 'BAND', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL' ],
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'COMM', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'PATH', 'H104', 'H104' ],
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'COMM', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'H104', 'H104' ],
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'COMM', 'WALL', 'LGI ', 'LGI ', 'LGI ', 'LGI ', 'PATH', 'PATH', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL' ],
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'STAI', 'WALL', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'COMM', 'WALL', 'LGI ', 'LGI ', 'LGI ', 'LGI ', 'WALL', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'H103', 'H103' ],
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'STAI', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'COMM', 'WALL', 'LGI ', 'LGI ', 'LGI ', 'LGI ', 'WALL', 'H100', 'WALL', 'H101', 'WALL', 'PATH', 'WALL', 'H103', 'H103' ],
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'COMM', 'WALL', 'LGI ', 'LGI ', 'LGI ', 'LGI ', 'WALL', 'H100', 'WALL', 'H101', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL' ],
    [ 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'WALL', 'WALL', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'WALL', 'WC  ', 'PATH', 'COMM', 'WALL', 'LGI ', 'LGI ', 'LGI ', 'LGI ', 'WALL', 'H100', 'WALL', 'H101', 'WALL', 'PATH', 'WALL', 'H102', 'H102' ],
    [ 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'WALL', 'WALL', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'WALL', 'WC  ', 'PATH', 'COMM', 'WALL', 'LGI ', 'LGI ', 'LGI ', 'LGI ', 'WALL', 'H100', 'WALL', 'H101', 'WALL', 'PATH', 'WALL', 'H102', 'H102' ],
    [ 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'WALL', 'WALL', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'PATH', 'WALL', 'PATH', 'WALL', 'PATH', 'WALL', 'PATH', 'WALL', 'PATH', 'WALL' ],  
    [ 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'WALL', 'WALL', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'WALL', 'WALL', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'STAI' ],
    [ 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'WALL', 'WALL', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'PATH', 'WALL' ],
    [ 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'WALL', 'WALL', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'WALL', 'WALL', 'PATH', 'STAI', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'PATH', 'WALL' ], 
    [ 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'MGYM', 'WALL', 'WALL', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'LIBR', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'PATH', 'WALL' ],
    [ 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'NURS', 'NURS', 'NURS', 'WALL', 'AUDI', 'AUDI', 'AUDI', 'AUDI', 'AUDI', 'AUDI', 'WALL', 'STAG', 'STAG' ],
    [ 'PATH', 'PATH', 'PATH', 'PATH', 'WALL', 'M100', 'M100', 'M100', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'AUDI', 'AUDI', 'AUDI', 'AUDI', 'AUDI', 'AUDI', 'WALL', 'STAG', 'STAG' ],
    [ 'WALL', 'WALL', 'WALL', 'PATH', 'WALL', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'AUDI', 'AUDI', 'AUDI', 'AUDI', 'AUDI', 'AUDI', 'WALL', 'STAG', 'STAG' ],
    [ 'M101', 'M101', 'WALL', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'PATH', 'WALL', 'WALL', 'WALL', 'PATH', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL' ],
    [ 'M101', 'M101', 'PATH', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'PATH', 'PATH', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL' ],
    [ 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'OUTD', 'OUTD', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL', 'WALL' ]
];

const ROOMS = [
    "Stair1","MarketPlace","FITT",
    "H107","H108","Stair3",
    "M101","M100","Library",
    "Nurse","Auditorium","Stair5",
    "WC","Stair6","HGYM",
    "MGYM","Cafeteria","BandRoom",
    "H105","H104","H103",
    "H101","H100","LGI",
    "H102","Stair4","Faculty",
    "Stair2","MCAF","Entrance",
    "PORT"
];

module.exports.ROOMS = ROOMS;
module.exports.MAP = FIRST_FLOOR;