import React, { Component } from 'react'
import Game from './Game'
import Scores from '../helpers/Scores'
import { getRandomDices } from '../helpers/DicesHelper'
import { DICE_ANIMATION } from '../constants/timing'

class PlayOnlineForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeUser: 0,
      game: undefined,
      rolling: false,
      dices: getRandomDices(),
      remainThrows: 3
    }
  }

  toggleDiceLock(id) {
    if (this.state.rolling) return;
    const dices = this.state.dices.slice(0);
    dices[id].isLocked = !dices[id].isLocked;
    this.setState({ dices });
  }

  rollDices() {

    //this.setState((state /*, props*/ ) => ({
    this.setState({
      rolling: true,
      remainThrows: (this.state.remainThrows - 1),
      dices: getRandomDices(this.state.dices)
    });

    setTimeout(() => {
      this.setState({ rolling: false });
    }, DICE_ANIMATION);
  }

  setPoints(scoreKey) {

    // update scoreboard
    const users = this.props.users.slice(0);
    const activeUser = users[this.state.activeUser];
    const scoreFunc = Scores.find(s => s.name === scoreKey);
    const nextUser = (this.state.activeUser + 1) % users.length;
    const numbers = this.state.dices.map(d => d.nr);
    const resolved = () => {};

    activeUser.scoreboard.scores[scoreKey] = scoreFunc.score(numbers);

    // next user & reset dices
    this.setState({
      activeUser: nextUser, // rotate users
      dices: getRandomDices(),
      remainThrows: 3,
      users
    }, () => { resolved(); });

    return new Promise(resolved);
  }


  render() {
    const activeUser = this.state.activeUser;
    const rolling = this.state.rolling;
    const dices = this.state.dices;
    const users = this.props.users;

    return (
      <Game
        activeUser={activeUser}
        users={users}
        dices={dices}
        rolling={rolling}
        isInteraction={true}
        isOnline={false}
        remainThrows={this.state.remainThrows}
        rollDices={() => this.rollDices()}
        setPoints={(scoreKey) => this.setPoints(scoreKey)}
        toggleDiceLock={(id) => this.toggleDiceLock(id)}
      />
    )
  }

}

export default PlayOnlineForm
