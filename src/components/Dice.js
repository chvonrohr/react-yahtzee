import React, { Component } from 'react'
 
class Dice extends Component {

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
    }

    diceImageUrl() {
        return '/images/dice/dice'+this.props.nr+'.svg';
    }

    render() {
        return (
            <button
                className={this.props.isLocked ? 'dice dice-locked' : 'dice'} 
                onClick={this.props.onClick}
            >
                <img src={this.diceImageUrl()} alt="" />
            </button>
        )
    }
}
 
export default Dice