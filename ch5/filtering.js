// Receives an object with x and y properties, 
// returns the sum
const sum_xy = (e) => {
    return e.x + e.y;
}

// If the element is even, result is true
const even = (e) => {
    return Math.round(e) % 2 === 0;
}


const t = [{x: 4, y:11}, {x: 9, y: -2}, {x: -5, y: 7}, {x: 1, y: 7}]

const sums = t.map(sum_xy);
// [ 15, 7, 2, 8 ]
console.log(sums);

const even_sums = sums.filter(even);
// [ 2, 8 ]
console.log(even_sums)
