import React, { Component } from 'react'
import Firebase, { FirebaseContext } from './Firebase'
import PlayOnlineForm from './PlayOnlineForm'
import PlayOnlineGame from './PlayOnlineGame'

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
      return (
        <div>
          <AuthUserContext.Consumer>
            {authUser => authUser ? (
                <FirebaseContext.Consumer>
                  {firebase => <PlayOnlineGame firebase={firebase} authUser={authUser} />}
                </FirebaseContext.Consumer>
              ) : (
                <FirebaseContext.Consumer>
                  {firebase => <PlayOnlineForm firebase={firebase} authUser={authUser} />}
                </FirebaseContext.Consumer>
              )
            }
          </AuthUserContext.Consumer>
          {/* <AuthUserContext.Consumer>
            {authUser =>
              <FirebaseContext.Consumer>
                {firebase => <PlayOnlineForm firebase={firebase} authUser={authUser} />}
              </FirebaseContext.Consumer>
            }
          </AuthUserContext.Consumer> */}

        </div>

      )
    }
}

export default PlayOnline
