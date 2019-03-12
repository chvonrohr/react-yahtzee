import React, { Component } from "react";
import User from "../helpers/User";

class PlayOfflineForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [new User()]
    };

    this.handleUserInput = this.handleUserInput.bind(this);
  }

  addUser(e) {
    if (e && e.keyCode && e.keyCode !== 13) {
      return;
    }
    const users = this.state.users.slice(0);
    users.push(new User());
    this.setState({ users });
  }

  handleUserInput(event) {
    this.setState({ value: event.target.value });
    const target = event.target;
    const isCheckbox = target.type === "checkbox";
    const value = isCheckbox ? target.checked : target.value;
    const user = this.state.users[target.name];

    if (isCheckbox) {
      user.isBot = value;
    } else {
      user.name = value;
    }
  }

  render() {
    const users = this.state.users.slice(0);
    return (
      <div>
        <h1>Gib deine Spieler-Namen ein:</h1>
        {users.map((user, nr) => (
          <div key={nr}>
            Spieler {nr + 1}:
            <input
              type="text"
              value={user.name}
              name={nr}
              onKeyDown={e => this.addUser(e)}
              onChange={this.handleUserInput}
              required
            />
            <label>
              <input
                type="checkbox"
                value={user.isBot}
                name={nr}
                onChange={this.handleUserInput}
              /> {" "} Bot
            </label>
          </div>
        ))}
        <button className="btn" onClick={() => this.addUser()}>
          Another User
        </button>
        <button
          className="btn btn-primary"
          onClick={() => this.props.onSubmit(this.state.users)}
        >
          Start
        </button>
      </div>
    );
  }
}

export default PlayOfflineForm;
