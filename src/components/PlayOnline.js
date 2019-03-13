import React, { Component } from 'react'
import { FirebaseContext } from './Firebase'
import PlayOnlineForm from './PlayOnlineForm'
import PlayOnlineGame from './PlayOnlineGame'
import { withAuthentication } from './Session';

import { AuthUserContext/*, withAuthorization */} from './Session'

const INITIAL_STATE = {
  user: null,
  nickname: null,
};

class PlayOnline extends Component {

    constructor(props) {
      super(props);
      this.state = { ...INITIAL_STATE };
    }

    onRegister(nickname/*, user*/) {
      this.setState({ nickname });
    }

    render() {
      const playerName = this.state.nickname;
      return (
        <div>
          <AuthUserContext.Consumer>
            {authUser => (authUser && playerName) ? (
                <FirebaseContext.Consumer>
                  {firebase => <PlayOnlineGame firebase={firebase} authUser={authUser} playerName={playerName} />}
                </FirebaseContext.Consumer>
              ) : (
                <FirebaseContext.Consumer>
                  {firebase => <PlayOnlineForm
                                  firebase={firebase}
                                  authUser={authUser}
                                  playerName={playerName}
                                  onRegister={(nickname) => this.onRegister(nickname) }/>}
                </FirebaseContext.Consumer>
              )
            }
          </AuthUserContext.Consumer>
        </div>

      )
    }
}

// export default PlayOnline
export default withAuthentication(PlayOnline);
