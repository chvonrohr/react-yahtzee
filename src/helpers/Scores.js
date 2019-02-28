
/**
 * Finds a number with a given occurance (min/max)
 *
 * @param {array} numbers Array with numer
 * @param {int} min Min nr. of occurrence
 * @param {int} max Max nr. of occurrence
 * @return {object} object first number and occurance that matches min-max occurance boundary e.g. { nr: 3, n: 4 }
 */
function findNrTimes(numbers, min, max = 5) {
    const group = numbers.reduce((a,c) => {
        a[c] = a[c] ? a[c]+1 : 1;
        return a;
    }, {});

    for (let nr in group) {
        if (group[nr] >= min && group[nr] <= max) {
            return { nr, n: group[nr] };
        }
    }

    return null;
}

/**
 * sum up all numbers
 *
 * @param {array} numbers Array of numbers
 * @return {int}
 */
function numbersSum(numbers) {
    return numbers.reduce((a,c) => a+c, 0);
}

/**
 * find max sequence of numbers
 *
 * @param {array} numbers
 * @return {int}
 */
export function maxStraight(numbers) {
    let max = 1;
    let n = 1;
    numbers = [...new Set(numbers)]; // unique
    numbers.sort();
    for (let i=1; i < numbers.length; i++) {
        if ((numbers[i-1]+1) === numbers[i]) {
            n++;
            max = Math.max(max, n);
        } else {
            n = 1;
        }
    }
    return max;
}

function chanceForNumber(number, numbers, remainingThrows) {
  const count = numbers.filter(nr => number===nr).length;
  let chance = (count / 5);
  // chance = chance===1 ? chance : (chance * (remainingThrows+1) / 3);
  chance = chance>0 ? 1 : (5*remainingThrows/3)
  return chance;
}

// function chanceForSame(numbers, remainingThrows) {
//   const
// }


export default [

    // ones - sixes
    {
        name: 'ones',
        title: 'Einer',
        score: numbers => numbers.reduce((a,c) => a+(c===1 ? c : 0), 0),
        chance: (numbers, remainingThrows) => chanceForNumber(1, numbers, remainingThrows)
    },
    {
        name: 'twos',
        title: 'Zweier',
        score: numbers => numbers.reduce((a,c) => a+(c===2 ? c : 0), 0),
        chance: (numbers, remainingThrows) => chanceForNumber(2, numbers, remainingThrows)
    },
    {
        name: 'threes',
        title: 'Dreier',
        score: numbers => numbers.reduce((a,c) => a+(c===3 ? c : 0), 0),
        chance: (numbers, remainingThrows) => chanceForNumber(3, numbers, remainingThrows)
    },
    {
        name: 'fours',
        title: 'Vierer',
        score: numbers => numbers.reduce((a,c) => a+(c===4 ? c : 0), 0),
        chance: (numbers, remainingThrows) => chanceForNumber(4, numbers, remainingThrows)
    },
    {
        name: 'fives',
        title: 'Fünfer',
        score: numbers => numbers.reduce((a,c) => a+(c===5 ? c : 0), 0),
        chance: (numbers, remainingThrows) => chanceForNumber(5, numbers, remainingThrows)
    },
    {
        name: 'sixes',
        title: 'Sechser',
        score: numbers => numbers.reduce((a,c) => a+(c===6 ? c : 0), 0),
        chance: (numbers, remainingThrows) => chanceForNumber(6, numbers, remainingThrows)
    },

    // same of a kind: 3/4 of a kind, full house, yahtzee
    {
        name: 'threeofakind',
        title: 'Drei Gleiche',
        score: numbers => findNrTimes(numbers, 3) ? numbersSum(numbers) : 0
    },
    {
        name: 'fourofakind',
        title: 'Vier Gleiche',
        score: numbers => findNrTimes(numbers, 4) ? numbersSum(numbers) : 0
    },
    {
        name: 'yahtzee',
        title: 'YAHTZEE',
        score: numbers => findNrTimes(numbers, 5) ? 50 : 0
    },
    {
        name: 'fullhouse',
        title: 'Full house',
        score: numbers => {
            let twos = findNrTimes(numbers, 2, 2);
            let threes = findNrTimes(numbers, 3, 3);
            return (twos && threes) ? 25 : 0;
        }
    },

    // Straights
    {
        name: 'smallstraight',
        title: 'Kleine Strasse',
        score: numbers => (maxStraight(numbers)>=4) ? 30 : 0
    },
    {
        name: 'largestraight',
        title: 'Grosse Strasse',
        score: numbers => (maxStraight(numbers)>=5) ? 40 : 0
    },

    // chance
    {
        name: 'chance',
        title: 'Chance',
        score: numbers => numbersSum(numbers)
    },
];
