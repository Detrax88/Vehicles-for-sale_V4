// drive_method és gearbox IntegerField → itt adj nekik jelentést
export const HAJTAS = { 0: "Elsőkerék-hajtás", 1: "Hátsókerék-hajtás", 2: "Összkerék-hajtás" };
export const VALTO = { 0: "Manuális", 1: "Automata" };

export const ft = (n) => new Intl.NumberFormat("hu-HU").format(n);
export const year = (d) => (d ? new Date(d).getFullYear() : null);
export const datum = (d) => (d ? new Date(d).toLocaleDateString("hu-HU") : "–");
