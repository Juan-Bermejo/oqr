import { Component, OnInit } from '@angular/core';

import { DbService } from '../services/db.service';
import { NgForm } from '@angular/forms';
import { User } from '../clases/user';
import { ToastController } from '@ionic/angular';

import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AuthService } from '../services/auth.service'; 
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private navCtrl: NavController, 
              private afAuth: AngularFireAuth, 
              private authService: AuthService,
              public dbService: DbService) { }

  public email: string = '';
  public password: string = '';

  ngOnInit() {
  }

  to_login_page() {
    this.navCtrl.navigateRoot('login');
  }
  to_home_page(){
    this.navCtrl.navigateRoot('home');
  }

  /*onAddUser() {
    this.authService.registerUser(this.email, this.password)
    .then((res) => {
      this.navCtrl.navigateRoot('home');
    }).catch( err => console.log('err', err.message));
  }*/

  createUser(form: NgForm) {
    
    // if(form.value._id){
      
    // }
    this.dbService.addUser(form.value)
      .subscribe(res => {
        if(res) {
          this.resetForm(form);
          const toast = document.createElement('ion-toast');
          toast.message = 'Registro exitoso!';
          toast.duration = 2000;
          document.body.appendChild(toast);
          this.dbService.is_logged = true;
          this.to_login_page();
          return toast.present();
          
        }
        else {
          alert('error'); 
        }
      });

  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.dbService.selectedUser = new User();
    }
  }

  alert_and() {
    alert('aca llego');
  }

}
