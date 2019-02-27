

export function getRandomDices(dices) {
  dices = dices || Array(5).fill(1).map((_, i) => { return { id: i, nr: 1, isLocked: false }; });
  return dices.map(dice => {
    dice = Object.assign({}, dice); // clone
    if (!dice.isLocked) {
      dice.nr = Math.ceil(Math.random() * 5.99);
    }
    return dice;
  });
}
