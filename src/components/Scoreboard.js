import React, { Component } from 'react'
import { Header, Table } from 'semantic-ui-react'
import Scores from '../helpers/Scores'
import './Scoreboard.css'

class Scoreboard extends Component {

    render() {
        const users = this.props.users;
        const dices = this.props.dices;
        const numbers = dices.map(d => d.nr);
        const rolling = this.props.rolling;

        const rows = Object.keys(users[0].scoreboard.scores).map(sKey => {
            return users.map((u, uNr) => {
                const scores = u.scoreboard.scores;
                const scoreFunc = Scores.find(s => s.name === sKey);
                const activeUser = (uNr === this.props.activeUser);

                let content = '-';
                let className = activeUser ? 'active' : '';

                // show score or "-" for non-active users or in rolling-mode
                if (!activeUser ||
                    rolling ||
                    isInteger(scores[sKey])
                ) {
                  content = isInteger(scores[sKey]) ? scores[sKey] : '-';

                // show score-selection button and points otherwise
                } else {
                    const possibleScore = scoreFunc.score(numbers);
                    className = 'active-selection';
                    content = (
                        <button onClick={() => this.props.setPoints(sKey)}>
                            {possibleScore}
                        </button>
                    )
                }

                return {
                    key: uNr+"/"+sKey,
                    scoreName: scoreFunc.title,
                    class: className,
                    content
                };
            });
        });

        // partly sum
        rows.splice(6,0, users.map(u => {
            return { key: u.name+"/partly", scoreName: 'Summe', class: 'total', content: (
                <span>{u.scoreboard.partlyScore}</span>
            )}
        }));

        // bonus
        rows.splice(7,0, users.map(u => {
            return { key: u.name+"/bonus", scoreName: 'Bonus', content: (
                <span>{u.scoreboard.bonus}</span>
            )}
        }));

        // total
        rows.push(users.map(u => {
          return {
            key: u.name+"/totalScore",
            scoreName: 'Total',
            class: 'total',
            content: (
              <span>{u.scoreboard.totalScore}</span>
            )};
        }));

        return (
            <Table basic='very' striped celled>
              <Table.Header>

                <Table.Row>
                  <Table.HeaderCell className="score"></Table.HeaderCell>
                  {users.map(user =>
                    <Table.HeaderCell key={user.name} className="user-info">

                      <Header.Content>
                        {user.avatar}
                        {user.name}<br/>
                        {user.isBot ? '(Bot)' : ''}
                      </Header.Content>
                    </Table.HeaderCell>
                  )}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {rows.map(scoreRow =>
                  <Table.Row key={scoreRow[0].scoreName}>
                    <Table.Cell className="score">{scoreRow[0].scoreName}</Table.Cell>
                    {scoreRow.map(userCell =>
                      <Table.Cell key={userCell.key} className={userCell.class}>
                        {userCell.content}
                      </Table.Cell>
                    )}
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
        )
    }
}

export default Scoreboard;

function isInteger(nr) {
  return nr === parseInt(nr, 10)
}
