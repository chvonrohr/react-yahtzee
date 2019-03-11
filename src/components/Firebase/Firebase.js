import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/functions';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    console.log(config, 'config');
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
    this.functions = app.functions();
  }


  // *** User API ***

  // user = uid => this.db.ref(`users/${uid}`);

  // users = () => this.db.ref('users');

  // *** Auth API ***

  // doCreateUserWithEmailAndPassword = (email, password) =>
  //   this.auth.createUserWithEmailAndPassword(email, password);

  // doSignInWithEmailAndPassword = (email, password) =>
  //   this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithAnonymousUser = () =>
    this.auth.signInAnonymously()

  doSignOut = () => this.auth.signOut();

  // doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  // doPasswordUpdate = password =>
  //   this.auth.currentUser.updatePassword(password);

  joinGame = () => {
    //https://firebase.google.com/docs/functions/callable
    return this.functions.httpsCallable('joinGame')({ /* submit data */ });

  }

  game = id => {
    console.log(`games/${id}`, 'try mount');
    return this.db.ref(`games/${id}`);//.child('object');
    // return this.db.ref(`games/${id}`);//.child('object');
  }
  getGame = (gameId) => {
    return this.db.ref('games/'+gameId).child('object');
    // return this.db.ref().child('games2/'+gameId);
  }

}

export default Firebase;
