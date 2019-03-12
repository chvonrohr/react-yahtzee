import React, { Component } from 'react';
import PlayOfflineForm from './PlayOfflineForm'
import PlayOfflineGame from './PlayOfflineGame'


class PlayOffline extends Component {

    constructor(props) {
        super(props);
        this.state = {
          users: []
        };
    }

    start(users) {
      console.log(users, 'start');
      const newUsers = users.slice(0);
      this.setState({ users: newUsers });
    }

    render() {
        const users = this.state.users;
        const hasUsers = users.length>0;
        console.log(users, 'render game');
        return (
          <div>
            {hasUsers ? (
              <PlayOfflineGame users={this.state.users} />
            ) : (
              <PlayOfflineForm onSubmit={(users) => this.start(users)} />
            )}
          </div>
        )
    }
}

export default PlayOffline;
