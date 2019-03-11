import React, { Component } from 'react'

class PlayOnlineGame extends Component {

    constructor(props) {
      super(props);

      this.state = {
        gameId: null
      }

    }

    componentDidMount() {
      this.props.firebase.joinGame().then(res => {
        console.log(res, 'game found');
        this.setState({ gameId: res.data.gameId })
      }).catch(e => {
        console.log(e, 'no game to join');
      });
    }

    mountGame() {
      console.log(this.state.gameId, 'load game');
      if (!this.state.gameId) return null;
      if (this.game) return;
      console.log(this.state.gameId, 'mount game');
      this.game = this.props.firebase.game(this.state.gameId);

      console.log(this.game, 'game subs')
      this.game.on('value', snapshot => {
        console.log(snapshot, 'snap');
        const gameObject = snapshot.val();
        console.log(gameObject, 'game object change');

        // const usersList = Object.keys(usersObject).map(key => ({
        //   ...usersObject[key],
        //   uid: key,
        // }));

        this.setState({ game: gameObject });
      });;
    }

    componentWillUnmount() {
      if (this.game) {
        // this.props.firebase.users().off();
        // this.props.firebase.game(this.state.gameId).off();
        this.game.off();
      }
    }


    render() {
      const gameId = this.state.gameId;
      this.mountGame();
      const game = this.state.game;
      console.log(gameId, 'game render');
      console.log(game, 'firebase game entry (Reactive)');

      return (
        <div>
          Game: {gameId ? gameId : 'no game'}
          {game ? game.state : 'noooo game'}
        </div>
      )
    }
}

export default PlayOnlineGame
