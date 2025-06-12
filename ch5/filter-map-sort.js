const t = [{x: 4, y:11}, {x: 9, y: -2}, {x: -5, y: 7}, {x: 1, y: 7}]

t.forEach((o) => {
    o.sum = o.x + o.y;
    o.even_sum = (o.sum %2 === 0);
});

const results = t.sort((a, b) => {
    if (a.even_sum && !b.even_sum) return -1
    else if (!a.even_sum && b.even_sum) return 1;
    else {
        if (a.sum === b.sum) return 0;
        else if (a.sum < b.sum ) return -1;
        else return 1;
    }
    // Use the map again to trim out the 
    // extra properties we added with the forEach
}).map((o) => {return {x: o.x, y: o.y}});

//[ { x: -5, y: 7 }, { x: 1, y: 7 }, { x: 9, y: -2 }, { x: 4, y: 11 } ]
console.log(results);
