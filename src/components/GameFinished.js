import React, { Component } from "react";
import * as ROUTES from "../constants/routes";
import { Link } from "react-router-dom";

class GameFinished extends Component {

  render() {
    const rankedUsers = this.props.users;
    rankedUsers.sort((u1,u2) => u2.scoreboard.totalScore - u1.scoreboard.totalScore);

    return (
      <div>
        <h1>Rangliste</h1>
        <ol className="player-ranks">
          {rankedUsers.map( (u,unr) =>
            <li key={unr}>{u.name} - {u.scoreboard.totalScore} Pkt.</li>
          )}
        </ol>

        <br></br>
        <Link to={ROUTES.WELCOME} className="button ui welcome">
          Zurück
        </Link>
      </div>
    );
  }
}

export default GameFinished
