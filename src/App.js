import React, { Component } from 'react';
import Game from './components/Game';
import UserSelection from './components/UserSelection';
import './App.css';

import User from './helpers/User'; // for debug


class App extends Component {

  constructor(props) {
    super(props);

    // debug
    // this.state = {
    //   users: [ new User('chris'), new User("fibs")]
    // }
    // return;
    // debug end

    this.state = {
      users: null
    };


  }

  setUsers(users) {
    this.setState({ users })
  }

  render() {
    const users = this.state.users;

    return (
      <div className="main">
        {users ? (
          <Game users={users} />
        ) : (
          <UserSelection onSubmit={(users) => this.setUsers(users) } />
        )}
      </div>
    );
  }
}

export default App;
