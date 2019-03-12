// import Player from './playerdata'

/**
 * Cloud Functions
 *
 * @docs Basic: https://firebase.google.com/docs/functions/write-firebase-functions
 * @docs Run locally: https://firebase.google.com/docs/functions/local-emulator
 * @docs CORS https://github.com/firebase/functions-samples/blob/master/quickstarts/time-server/functions/index.js
 * @docs CORS https://cloud.google.com/functions/docs/writing/http#handling_cors_requests
 * @docs Firebase Query: https://firebase.google.com/docs/firestore/query-data/get-data
 * @docs Callable functions https://firebase.google.com/docs/functions/callable?authuser=0
 */

const functions = require('firebase-functions');
const Scores = require('./scores');
console.log(Scores, 'Scores class');

// const cors = require('cors')({origin: true});
// const database = require('firebase/database');
// const firebase = require('firebase/app'); // ?

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase); // ??

// snapshot to array helper
function snapToArray(snapshot) {
  const vals = [];
  snapshot.forEach(s => { vals.push(s); });
  return vals;
}

/**
 * HELPER FUNCTIONS
 */

function getRandom(arr) {
  const randIndex = Math.floor( Math.random() * arr.length );
  return arr[ randIndex ];
}

const createGame = (userId, playerName) => {
  // const await user = admin.firestore.collection('users').doc(userId).get();
  const users = [createPlayer(userId, playerName, {/* TODO AVATAR */})]
  const game = {
    state: 'starting', //'starting', 'playing', 'end'
    players: users,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),

    activePlayer: null, // game state (for active user)
    dices: null,
    remainingThrows: 3,
  };
  console.log(game, 'created game');
  return admin.firestore().collection('games').add(game).then(game => game.get());
}


const createPlayer = (userId, playerName /*, avatar*/) => {
  return {
    user: userId,
    name: playerName,
    avatar: {
      hair: getRandom(['NoHair','Eyepatch','Hat','Hijab','Turban','LongHairBigHair','LongHairBob','LongHairBun','LongHairCurly','LongHairCurvy','LongHairFrida','ShortHairDreads01','ShortHairFrizzle'])
    },
    scores: {
      ones: null,
      twos: null,
      threes: null,
      fours: null,
      fives: null,
      sixes: null,
      threeofakind: null,
      fourofakind: null,
      fullhouse: null,
      smallstraight: null,
      largestraight: null,
      chance: null,
      yahtzee: null,
    }
  }
}

const getRandomDices = (dices, keepDices)  => {
  keepDices = keepDices || [];
  dices = dices || Array(5).fill(1).map((_, i) => { return { id: i, nr: 1, isLocked: false }; });
  return dices.map(dice => {
    dice.isLocked = keepDices.includes(dice.id);
    if (!dice.isLocked) {
      dice.nr = Math.ceil(Math.random() * 5.99);
    }
    return dice;
  });
}

/**
 * CALLABLE FUNCTIONS
 */

 /**
  * JOIN GAME - search for starting game or start new one
  */
exports.joinGame = functions.https.onCall((data, context) => { //https://firebase.google.com/docs/functions/callable
  // exports.joinGame = functions.https.onRequest((req, res) => {

  // auth
  if (!context.auth) return {status: 'error', code: 401, message: 'Not signed in'};

  const userId = context.auth ? context.auth.uid : 'no-user-found';
  const playerName = data.playerName || 'Gago George';
  let finalGame = null;

  // OPTIONAL:
  // 1. search for running game for logged user

  // search for open game ()
  return admin.firestore().collection('games')
    .where('state', '==', 'starting')
    .get()
    .then(snap => { // 1. find game (or create)

      if (!snap.empty) {
        const foundGame = snapToArray(snap)[0];
        console.log(foundGame, 'found game');
        return new Promise(resolve => { resolve(foundGame); });
      }

      return createGame(userId, playerName);
    })
    .then(game => { // 2. create player from data and add to game
      console.log(game, 'game 2.'); // = QueryDocumentSnapshot -> data/get(xy)

      const players = game.get('players') || [];
      const playerExists = players.some(p => p.user === userId);

      if (!playerExists) {
        players.push( createPlayer(userId, playerName, {/* TODO AVATAR */}) );
      }

      console.log(players, 'players');
      finalGame = game;

      return  admin.firestore().doc('games/' + game.id).update({ players });
    })
    .then(writeRes => { // 3. send game

      console.log(finalGame, 'final game');
      return { gameId: finalGame.id };
    })
    .catch(error => {
      console.log("Error getting documents: ", error);
    });
});


/**
  * START GAME - start game
  */
exports.startGame = functions.https.onCall((data, context) => { //https://firebase.google.com/docs/functions/callable

  // auth
  if (!context.auth) return {status: 'error', code: 401, message: 'Not signed in'};

  if (!data.gameId) return {status: 'error', code: 500, message: 'No game passed'};

  return admin.firestore().doc('games/' + data.gameId).update({
    activePlayer: 0,
    state: 'running',
    dices: getRandomDices(),
    remainingThrows: 3
  });
});

