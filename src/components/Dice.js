import React, { Component } from 'react'
import styled, {keyframes} from 'styled-components'

const shake = keyframes`
  10%, 90% { transform: rotate(30deg); }
  20%, 80% { transform: rotate(135deg); }
  30%, 50%, 70% { transform: rotate(125deg); }
  40%, 60% { transform: roatate(45deg); }
`

const DiceButton = styled.button`
  display: inline-block;
  margin-right: 10px;
  border: none;
  background: none;
  outline: none;
  cursor: pointer;
  opacity: ${props => props.isLocked ? 0.5 : 1};

  animation-name: ${props => (props.rolling && !props.isLocked) ? shake : 'none'};
  animation-duration: 500ms;
  animation-iteration-count: infinite;
  animation-delay: ${props => props.animationDelay};
`
class Dice extends Component {

    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
      this.animationDelay = (-1)*(Math.floor(Math.random()*700) + 300) + 'ms';
    }

    diceImageUrl() {
        return '/images/dice/dice'+this.props.nr+'.svg';
    }

    render() {
        return (
          <DiceButton
            isLocked={this.props.isLocked}
            onClick={this.props.onClick}
            rolling={this.props.rolling}
            disabled={this.props.rolling}
            animationDelay={this.animationDelay}
          >
            <img src={this.diceImageUrl()} alt="" />
          </DiceButton>
        )
    }
}

export default Dice
