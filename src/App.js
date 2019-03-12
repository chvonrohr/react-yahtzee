import React, { Component } from 'react';
import PlayOffline from './components/PlayOffline';
import PlayOnline from './components/PlayOnline';
import Welcome from './components/Welcome';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as ROUTES from './constants/routes';
import './App.css';

// import User from './helpers/User'; // for debug

class App extends Component {

  render() {

    return (
      <Router>
        <div className="outer">
          <img src="/images/Logo_Yahtzee.svg" className="logo" alt="Schönes Logo"/>
          <Route exact path={ROUTES.WELCOME} component={Welcome} />
          <Route path={ROUTES.OFFLINE} component={PlayOffline} />
          <Route path={ROUTES.ONLINE} component={PlayOnline} />
        </div>
      </Router>
    );
  }
}

// export default withAuthentication(App);
export default App;
