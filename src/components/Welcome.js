import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';

import UserSelection from './PlayOffline';
import PlayOnline from './PlayOnline';

// import { withAuthorization } from '../Session';

// const isAuth = authUser => !!authUser;

class Welcome extends Component {

    // constructor(props) {
    //     super(props);
    // }

    // componentDidMount() {
    // }

    render() {
        return (
          <Router>
            <div>
              <Link to={ROUTES.ONLINE}>PLAY ONLINE</Link>
              <br/>
              <Link to={ROUTES.OFFLINE}>PLAY OFFLINE</Link>


              <Route path={ROUTES.OFFLINE} component={UserSelection} />
              <Route path={ROUTES.ONLINE} component={PlayOnline} />
            </div>

          </Router>
        )
    }
}

export default Welcome
