import React, { Component } from 'react'
import { Header, Table } from 'semantic-ui-react'
import Scores from '../helpers/Scores'
 
class Scoreboard extends Component {

    // constructor(props) {
    //     super(props);
    // }

    // componentDidMount() {
    // }

    // diceImageUrl() {
    //     return '/images/dice/dice'+this.props.nr+'.svg';
    // }

    render() {
        const users = this.props.users;
        const numbers = this.props.dices.map(d => d.nr);

        const rows = Object.keys(users[0].scoreboard.scores).map(sKey => {
            return users.map((u, uNr) => {
                const scores = u.scoreboard.scores;
                const scoreFunc = Scores.find(s => s.name === sKey);
                const activeUser = (uNr === this.props.activeUser);

                let content = '';

                if (!activeUser ||
                    (scores[sKey] && scores[sKey] >=0)) {
                    content = scores[sKey] || '-';
                
                } else {
                    const possibleScore = scoreFunc.score(numbers);
                    content = (
                        <button onClick={() => this.props.setPoints(sKey)}>
                            {possibleScore}
                        </button>
                    )
                }

                return {
                    key: uNr+"/"+sKey,
                    scoreName: scoreFunc.title,
                    class: activeUser?'active':'',
                    content
                };
            });
        });

        // partly sum
        rows.splice(6,0, users.map(u => {
            return { key: u.name+"/partly", scoreName: 'Summe', content: (
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
            return { key: u.name+"/totalScore", scoreName: 'Total', content: (
                <span>{u.scoreboard.totalScore}</span>
            )}
        }));

        return (
            <Table basic='very' celled>
                <Table.Header>

                    <Table.Row>
                        <Table.HeaderCell className="score"></Table.HeaderCell>
                        {users.map(user =>
                            <Table.HeaderCell key={user.name} className="user-info">
                                <img src={user.avatar} className="avatar avatar-mini" alt="" />
                                <Header.Content>
                                    {user.name}
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