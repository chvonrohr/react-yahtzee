import React, { Component } from "react";
import Dice from "./Dice";
import { getRandomDices } from "../helpers/DicesHelper";
import styled from 'styled-components';
import { Button } from 'semantic-ui-react';


const Panel = styled.div`
  // height: 150px;
`;

const Dices = styled.div`
`;


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
    const message = this.props.message || '';

    // rolling animation
    if (rolling) {
      setTimeout(() => this.animateDices(), 100);
    }

    return (
      <Panel>

        <Dices className="dices">
          {dices.map(dice => (
            <Dice
              key={dice.id}
              id={dice.id}
              nr={dice.nr}
              rolling={rolling}
              isLocked={dice.isLocked}
              onClick={() => this.props.toggleDice(dice.id)}
            />
          ))}
        </Dices>

        {/* BUTTON OR MESSAGE */}
        {this.props.isInteraction ? (
          <div className="message-area">
            {remainThrows > 0 ? (
              <Button onClick={() => this.props.rollDices()}>
                würfeln <small>({3 - remainThrows} / 3)</small>
              </Button>
            ) : (
              <h3>Wo willst du deine Punkte schreiben?</h3>
            )}
          </div>
        ) : (
          <p>{message}</p>
        )}


      </Panel>
    );
  }
}

export default DicesPanel;
