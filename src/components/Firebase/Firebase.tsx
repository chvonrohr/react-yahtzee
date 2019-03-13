import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/firestore';
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

  auth: app.auth.Auth;
  firestore: app.firestore.Firestore;
  functions: app.functions.Functions;

  constructor() {
    // console.log(config, 'config');
    app.initializeApp(config);

    this.auth = app.auth();
    // this.db = app.database();
    this.firestore = app.firestore();
    this.functions = app.functions();
  }


  doSignInWithAnonymousUser = () =>
    this.auth.signInAnonymously()

  doSignOut = () => this.auth.signOut();

  game = (id : string) : app.firestore.DocumentReference => {
    return this.firestore.doc(`games/${id}`);
  }

  // https://firebase.google.com/docs/functions/callable
  joinGame = (playerName : string) : Promise<app.functions.HttpsCallableResult> => {
    return this.functions.httpsCallable('joinGame')({ playerName /* data */ });
  }

  startGame = (gameId : string) => {
    this.functions.httpsCallable('startGame')({ gameId /* data */ });
  }

  rollDices = (gameId : string, keepDices: Array<number>) => {
    this.functions.httpsCallable('rollDices')({ gameId, keepDices });
  }

  setPoints = (gameId : string, scoreKey: string) => {
    this.functions.httpsCallable('setPoints')({ gameId, scoreKey });
  }

}

export default Firebase;
