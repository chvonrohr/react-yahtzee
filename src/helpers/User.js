import React from 'react'
import UserScoreboard from './UserScoreboard';
import Avatar from 'avataaars'

class User {

    constructor(userName) {
        this.scoreboard = new UserScoreboard();
        this.name = userName || '';
        this.isBot = false;

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

    // set name(name) {
    //     this.name = name;
    // }

    // get name() {
    //     return this.name;
    // }

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
}


function getRandom(arr) {
  const randIndex = Math.floor( Math.random() * arr.length );
  return arr[ randIndex ];
}

export default User;
