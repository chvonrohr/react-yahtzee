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

// const cors = require('cors')({origin: true});
// const database = require('firebase/database');
// const firebase = require('firebase/app'); // ?

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase); // ??


function snapToDataArray(snapshot) {
  const vals = [];
  snapshot.forEach(s => {
    console.log(s, 's data found');
    vals.push(Object.assign({}, s.val(), { _key: s.key }));
  });
  return vals;
}
function snapToArray(snapshot) {
  const vals = [];
  snapshot.forEach(s => {
    // console.log(s, 's found');
    vals.push(s);
  });
  return vals;
}

/**
 * FUNCTIONS
 */

const createGame = (userId => {
  // const await user = admin.firestore.collection('users').doc(userId).get();
  const users = userId ? [userId] : [];
  const game = {
    state: 'starting', //'starting', 'playing', 'end'
    players: users,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    activePlayer: null,
  };
  console.log(game, 'created game');
  return admin.firestore().collection('games').add(game);
})

// exports.joinGame = functions.https.onRequest((req, res) => {
exports.joinGame = functions.https.onCall((data, context) => { //https://firebase.google.com/docs/functions/callable

  // auth
  // if (!context.auth) return {status: 'error', code: 401, message: 'Not signed in'};
  // const userId = context.auth.uid;

  // local debug
  const userId = 'xyz';
  let finalGame = null;

  // TODO: create player entry (nickname, avatardetails, scores, )

  // search for open game ()
  return admin.firestore().collection('games')
    .where('state','==','starting').get()
    .then(snap => { // 1. find game (or create)
      if (!snap.empty) {
        const foundGame = snapToArray(snap)[0];
        console.log(foundGame, 'found game');
        return new Promise(resolve => { resolve(foundGame); });
      }

      return createGame(userId);
    })
    .then(game => { // 2. create player from data and add to game
      console.log(game, 'game 2.'); // = QueryDocumentSnapshot -> data/get(xy)
      const players = game.get('players') || [];
      players.push(userId); // add user
      console.log(players, 'players');
      finalGame = game;
      // return game.set({users: [ new Set(...users) ]}); // unique users
      // return admin.firestore().doc('games/' + game.id).set({ players });

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
