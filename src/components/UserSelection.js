import React, { Component } from 'react';
import User from '../helpers/User';


class UserSelection extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
          users: [ new User() ]
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
        this.setState({value: event.target.value});
        const target = event.target;
        const user = this.state.users[ target.name ];
        user.name = target.value;
    }
    
    render() {
        const users = this.state.users.slice(0);
        return (
            <div>
                {users.map((user, nr) =>
                    <div key={nr}>
                        User {nr+1}: 
                        <input 
                            type={user.name}
                            name={nr}
                            onKeyDown={(e) => this.addUser(e)}
                            onChange={this.handleUserInput}
                            required
                        />
                    </div>
                )}
                <button onClick={() => this.addUser() }>Another User</button>
                <button onClick={() => this.props.onSubmit(this.state.users) }>Start</button>
            </div>
        )
    }
}

export default UserSelection;
