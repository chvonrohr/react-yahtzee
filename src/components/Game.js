import React, { Component } from 'react';
import Dice from './Dice';
import Scoreboard from './Scoreboard';
import Scores from '../helpers/Scores'
//import UserScoreboard from './helpers/UserScoreboard';


class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rolling: false, // dices are rolling (animated)
            activeUser: 0,
            remainThrows: 3,
            dices: Array(5).fill(1).map((_,i) => { return { id:i, nr: 1, isLocked: false }})
        };
    }


    componentDidMount() {
        this.rollDices();
    }


  // roll dices - generate random nr's 1-6
  rollDices() {
    // remain throws, if 0, locked!
    if (this.state.remainThrows <= 0) return;
    const remainThrows = this.state.remainThrows-1;
    

    const dices = this.state.dices.map(dice => {
      if (!dice.isLocked) {
        dice.nr = Math.ceil( Math.random() * 5.99 );
      }
      return dice;
    }); 

    this.setState({ dices, remainThrows });

    
  }

  getRandomDices() {
    return Array(5).fill(1).map((_,i) => { return { id:i, nr: Math.ceil( Math.random() * 5.99 ), isLocked: false }});
  }

  setPoints(scoreKey) {
    // update scoreboard
    const users = this.props.users.slice(0);
    const activeUser = users[ this.state.activeUser ];
    const scoreFunc = Scores.find(s => s.name === scoreKey);
    activeUser.scoreboard.scores[scoreKey] = scoreFunc.score(this.state.dices.map(d=>d.nr));
    this.setState({users});

    // next user & reset dices
    this.setState({
      activeUser: ((this.state.activeUser+1) % users.length), // rotate users
      dices: this.getRandomDices(),
      remainThrows: 2,
    });
    

  }

  toggleDiceLock(id) {
    const dices = this.state.dices.slice(0);
    dices[id].isLocked = !dices[id].isLocked;
    this.setState({dices});
  }

  render() {
    const dices = this.state.dices;
    const users = this.props.users;
    return (
      <div className="game">
        
        <div className="dices">
          {dices.map(dice => 
            <Dice key={dice.id} 
                  id={dice.id}
                  nr={dice.nr}
                  isLocked={dice.isLocked}
                  onClick={ () => this.toggleDiceLock(dice.id) } />
          )}
        </div>
        {(this.state.remainThrows>0 ? (
          <button
            className="roller"
            onClick={() => this.rollDices()}
          >
            würfeln <small>({3 - this.state.remainThrows} / 3)</small>
          </button>
        ) : (
          <h3>Choose your position</h3>
        ))}
        <div className="scoreboard">
            <Scoreboard 
                activeUser={this.state.activeUser}
                users={users} 
                dices={dices}
                setPoints={ (scoreKey) => this.setPoints(scoreKey) }
            />
        </div>
      </div>

    );
  }
}

export default Game;
