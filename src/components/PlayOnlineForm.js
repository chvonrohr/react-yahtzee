import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'
// import { AuthUserContext, withAuthorization } from './Session'
//import { auth } from 'firebase';
// import * as ROUTES from '../constants/routes'

const INITIAL_STATE = {
  displayName: '',
  error: null,
  loading: false
};


class PlayOnlineForm extends Component {

    constructor(props) {
      super(props);
      this.state = { ...INITIAL_STATE };
      // this.state.authUser = props.authUser;
    }

    onChange = event => {
      //[event.target.name]: event.target.value
      this.setState({displayName: event.target.value});
    }

    onSubmit = event => {
      event.preventDefault();

      const { displayName } = this.state;
      const authUser = this.props.authUser;

      if (authUser) {
        // this.props.firebase.user(authUser.uid).set({email: 'cv@frontal.ch'});
        this.props.onRegister(displayName);
        return;
      }

      this.setState({ loading: true });

      console.log(this.authUser, 'create new user');
      this.props.firebase
        .doSignInWithAnonymousUser()
        .then(authUser => {
          // this.setState({ ...INITIAL_STATE });
          //this.props.onRegister(this.state.displayName, authUser);
          console.log(this.props.firebase.user(authUser.user.uid), 'auth user');
          return this.props.firebase.user(authUser.user.uid).set({displayName});
        })
        .then(() => {
          // this.setState({ ...INITIAL_STATE });
          this.setState({ loading: false });
          this.props.onRegister(displayName);
        })
        .catch(error => {
          this.setState({ error, loading: false });
        });

    }

    render() {
      const nameInvalid = (this.state.displayName === '');

      return (
        <div>
          <h1>Spielername:</h1>

          <form onSubmit={this.onSubmit}>
            <input placeholder='Spielernamen' onChange={this.onChange}/>
            <br/><br/>
            <Button disabled={nameInvalid}>Los</Button>
          </form>
        </div>

      )
    }
}

export default PlayOnlineForm
