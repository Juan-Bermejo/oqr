import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  logged: Boolean = false;

  constructor(private navCtrl: NavController, private afAuth: AngularFireAuth, private authService: AuthService) { }

  login()
  {
    this.navCtrl.navigateRoot('home');

  }

  onLoginGoogle(): void {

    this.authService.loginGoogleUser()
    .then( (res) => {

      this.logged = true;
      this.navCtrl.navigateRoot('home');

    }).catch (err => console.log('err', err));
  }

  onLoginFacebook(): void {

    this.authService.loginFacebookUser()
    .then( (res) => {

      this.logged = true;
      this.navCtrl.navigateRoot('home');

    }).catch (err => console.log('err', err));
  }

  register_page() {
    this.navCtrl.navigateRoot('register');
  }

  ngOnInit() {
  }

}
