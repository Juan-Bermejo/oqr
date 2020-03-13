import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User, UserLogin} from '../clases/user';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AuthService } from '../services/auth.service'; 
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Facebook } from '@ionic-native/facebook/ngx';

import { DbService } from '../services/db.service';
import { NgForm } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { MenuService } from '../services/menu.service';


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
              private facebook: Facebook,
              public dbService: DbService,
              public menuService: MenuService) { }

  public user_name: string = '';
  public password: string = '';
  private anyErrors: string = '';

  ngOnInit() {

    this.platform.ready().then(() => {
      // 'hybrid' detects both Cordova and Capacitor
      if (this.platform.is('hybrid')) { } 
      else { }
    });
  }

  ionViewWillEnter(){
    this.dbService.is_logged = false;
  }

  loginRedirect()
  {
    
    /*let user= new User();
    user.name="Ricardo";
    user.last_name="Ruben";
    user.email="richardruben@gmail.com";
    user.password="111";
    user.phone=1150648978;
    user.role="seller";
    localStorage.setItem("user", JSON.stringify(user));*/
    

    this.navCtrl.navigateRoot('home');
  }

  onLogin(form_log: NgForm) {
    this.dbService.checkLogin(this.user_name, this.password)
      .subscribe((data: any) => {
        if(data.status == 200) {

          this.resetForm(form_log);
          this.dbService.user_id = data.id_user;
          this.dbService.is_logged = true;
          this.loginRedirect();

        }

        if(data.status == 401) {
          const toast = document.createElement('ion-toast');
          toast.message = 'Usuario o contraseña incorrecto';
          toast.duration = 2000;
          document.body.appendChild(toast);
          return toast.present(); 
        }
      });

    // this.authService.loginEmailUser(this.email, this.password)
    //   .then( (res) => {

    //     this.dbService.checkLogin(res);
    //     this.loginRedirect();

    //   }).catch ((err) => {
    //     this.anyErrors = err;
    //   });
  }

  onLoginGoogle(): void {

    // 'hybrid' detects both Cordova and Capacitor
    if (this.platform.is('hybrid')) {
      this.googlePlus.login({})
        .then(res => {

        })
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

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
    }
  }

}
