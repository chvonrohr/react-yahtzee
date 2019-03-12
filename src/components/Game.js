import React, { Component } from "react";
import Scoreboard from "./Scoreboard";
import DicesPanel from "./DicesPanel";
// import Scores from "../helpers/Scores";
// import { getRandomDices } from "../helpers/DicesHelper";
//import UserScoreboard from './helpers/UserScoreboard';

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeUser: 0,
      // dices: getRandomDices(),
      // rolling: false, // dices are rolling (animated)
      // remainThrows: 3,
      finito: false
    };

    this.ANIMATION_DURATION = 1500; //1500;
    this.BOT_WAIT_DURATION = 100; //1000;
  }

  componentDidMount() {
    this.rollDices();
  }

  // ROLL shake : http://qnimate.com/detect-shake-using-javascript/

  rollDices() {

    // remain throws, if 0, locked!
    if (this.props.remainThrows <= 0) return;
    if (this.props.rolling) return;

    if (this.props.rollDices) {
      this.props.rollDices();
    }

    // // stop rolling animation
    // setTimeout(() => {
    //   this.setState({ rolling: false }, this.botDecision);
    // }, this.ANIMATION_DURATION);
  }

  // automatic bot decision if user is bot
  botDecision() {
    const activeUser = this.props.users[ this.state.activeUser ];
    if (!activeUser.isBot) return;

    let decision = activeUser.getBotDecision(this.state.remainThrows, this.props.dices);
    // console.log(decision, 'bot decision for '+activeUser.name);

    setTimeout(() => {
      switch(decision.cmd) {

        case 'SELECT':
          this.setPoints(decision.option);
          break;

        case 'KEEP':
          const keep = decision.option;
          this.props.dices.forEach((d,i) => {
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

  render() {
    const dices = this.props.dices;
    const users = this.props.users;

    return (
      <div className="game">

        <DicesPanel
          dices={dices}
          rolling={this.props.rolling}
          remainThrows={this.props.remainThrows}
          rollDices={() => this.rollDices() }
          toggleDice={(diceNr) => this.props.toggleDiceLock(diceNr)}
        />

        <div className="scoreboard">
          <Scoreboard
            activeUser={this.props.activeUser}
            users={users}
            dices={dices}
            rolling={this.props.rolling}
            setPoints={scoreKey => this.props.setPoints(scoreKey)}
          />
        </div>

      </div>
    );
  }
}

export default Game;
