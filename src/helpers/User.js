import UserScoreboard from './UserScoreboard';

class User {

    constructor(userName) {
        this.scoreboard = new UserScoreboard();
        this.name = userName || '';
    }

    // set name(name) {
    //     this.name = name;
    // }

    // get name() {
    //     return this.name;
    // }

    get avatar() {
        return 'https://api.adorable.io/avatars/285/' + this.name + '.png';
        //return 'http://i.pravatar.cc/300'
    }
}


export default User;