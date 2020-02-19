import { Injectable } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth) { }

  registerUser() {

  }

  loginEmailUser(email: string, pass: string) {
    
    return new Promise((resolve, reject) => {
      
      this.afAuth.auth.signInWithEmailAndPassword(email, pass)
      .then( userData => resolve(userData),
      err => reject (err));
    
    });
  
  }

  loginFacebookUser() {
    return this.afAuth.auth.signInWithPopup( new auth.FacebookAuthProvider());
    //this.navCtrl.navigateRoot('home');
  }

  loginGoogleUser() {
    return this.afAuth.auth.signInWithPopup( new auth.GoogleAuthProvider());
  }

  logOut() {
    return this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }
}


