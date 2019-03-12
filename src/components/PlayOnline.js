import React, { Component } from 'react'
import { FirebaseContext } from './Firebase'
import PlayOnlineForm from './PlayOnlineForm'
import PlayOnlineGame from './PlayOnlineGame'
import { withAuthentication } from './Session';

import { AuthUserContext/*, withAuthorization */} from './Session'

const INITIAL_STATE = {
  user: null
};

class PlayOnline extends Component {

    constructor(props) {
      super(props);
      this.state = { ...INITIAL_STATE };
    }

    onRegister(nickname, user) {
      console.log(user, nickname);
    }

    render() {
      const playerName = 'SCH name ' + Math.floor(Math.random()*1000);
      return (
        <div>
          <AuthUserContext.Consumer>
            {authUser => authUser ? (
                <FirebaseContext.Consumer>
                  {firebase => <PlayOnlineGame firebase={firebase} authUser={authUser} playerName={playerName} />}
                </FirebaseContext.Consumer>
              ) : (
                <FirebaseContext.Consumer>
                  {firebase => <PlayOnlineForm firebase={firebase} authUser={authUser} playerName={playerName} />}
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
