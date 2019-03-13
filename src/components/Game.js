import React, { Component } from "react"
import Scoreboard from "./Scoreboard"
import Scores from "../helpers/Scores"
import DicesPanel from "./DicesPanel"
import GameFinished from "./GameFinished"
import { Button } from 'semantic-ui-react'

import { DICE_ANIMATION, BOT_DECISION } from '../constants/timing'

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isFinished: false,
      lastScoreUser: null,
      lastScoreTitle: null
    };

  }

  componentDidMount() {
    this.botDecision();
  }

  // ROLL shake : http://qnimate.com/detect-shake-using-javascript/

  rollDices() {

    // remain throws, if 0, locked!
    if (this.props.remainThrows <= 0) return;
    if (this.props.rolling) return;

    if (this.props.rollDices) {
      this.props.rollDices();
    }

    setTimeout(() => {
      this.botDecision();
    }, DICE_ANIMATION);
  }

  toggleDiceLock(diceNr) {
    this.props.toggleDiceLock(diceNr);
  }
  setPoints(scoreKey) {

    // remember what was set by who
    const scoreFunc = Scores.find(s => s.name===scoreKey);
    this.setState({
      lastScoreTitle: scoreFunc ? scoreFunc.title : null,
      lastScoreUser: this.props.users[ this.props.activeUser ].name
    });


    this.props.setPoints(scoreKey);

    setTimeout(() => {

      // check finished
      const users = this.props.users;
      const lastUser = users[ users.length-1 ];
      if (!Object.values(lastUser.scoreboard.scores).some(s => s===null)) {
        this.setState({ isFinished: true });
        return;
      }

      this.botDecision();
    }, DICE_ANIMATION);
  }

  // automatic bot decision if user is bot
  botDecision() {

    // check waiting mode
    if (this.props.rolling) return;
    if (this.state.isFinished) return;

    // check active user is bot
    const activeUser = this.props.users[ this.props.activeUser ];
    if (!activeUser.isBot) return;

    let decision = activeUser.getBotDecision(this.props.remainThrows, this.props.dices);
    console.log(decision, 'bot decision for '+activeUser.name);

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
    }, BOT_DECISION);
  }

  render() {
    const dices = this.props.dices;
    const users = this.props.users;
    const remainThrows = this.props.remainThrows;

    const isOnline = this.props.isMe;
    const activeUser = users[this.props.activeUser];
    const isInteraction = this.props.isInteraction && !activeUser.isBot;
    const msg = (isOnline && isInteraction ? 'Du bist' : activeUser.name+" ist") + " an der Reihe";
    const lastSetMessage = this.state.lastScoreUser ? this.state.lastScoreUser + " hat auf " + this.state.lastScoreTitle + " gesetzt" : '';

    // wait screen
    const isPlayerStart = (remainThrows === 3);


    return (
      <div className="game">

        {/* IS FINISHED */}
        {this.state.isFinished ? (
          <GameFinished users={this.props.users} />
        ) : (

          <div>
            {/* IS STARTING */}
            {isPlayerStart ? (
              <div>
                {lastSetMessage ? (
                  <h3>{lastSetMessage}</h3>
                ) : ''}
                <h1>{msg}</h1>
                {isInteraction ? (
                  <Button onClick={() => this.rollDices()}>
                    würfeln
                  </Button>
                ) : ''}
              </div>

            ) : (

              <div>

                {/* GAME */}
                <DicesPanel
                  dices={dices}
                  rolling={this.props.rolling}
                  isInteraction={isInteraction}
                  message=""
                  remainThrows={remainThrows}
                  rollDices={() => this.rollDices() }
                  toggleDice={(diceNr) => this.props.toggleDiceLock(diceNr)}
                />

                <div className="scoreboard">
                  <Scoreboard
                    activeUser={this.props.activeUser}
                    users={users}
                    dices={dices}
                    rolling={this.props.rolling}
                    isInteraction={isInteraction}
                    setPoints={scoreKey => this.setPoints(scoreKey)}
                  />
                </div>
              </div>

            )}
          </div>
        )}
      </div>
    );
  }
}

export default Game;
