import React from 'react'
import UserScoreboard from './UserScoreboard'
import Avatar from 'avataaars'
import Scores from './Scores'

class User {

    constructor(userName, isBot) {
        this.scoreboard = new UserScoreboard();
        this.name = userName || '';
        this.isBot = isBot || false;

        const colors = ['Auburn','Black','Blonde','BlondeGolden','Brown','BrownDark','PastelPink','Platinum','Red','SilverGray'];
        this.avatarHair = getRandom(['NoHair','Eyepatch','Hat','Hijab','Turban','LongHairBigHair','LongHairBob','LongHairBun','LongHairCurly','LongHairCurvy','LongHairFrida','ShortHairDreads01','ShortHairFrizzle']);
        this.avatarHairColor = getRandom(colors);
        this.avatarAccessories = getRandom(['Blank','Kurt','Prescription02','Round','Sunglasses']);
        this.avatarFacialHair = getRandom(['Blank','BeardMedium','BeardLight','BeardMagestic','MoustaceFancy','MoustaceMagnum']);
        this.avatarFacialHairColor = this.avatarAccessories;
        this.avatarClothes = getRandom(['BlazerShirt','BlazerSweater','CollarSweater','GraphicShirt','Hoodie','Overall','ShirtCrewNeck','ShirtScoopNeck','ShirtVNeck']);
        this.avatarColorFabric = getRandom(['Black','Blue01','Blue02','Blue03','Gray01','Gray02','PastelBlue','PastelGreen','PastelYellow','PastelRed','Pink','Red']);
        // eyebrow
        this.avatarMouth = getRandom(['Concerned','Default','Disbelief','Eating','Grimace','Sad','ScreamOpen','Serious','Smile','Tongue','Twinkle','Vomit']);
        this.avatarSkin = getRandom(['Tanned','Yellow','Pale','Light','Brown','DarkBrown','Black']);


        // eyeType='WinkWacky'
        // eyebrowType='RaisedExcitedNatural'
    }

    get avatar() {
        //return 'https://api.adorable.io/avatars/285/' + this.name + '.png';
        //return 'http://i.pravatar.cc/300'
        return (
          <Avatar
            style={{width: '70px', height: '70px'}}
            avatarStyle='Circle'
            topType={this.avatarHair}
            accessoriesType={this.avatarAccessories}
            hairColor={this.avatarHairColor}
            facialHairType={this.avatarFacialHair}
            facialHairColor={this.avatarFacialHairColor}
            clotheType={this.avatarClothes}
            clotheColor={this.avatarColorFabric}
            mouthType={this.avatarMouth}
            skinColor={this.avatarSkin}
          />
        )
    }


    getBotDecision(remainThrows, dices) {

      const userScores = this.scoreboard.scores;
      const numbers = dices.map(d => d.nr);

      // KEEP [option dice-indexes to keep]
      if (remainThrows>0) {

        // keep most for identical TODO: that are needed!
        const best = getBestSame(numbers);
        let keepNrs = [];
        // if (best.n === 1) { // straight

        // } else { //
          keepNrs = dices.map((d, i) => d.nr===best.nr? i : null).filter(i => i!==null);
        // }
        return { cmd: 'KEEP', option: keepNrs }
      }


      // * LOGIC *

      // 1. - simple: just choose first available without rethrowing
      // 2. - search for highest score in without re-throwing dices
      // 3. -


      let maxPoints = 0;
      let maxName = null;

      for(let scoreName in userScores) {
        if (userScores[scoreName] === null) {
          let scoreFunc = Scores.find(s => scoreName===s.name);
          let scorePoints = scoreFunc.score(numbers);
          if (scorePoints > maxPoints || maxName === null) {
            console.log(scorePoints, `of ${scoreName} is higher`);
            maxName = scoreName;
            maxPoints = scorePoints;
          }
        }
      }

      console.log(maxName, 'take this');

      return { cmd: 'SELECT', option: maxName };
    }
}


function getBestSame(numbers) {
  const group = numbers.reduce((a,c) => {
    a[c] = a[c] ? a[c]+1 : 1;
    return a;
  }, {});

  return Object.keys(group).reduce((a,k) => (group[k] > a.n)? {nr:parseInt(k), n:group[k]} : a, { nr:0, n:0 });
}

function getRandom(arr) {
  const randIndex = Math.floor( Math.random() * arr.length );
  return arr[ randIndex ];
}

export default User;
