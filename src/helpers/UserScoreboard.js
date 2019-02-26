

class UserScoreboard {

    constructor(scores) {
        this.scores = Object.assign({
            ones: null,
            twos: null,
            threes: null,
            fours: null,
            fives: null,
            sixes: null,
            threeofakind: null,
            fourofakind: null,
            fullhouse: null,
            smallstraight: null,
            largestraight: null,
            chance: null,
            yahtzee: null,
        }, scores);
    }

    setScore(name, score) {
        this.scores[name] = score;
    }
    
    get partlyScore() {
        const s = this.scores;
        const properties = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
        return properties.reduce((a, p) => s[p] ? a+s[p] : a, 0);
    }
    
    get bonus() {
        return this.partlyScore>=63 ? 35 : 0;
    }

    get totalScore() {
        const s = this.scores;
        const properties = ['threeofakind', 'fourofakind', 'yahtzee', 'fullhouse', 'smallstraight', 'largestraight', 'chance'];
        return this.partlyScore + this.bonus + properties.reduce((a, p) => s[p] ? a+s[p] : a, 0);
    }
}


export default UserScoreboard;