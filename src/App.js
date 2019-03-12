import React, { Component } from 'react';
import PlayOffline from './components/PlayOffline';
import PlayOnline from './components/PlayOnline';
import Welcome from './components/Welcome';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import './App.css';

// import User from './helpers/User'; // for debug

class App extends Component {

  // constructor(props) {
  //   super(props);

  //   // // debug
  //   // this.state = {
  //   //   users: [ new User('chris', true), new User("fibs", true)]
  //   // }
  //   // return;
  //   // // debug end

  //   // // this.state = {
  //   // //   users: null
  //   // // };


  // }


  render() {

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
            <Route path={ROUTES.OFFLINE} component={PlayOffline} />
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

// export default withAuthentication(App);
export default App;
