import React, { Component } from "react";
import Scoreboard from "./Scoreboard";
import DicesPanel from "./DicesPanel";
import Scores from "../helpers/Scores";
import { getRandomDices } from "../helpers/DicesHelper";
//import UserScoreboard from './helpers/UserScoreboard';

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeUser: 0,
      dices: getRandomDices(),
      rolling: false, // dices are rolling (animated)
      remainThrows: 3,
      finito: false
    };

    this.ANIMATION_DURATION = 1500; //1500;
    this.BOT_WAIT_DURATION = 100; //1000;
  }

  componentDidMount() {
    this.rollDices();
  }

  rollDices() {

    // remain throws, if 0, locked!
    if (this.state.remainThrows <= 0) return;
    if (this.state.rolling) return;

    //this.setState((state /*, props*/ ) => ({
    this.setState({
      rolling: true,
      remainThrows: (this.state.remainThrows - 1),
      dices: getRandomDices(this.state.dices)
    });

    // stop rolling animation
    setTimeout(() => {
      this.setState({ rolling: false }, this.botDecision);
    }, this.ANIMATION_DURATION);
  }

  // automatic bot decision if user is bot
  botDecision() {
    const activeUser = this.props.users[ this.state.activeUser ];
    if (!activeUser.isBot) return;

    let decision = activeUser.getBotDecision(this.state.remainThrows, this.state.dices);
    // console.log(decision, 'bot decision for '+activeUser.name);

    setTimeout(() => {
      switch(decision.cmd) {

        case 'SELECT':
          this.setPoints(decision.option);
          break;

        case 'KEEP':
          const keep = decision.option;
          this.state.dices.forEach((d,i) => {
            if (d.isLocked && !keep.includes(i)) {
              this.toggleDiceLock(i);
            } else if (!d.isLocked && keep.includes(i)) {
              this.toggleDiceLock(i);
            }
          });
          this.rollDices();
          break;
        default:
          break;
      }
    }, this.BOT_WAIT_DURATION);


  }

  toggleDiceLock(id) {
    if (this.state.rolling) return;
    const dices = this.state.dices.slice(0);
    dices[id].isLocked = !dices[id].isLocked;
    this.setState({ dices });
  }

  setPoints(scoreKey) {

    // update scoreboard
    const users = this.props.users.slice(0);
    const activeUser = users[this.state.activeUser];
    const scoreFunc = Scores.find(s => s.name === scoreKey);
    const nextUser = (this.state.activeUser + 1) % users.length;
    const numbers = this.state.dices.map(d => d.nr);

    activeUser.scoreboard.scores[scoreKey] = scoreFunc.score(numbers);

    // check finished
    const lastUser = users[ users.length-1 ];
    if (!Object.values(lastUser.scoreboard.scores).some(s => s===null)) {
      this.setState({ finito: true });
      return;
    }

    // next user & reset dices
    this.setState({
      activeUser: nextUser, // rotate users
      dices: getRandomDices(),
      remainThrows: 3,
      users
    }, this.rollDices); // then, roll for next user
  }

  render() {
    const dices = this.state.dices;
    const users = this.props.users;

    return (
      <div className="game">

        <DicesPanel
          dices={dices}
          rolling={this.state.rolling}
          remainThrows={this.state.remainThrows}
          rollDices={() => this.rollDices() }
          toggleDice={(diceNr) => this.toggleDiceLock(diceNr)}
        />

        <div className="scoreboard">
          <Scoreboard
            activeUser={this.state.activeUser}
            users={users}
            dices={dices}
            rolling={this.state.rolling}
            setPoints={scoreKey => this.setPoints(scoreKey)}
          />
        </div>

      </div>
    );
  }
}

export default Game;
