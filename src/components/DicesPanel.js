import React, { Component } from "react";
import Dice from "./Dice";
import { getRandomDices } from "../helpers/DicesHelper";

class DicesPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animatedDices: []
    };
  }

  animateDices() {
    this.setState({
      animatedDices: getRandomDices(this.props.dices)
    });
  }

  render() {
    const rolling = this.props.rolling;
    const remainThrows = this.props.remainThrows;
    const dices = rolling ? this.state.animatedDices : this.props.dices;
    let className = 'dices-panel ' + (rolling ? 'rolling' : '');

    // rolling animation
    if (rolling) {
      setTimeout(() => this.animateDices(), 100);
    }

    return (
      <div className={className}>

        <div className="dices">
          {dices.map(dice => (
            <Dice
              key={dice.id}
              id={dice.id}
              nr={dice.nr}
              isLocked={dice.isLocked}
              onClick={() => this.props.toggleDice(dice.id)}
            />
          ))}
        </div>

        {remainThrows > 0 ? (
          <button className="btn btn-primary" onClick={() => this.props.rollDices()}>
            würfeln <small>({3 - remainThrows} / 3)</small>
          </button>
        ) : (
          <h3>Wo willst du deine Punkte schreiben?</h3>
        )}

      </div>
    );
  }
}

export default DicesPanel;
