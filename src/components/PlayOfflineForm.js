import React, { Component } from "react"
import User from "../helpers/User"
import { Button } from "semantic-ui-react"

const svgButton = (
  <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
  <g stroke="#BD9A9C" strokeWidth="2" fill="none" fillRule="evenodd">
    <g strokeLinecap="square">
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

    this.inputRefs = [];
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentDidMount() {
    this.focusInput();
  }
  componentDidUpdate() {
    this.focusInput();
  }

  focusInput() {
    const inputs = document.querySelectorAll('input[type=text]');
    if (inputs.length > 0) {
      inputs[ inputs.length - 1 ].focus();
    }
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
    const isInvalid = users.some(u => u.name === '');

    return (
      <div>
        {users.map((user, nr) => (
          <div key={nr}>
            <input
              type="text"
              value={user.name}
              placeholder={`Spielername ${nr + 1}`}
              name={nr}
              onKeyDown={e => this.addUser(e)}
              onChange={this.handleUserInput}
              required
              autoComplete="off"
            />
            <label>
              <br/>
              <input
                type="checkbox"
                value={user.isBot}
                name={nr}
                onChange={this.handleUserInput}
              /> &nbsp; Computer-Spieler
            </label>
          </div>
        ))}
        <Button className="button-icon" onClick={() => this.addUser()}>
          <span>{svgButton}</span>
          zusätzlicher Spieler
        </Button>
        <Button disabled={isInvalid} onClick={() => this.props.onSubmit(this.state.users)}>
          Start
        </Button>
      </div>
    );
  }
}

export default PlayOfflineForm;
