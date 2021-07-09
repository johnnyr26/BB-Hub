const x = 'X';
const f = 'FITT';
const m = 'Middle School Cafeteria';
const b = 'BandRoom';
const y = 'LGI';
const l = 'Library';
const c = 'classroom';
const n = 'nurse';
const a = 'auditorium';
const t = 'stage';
const o = 'outdoors';
const w = 'commons';
const h = 'High School Gym';
const g = 'Middle School Gym';

const FIRST_FLOOR = 
[ x, x, x, x, x, x, f, f, f, f, f, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x ],
[ x, x, x, x, x, _, f, f, f, f, f, _, _, m, m, m, m, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x ],
[ x, x, x, x, x, _, f, f, f, f, f, _, x, m, m, m, m, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x ],
[ _, _, _, _, _, _,_,_,_,_,_,_, _, _, x, m, m, m, m, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x ],
[ x, x, x, _, x, x, x, x, x, x, _, x, x, m, m, m, m, x, x, s, x, x, x, x, x, x, x, x, x, x, x, x, x ],
[ c, c, c, _, x, h, h, h, h, h, _, x, x, x, x, _, _, _, _, _, x, x, x, x, x, x, x, x, x, x, x, x, x ],
[ c, c, x, _, x, h, h, h, h, h, x, x, x, x, x, _, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x ],
[ x, x, x, _, x, h, h, h, h, h, x, x, x, x, x, _, x, x, x, x, x, x, x, x, x, x, x, x, x, x, _, s, s ],
[ c, c, _, _, x, h, h, h, h, h, x, x, x, x, x, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, o ]
[ c, c, x, x, x, h, h, h, h, h, x, x, x, x, x, x, x, _, x, x, x, x, x, _, x, x, x, x, x, _, x, x, x ],
[ x, x, x, x, x, h, h, h, h, h, x, x, x, x, x, x, x, _, w, x, b, b, b, b, b, x, x, x, x, _, _, c, c ],
[ x, x, x, x, x, h, h, h, h, h, x, x, x, x, x ,x, x, _, w, x, b, b, b, b, b, x, x, x, x, _, x, c, c ], 
[ x, x, x, x, x, h, h, h, h, h, x, x, x, x, x, x, x, _, w, x, b, b, b, b, b, x, x, x, x, _, x, x, x ],
[ x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, _, w, x, x, x, x, x, _, x, x, x, x, _, _, c, c ],
[ x, x, x, x, _, _, _, _, _, _, _, _, _, _, _, _, _, _, w, x, y, y, y, y, _, _, x, x, x, _, x, x, x ],
[ x, x, x, x, x, x, x, x, s, s, x, _, _, _, _, _, _, _, w, x, y, y, y, y, x, _, _, _, _, _, _, c, c ],
[ x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, _, w, x, y, y, y, y, x, c, x, c, x, _, x, x, x ],
[ g, g, g, g, g, g, x, x, l, l, l, l, l, l, l, x, x, _, w, x, y, y, y, y, x, c, x, c, x, _, x, c, c ],
[ g, g, g, g, g, g, x, x, l, l, l, l, l, l, l, x, c, _, x, x, x, x, x, _, x, _, x, _, x, _, x, _, x ],  
[ g, g, g, g, g, g, x, x, l, l, l, l, l, l, l, x, x, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, s ],
[ g, g, g, g, g, g, x, x, l, l, l, l, l, l, l, x, x, x, _, x, x, x, x, x, x, x, x, x, x, x, x, x, x ],
[ g, g, g, g, g, g, x, x, l, l, l, l, l, l, l, x, x, x, _, s, x, x, x, x, x, x, x, x, x, x, x, x, x ], 
[ g, g, g, g, g, g, x, x, l, l, l, l, l, l, l, l, l, x, _, x, x, x, x, x, x, x, x, x, x, _, x, x, x ],
[ x, x, x, _, x, x, x ,x, x, x, _, x, x, x, x, x, x, x, _, x, n, n, n, x, a, a, a, a, a, a, x, t, t ],
[ _, _, _, _, x, c, c, c, x, x, _, x, x, x, x, x, x, x, _, x, _, x, x, x, a, a, a, a, a, a, x, t, t ],
[ x, x, x, _, x, _, x, x, x, x, _, _, _, _, _, _, _, _, _, _, _, _, _, _, a, a, a, a, a, a, x, t, t ],
[ c, c, x, _, _, _, _, _, _, _, _, x, x, x, _, _, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x ],
[ c, c, _, _, x, x, x, x, x, x, x, x, x, x, _, _, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x ],
[ x, x, x, x, x, x, x, x, x, x, x, x, x, x, o, o, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x, x ];

