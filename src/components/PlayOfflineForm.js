import React, { Component } from "react";
import User from "../helpers/User";
import { Button } from 'semantic-ui-react'

const svgButton = (
  <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#BD9A9C" stroke-width="2" fill="none" fill-rule="evenodd">
    <g stroke-linecap="square">
      <path d="M11.33333 20h17.33334M20 12v17"/>
    </g>
    <circle cx="20" cy="20" r="19"/>
  </g>
</svg>
)


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
        {users.map((user, nr) => (
          <div key={nr}>
            {/* Spieler {nr + 1}: */}
            <input
              type="text"
              value={user.name}
              placeholder={`Spielername ${nr + 1}`}
              name={nr}
              onKeyDown={e => this.addUser(e)}
              onChange={this.handleUserInput}
              required
            />
            {/* <label>
              <input
                type="checkbox"
                value={user.isBot}
                name={nr}
                onChange={this.handleUserInput}
              /> {" "} Bot
            </label> */}
          </div>
        ))}
        <Button className="button-icon" onClick={() => this.addUser()}>
          <span>{svgButton}</span>
          zusätzlicher Spieler
        </Button>
        <Button onClick={() => this.props.onSubmit(this.state.users)}>
          Start
        </Button>
      </div>
    );
  }
}

export default PlayOfflineForm;
