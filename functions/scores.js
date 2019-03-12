/**
 * Scores Helper function
 */
class Scores {

  constructor() {
    this.scores = [
      // ones - sixes
      {
        name: "ones",
        score: numbers => numbers.reduce((a, c) => a + (c === 1 ? c : 0), 0)
      },
      {
        name: "twos",
        score: numbers => numbers.reduce((a, c) => a + (c === 2 ? c : 0), 0)
      },
      {
        name: "threes",
        score: numbers => numbers.reduce((a, c) => a + (c === 3 ? c : 0), 0)
      },
      {
        name: "fours",
        score: numbers => numbers.reduce((a, c) => a + (c === 4 ? c : 0), 0)
      },
      {
        name: "fives",
        score: numbers => numbers.reduce((a, c) => a + (c === 5 ? c : 0), 0)
      },
      {
        name: "sixes",
        score: numbers => numbers.reduce((a, c) => a + (c === 6 ? c : 0), 0)
      },

      // same of a kind: 3/4 of a kind, full house, yahtzee
      {
        name: "threeofakind",
        score: numbers =>
          this.findNrTimes(numbers, 3) ? this.numbersSum(numbers) : 0
      },
      {
        name: "fourofakind",
        score: numbers =>
          this.findNrTimes(numbers, 4) ? this.numbersSum(numbers) : 0
      },
      {
        name: "yahtzee",
        score: numbers => (this.findNrTimes(numbers, 5) ? 50 : 0)
      },
      {
        name: "fullhouse",
        score: numbers => {
          let twos = this.findNrTimes(numbers, 2, 2);
          let threes = this.findNrTimes(numbers, 3, 3);
          return twos && threes ? 25 : 0;
        }
      },

      // Straights
      {
        name: "smallstraight",
        score: numbers => (this.maxStraight(numbers) >= 4 ? 30 : 0)
      },
      {
        name: "largestraight",
        score: numbers => (this.maxStraight(numbers) >= 5 ? 40 : 0)
      },

      // chance
      {
        name: "chance",
        score: numbers => this.numbersSum(numbers)
      }
    ];
  }

  getPointsFor(scoreKey, numbers) {
    const scoreFunc = this.scores.find(s => s.name === scoreKey);
    if (!scoreFunc) return 0;

    return scoreFunc.score(numbers);
  }

  findNrTimes(numbers, min, max = 5) {
    const group = numbers.reduce((a, c) => {
      a[c] = a[c] ? a[c] + 1 : 1;
      return a;
    }, {});

    for (let nr in group) {
      if (group[nr] >= min && group[nr] <= max) {
        return { nr, n: group[nr] };
      }
    }

    return null;
  }

  numbersSum(numbers) {
    return numbers.reduce((a, c) => a + c, 0);
  }

  maxStraight(numbers) {
    let max = 1;
    let n = 1;
    numbers = [...new Set(numbers)]; // unique
    numbers.sort();
    for (let i = 1; i < numbers.length; i++) {
      if (numbers[i - 1] + 1 === numbers[i]) {
        n++;
        max = Math.max(max, n);
      } else {
        n = 1;
      }
    }
    return max;
  }
}

// export default Scores;

module.exports = Scores;
exports.Scores;
