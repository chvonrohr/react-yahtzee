import React, { Component } from 'react'
import { Header, Table, Grid } from 'semantic-ui-react'
import Scores from '../helpers/Scores'
import './Scoreboard.css'

const TITLE_CELL_WIDTH = 3;
const USER_CELL_WIDTH = 1;

class Scoreboard extends Component {

    render() {
        const users = this.props.users;
        const dices = this.props.dices;
        const numbers = dices.map(d => d.nr);
        const rolling = this.props.rolling;
        const isInteraction = this.props.isInteraction;

        const rows = Object.keys(users[0].scoreboard.scores).map(sKey => {
            const scoreFunc = Scores.find(s => s.name === sKey);

            return {
              class: '',
              title: scoreFunc.title,
              cols: users.map((u, uNr) => {
                const scores = u.scoreboard.scores;

                const activeUser = (uNr === this.props.activeUser);

                let content = '-';
                let className = activeUser ? 'active' : '';

                // show score or "-" for non-active users or in rolling-mode
                if (!activeUser ||
                    rolling ||
                    isInteger(scores[sKey] ||
                    !isInteraction)
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
                    // scoreName: scoreFunc.title,
                    class: className,
                    content
                };
            })
          }
        });

        // partly sum
        rows.splice(6,0, {
          class: 'total',
          title: 'Summe',
          cols: users.map(u => {
            return {
              key: u.name+"/partly",
              class: 'total',
              content: (
                <span>{u.scoreboard.partlyScore}</span>
              )
            };
          })
        });

        // bonus
        rows.splice(7,0, {
          class: 'bonus',
          title: 'Bonus',
          cols: users.map(u => {
            return {
              key: u.name+"/bonus",
              content: (
                <span>{u.scoreboard.bonus}</span>
              )
            }
          })
        });

        // total
        rows.push({
          class: 'total',
          title: 'Total',
          cols: users.map(u => {
            return {
              key: u.name+"/totalScore",
              content: (
                <span>{u.scoreboard.totalScore}</span>
              )}
            })
        });

        return (
          <Grid centered>
            <Grid.Column mobile={16} tablet={8} computer={8}>

              <Table basic='very' celled collapsing unstackable>
                <Table.Header>

                  <Table.Row>
                    <Table.HeaderCell width={TITLE_CELL_WIDTH}></Table.HeaderCell>
                    {users.map(user =>
                      <Table.HeaderCell
                        key={user.name}
                        width={USER_CELL_WIDTH}
                        verticalAlign="top"
                        textAlign="center"
                      >
                        <Header.Content>
                          {/* {user.avatar}<br/> */}
                          {user.name}<br/>
                          {user.isBot ? '(Bot)' : ''}
                        </Header.Content>
                      </Table.HeaderCell>
                    )}
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {rows.map(scoreRow =>
                    <Table.Row key={scoreRow.title} className={scoreRow.class}>
                      <Table.Cell className="score">{scoreRow.title}</Table.Cell>
                      {scoreRow.cols.map(userCell =>
                        <Table.Cell key={userCell.key} className={userCell.class}>
                          {userCell.content}
                        </Table.Cell>
                      )}
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>

            </Grid.Column>
          </Grid>

        )
    }
}

export default Scoreboard;

function isInteger(nr) {
  return nr === parseInt(nr, 10)
}
