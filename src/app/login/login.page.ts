import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AuthService } from '../services/auth.service'; 
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Facebook } from '@ionic-native/facebook/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  logged: Boolean = false;
  user : Observable<firebase.User>;

  constructor(private navCtrl: NavController, 
              private afAuth: AngularFireAuth, 
              private authService: AuthService, 
              private platform: Platform,
              private googlePlus: GooglePlus,
              private facebook: Facebook) { }

  public email: string = '';
  public password: string = '';
  private anyErrors: string = '';

  ngOnInit() {

    this.platform.ready().then(() => {
      // 'hybrid' detects both Cordova and Capacitor
      if (this.platform.is('hybrid')) {

        alert('android');
      } 
      else {
        console.log('web');
      }
    });
  }

  loginRedirect()
  {
    this.logged = true;
    this.navCtrl.navigateRoot('home');

  }

  onLogin(): void {
    this.authService.loginEmailUser(this.email, this.password)
      .then( (res) => {

        this.loginRedirect();

      }).catch ((err) => {
        this.anyErrors = err;
      });
  }

  onLoginGoogle(): void {

    // 'hybrid' detects both Cordova and Capacitor
    if (this.platform.is('hybrid')) {
      this.googlePlus.login({})
        .then(res => alert(res))
        .catch(err => alert(err));
    } 

    else {
      this.authService.loginGoogleUser()
        .then( (res) => {
          console.log(res.user.displayName,res.user.email);
          this.loginRedirect();

        }).catch (err => console.log('err', err.message));
    }

  }

  onLoginFacebook(): void {

    if (this.platform.is('hybrid')) {
      this.facebook.login(['public_profile', 'email'])
        .then(res => console.log(res))
        .catch(err => console.error(err));
    }

    else{ 
      this.authService.loginFacebookUser()
        .then( (res) => {

          this.loginRedirect();

        }).catch(err => console.log('err', err.message));
  
    }
  }

  register_page() {
    this.navCtrl.navigateRoot('register');
  }

}
