import React, { Component } from 'react';
import UserSelection from './components/UserSelection';
import PlayOnline from './components/PlayOnline';
import Welcome from './components/Welcome';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';

import User from './helpers/User'; // for debug
//import  { FirebaseContext } from './components/Firebase';
import { withAuthentication } from './components/Session';

class App extends Component {

  constructor(props) {
    super(props);

    // debug
    this.state = {
      users: [ new User('chris', true), new User("fibs", true)]
    }
    return;
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
      <div>
         {/* <FirebaseContext.Consumer>
          {firebase => {
            return <div>I've access to Firebase and render something.</div>;
          }}
        </FirebaseContext.Consumer> */}
        <Router>
          <div>
            <Route exact path={ROUTES.WELCOME} component={Welcome} />
            <Route path={ROUTES.OFFLINE} component={UserSelection} />
            <Route path={ROUTES.ONLINE} component={PlayOnline} />
            {/* <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} /> */}
          </div>
        </Router>
      </div>
    );

    // return (
    //   <div className="main">
    //     {users ? (
    //       <Game users={users} />
    //     ) : (
    //       <UserSelection onSubmit={(users) => this.setUsers(users) } />
    //     )}
    //   </div>
    // );
  }
}

export default withAuthentication(App);
//export default App;
