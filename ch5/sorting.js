// Assumes a and be are numbers
const regular = (a, b) => {
    if (a === b) return 0;
    else if (a < b ) return -1;
    else if (a > b) return 1;
}

// Assumes a and be are objects with 
// an x & y property, and sorts by their
// sum
const object_compare = (a, b) => {
    const v1 = a.x + a.y;
    const v2 = b.x + b.y;
    if (v1 === v2) return 0;
    else if (v1 < v2 ) return -1;
    else if (v1 > v2) return 1;
}

// Assumes a and b are numbers, rounds to integers
// sorts them by even number first, then odd, 
// and by value for ties (both even, or both odd)
const even_odd = (a, b) => {
    const a_even = Math.round(a) % 2 === 0;
    const b_even = Math.round(b) % 2 === 0;
    if (a_even && !b_even) return -1
    else if (!a_even && b_even) return 1;
    else {
        if (a === b) return 0;
        else if (a < b ) return -1;
        else if (a > b) return 1;
    }
}

const t1 = [3.6, 9.5, 12.4, 3.1, 6.3];
const t2 = [{x: 4, y:11}, {x: 9, y: -2}, {x: -5, y: 7}, {x: 1}]
t1.sort(regular);
// 3.1, 3.6, 6.3, 9.5, 12.4
console.log(t1.join(", "));

t1.sort(even_odd);
// 3.6, 6.3, 9.5, 12.4, 3.1
console.log(t1.join(", "));

t2.sort(object_compare);
// [ { x: -5, y: 7 }, { x: 9, y: -2 }, { x: 4, y: 11 }, { x: 1 } ]
console.log(t2)

