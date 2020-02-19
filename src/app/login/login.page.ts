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

  public email: string = '';
  public password: string = '';
  private anyErrors: string = '';

  ngOnInit() {

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

    this.authService.loginGoogleUser()
      .then( (res) => {

        this.loginRedirect();

      }).catch (err => console.log('err', err.message));
  }

  onLoginFacebook(): void {

    this.authService.loginFacebookUser()
      .then( (res) => {

        this.loginRedirect();

      }).catch(err => console.log('err', err.message));
  }

  register_page() {
    this.navCtrl.navigateRoot('register');
  }

}