/**
 * ROLL DICES - only for user which is active
 */
exports.rollDices = functions.https.onCall((data, context) => { //https://firebase.google.com/docs/functions/callable

  // auth
  if (!context.auth) return {status: 'error', code: 401, message: 'Not signed in'};
  const userId = context.auth ? context.auth.uid : 'no-user-found';

  const gameId = data.gameId;
  const keepDices = data.keepDices || [];

  if (!gameId) return {status: 'error', code: 500, message: 'No game passed'};

  return admin.firestore().doc('games/' + gameId).get().then( game => {

    if (!game) return {status: 'error', code: 500, message: 'No game found'};
    const gameData = game.data(); //game.get();

    // check active user is rolling
    if (gameData.players[ gameData.activePlayer ].user !== userId)
      return {status: 'error', code: 500, message: 'You are not at the row'};

    if (gameData.remainingThrows <= 0)
      return {status: 'error', code: 500, message: 'No throws remaining'}; // check remaining throws

    const totalThrows = gameData.remainingThrows || 3;
    const update = {
      dices: getRandomDices(gameData.dices, keepDices),
      remainingThrows: (totalThrows - 1)
    }

    return admin.firestore().doc('games/' + data.gameId).update(update);
  })
  .catch(e => {
    console.log(e, 'error in roll dices');
    return {status: 'error', code: 500, message: 'error during dice roll'};
  });

});


/**
 * ROLL DICES - only for user which is active
 */
exports.setPoints = functions.https.onCall((data, context) => { //https://firebase.google.com/docs/functions/callable

  // auth
  if (!context.auth) return {status: 'error', code: 401, message: 'Not signed in'};
  const userId = context.auth ? context.auth.uid : 'no-user-found';

  const gameId = data.gameId;
  const scoreKey = data.scoreKey;

  if (!gameId) return {status: 'error', code: 500, message: 'No game passed'};
  if (!scoreKey) return {status: 'error', code: 500, message: 'No scoreKey passed'};

  return admin.firestore().doc('games/' + gameId).get().then( game => {
    if (!game) return {status: 'error', code: 500, message: 'No game found'};

    const gameData = game.data();
    const activeUser = gameData.players[ gameData.activePlayer ];
    const activeUserId = gameData.players[ gameData.activePlayer ].user;

    if (activeUserId !== userId)
      return {status: 'error', code: 500, message: 'You are not at the row'};

    if (!activeUser.scores || activeUser.scores[scoreKey] !== null)
      return {status: 'error', code: 500, message: 'You cant set this scoreKey anymore'};

    // calculate score
    const ScoresHelper = new Scores();
    const diceNumbers = gameData.dices.map(d => d.nr);
    const diceScore = ScoresHelper.getPointsFor(scoreKey, diceNumbers);

    // update
    const updateData = gameData;
    updateData.players[gameData.activePlayer].scores[scoreKey] = diceScore; // set score
    updateData.activePlayer = (gameData.activePlayer + 1) % gameData.players.length; // next player
    updateData.remainingThrows = 3;
    updateData.dices = [];
    console.log(updateData, 'updateData');

    return admin.firestore().doc(`games/${data.gameId}`).update(updateData);
  })
  .catch(e => {
    console.log(e, 'error in roll dices');
  });

});



// * *  example: when a new xx is created  * *
//grab collection
// const createNotification = (notification => {
//   const database = admin.firestore.database();
//   return admin.firestore().collection('notifications')
//     .add(notification)
//     .then(doc => console.log('notification added ', doc))
// })
// // function
// exports.userCreated = functions.firestore
//  .document('user/{userId}')
//  .onCreate(doc => {
//     const user = doc.data();
//     const notification = {
//       content: 'Added a new project',
//       for: `${project.author} and so on`,
//       time: admin.firestore.FieldValue.serverTimestamp(),
//       // user: admin.firestore.FieldValue.
//       user:
//     admin
//    }
//    return createNotification(notification);
//  })

// Create and Deploy Your First Cloud Functions
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello chris!");
// });


 // * * WHEN onRequest (instead of onCall): * *
  // if (!uid) throw new functions.https.HttpsError('unauthenticated');
  // const user = admin.auth().getUser();
  // res.send(user);
  // return;

  // CORS
  // res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  // res.set('Access-Control-Allow-Credentials', 'true');

  // if (req.method === 'OPTIONS') {
  //   // Send response to OPTIONS requests
  //   res.set('Access-Control-Allow-Methods', 'GET');
  //   res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  //   res.set('Access-Control-Max-Age', '3600');
  //   res.status(204).send('');
  // }

  // res.set('Access-Control-Allow-Origin', '*');
  // res.set('Access-Control-Allow-Methods', 'GET, POST')
  // res.send({ data: game });
  // res.status(200).send({ data: game });
