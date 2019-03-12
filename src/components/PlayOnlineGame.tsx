import React, { Component } from 'react'
import app from 'firebase/app'
import Firebase from './Firebase/Firebase'
import Game from './Game'
import User from '../helpers/User'
import { IDice } from '../interfaces'


interface IProps {
  firebase: Firebase;
  authUser: any;
  playerName: string;
  // handleChange(event: any): void;
}

interface IState {
  gameId?: string;
  game?: app.firestore.DocumentData;
  rolling: boolean;
  keepDices: Array<number>;
}

interface IPlayer {
  name: string;
  user: string;
  scores: object;
}

interface IGame {
  createdAt: object;
  activePlayer: number;
  players: Array<IPlayer>;
  state: string;
}

class PlayOnlineGame extends Component<IProps, IState> {

  // game : app.firestore.DocumentReference;
  gameOff!: () => void;

  constructor(props: IProps) {
    super(props);

    this.state = {
      gameId: undefined,
      game: undefined,
      rolling: false,
      keepDices: []
    }
  }

  componentDidMount() {
    const playerName = this.props.playerName || 'Eminem';
    this.props.firebase.joinGame(playerName).then(res => {
      this.setState({ gameId: res.data.gameId })
    }).catch(e => {
      console.log(e, 'no game to join, back to name');
    });
  }

  mountGame() {
    console.log(this.state.gameId, 'load game');
    if (!this.state.gameId) return null;
    if (this.gameOff) return;

    this.gameOff = this.props.firebase
      .game(this.state.gameId)
      .onSnapshot(snapshot => {
        console.log(snapshot.data(), 'game updated');
        this.setState({ game: snapshot.data() as IGame });
    });
  }

  componentWillUnmount() {
    if (this.gameOff) {
      this.gameOff();
    }
  }

  startGame() : void {
    if (this.state.gameId) {
      this.props.firebase.startGame(this.state.gameId);
    }
  }

  getDices() : Array<IDice> {
    return this.state.game && this.state.game.dices ? this.state.game.dices : [];
  }

  rollDices() {
    if (this.state.gameId) {
      this.setState({ rolling: true });

      const keepDices = this.getDices().map((d:IDice) => d.isLocked ? d.id : -1).filter((i:number) => i>=0);
      console.log(keepDices, 'keep before roll');
      this.props.firebase.rollDices(this.state.gameId, keepDices);

      setTimeout(() => {
        this.setState({ rolling: false });
      }, 1000);
    }
  }

  toggleDiceLock(id : number) {
    const game = this.state.game;
    if (!game) return;

    const dices = this.getDices().slice(0);
    const dice = dices.find((d:IDice) => d.id === id);
    if (dice) {
      dice.isLocked = !dice.isLocked;
    }

    game.dices = dices;
    this.setState({ game });

  }

  setPoints(scoreKey : string) {
    if (this.state.gameId) {
      this.props.firebase.setPoints(this.state.gameId, scoreKey);
    }
  }


  render() {
    const gameId = this.state.gameId;
    this.mountGame();

    const game = this.state.game;
    const isStarting = (game && game.state==='starting');
    const players = game && game.players ? game.players : [];
    const users = players.map((player : IPlayer ) => {
      return new User(player.name, false, player.scores);
    });

    const dices = this.getDices();
    const activeUserId:number = game ? game.activePlayer : null;
    const remainingThrows:number = game ? game.remainingThrows : 0;
    const activeUser:User = users[activeUserId];
    // const itsMe = activeUser.userId === w1rdfc b

    console.log(game, 'game');
    console.log(remainingThrows, 'remainingThrows');
    console.log(activeUserId, 'activeUserId');

    return (
      <div>
        {game ? (
          <div>
            {isStarting ? (
              <div>
                <h1>Spieler</h1>
                <ul>
                  {players.map((player : IPlayer) =>
                    <li key={player.name}>{player.name}</li>
                  )}
                </ul>
                <i>Suche weitere Spieler...</i>
                <button onClick={() => this.startGame()}>Spiel starten</button>
              </div>
            ) : (
              <Game
                users={users}
                dices={dices}
                activeUser={activeUserId}
                rolling={this.state.rolling}
                remainThrows={remainingThrows}
                rollDices={() => this.rollDices()}
                toggleDiceLock={(diceId:number) => this.toggleDiceLock(diceId)}
                setPoints={(scoreKey:string) => this.setPoints(scoreKey)}
              />
            )}
          </div>
        ) : (
          <p>Suche verfügbare Spiele</p>
        )}
      </div>
    )
  }
}

export default PlayOnlineGame
