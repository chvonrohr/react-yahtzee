// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
import Scores, { maxStraight } from './Scores';

it('basic: straight function', () => {
    expect(maxStraight([1,1,1,1,1])).toEqual(1);
    expect(maxStraight([1,2,5,3,4])).toEqual(5);
    expect(maxStraight([1,2,2,1,3,4])).toEqual(4);
    expect(maxStraight([1,2,3,1,2,3,4])).toEqual(4);
});

it('scores: full house', () => {
    let s = Scores.find(sc => (sc.name === 'fullhouse') );
    expect(s.score([1,1,1,1,1])).toEqual(0);
    expect(s.score([1,1,3,2,2])).toEqual(0);
    expect(s.score([1,2,1,2,1])).toEqual(25);
});

it('scores: small straight', () => {
    let s = Scores.find(sc => (sc.name === 'smallstraight') );
    expect(s.score([1,3,2,2,1])).toEqual(0);
    expect(s.score([1,6,2,5,3])).toEqual(0);
    expect(s.score([1,2,5,3,4])).toEqual(30);
    expect(s.score([2,3,4,5,6])).toEqual(30);
});

it('scores: large straight', () => {
    let s = Scores.find(sc => (sc.name === 'largestraight') );
    expect(s.score([1,2,3,4,4])).toEqual(0);
    expect(s.score([1,2,3,4,6])).toEqual(0);
    expect(s.score([1,2,3,4,5])).toEqual(40);
    expect(s.score([2,3,4,5,6])).toEqual(40);
});

