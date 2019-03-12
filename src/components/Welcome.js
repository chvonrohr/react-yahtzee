import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../constants/routes";

class Welcome extends Component {
  render() {
    return (
      <div>
        <Link to={ROUTES.ONLINE} className="button ui welcome">
          PLAY ONLINE
        </Link>
        <br />
        <Link to={ROUTES.OFFLINE} className="button ui welcome">
          PLAY OFFLINE
        </Link>
      </div>
    );
  }
}

export default Welcome;
