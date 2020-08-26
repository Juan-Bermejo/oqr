import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DbService } from '../../services/db.service';
import { NgForm } from '@angular/forms';
import { User } from '../../clases/user';
import { ToastController } from '@ionic/angular';

import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { AuthService } from '../../services/auth.service'; 
import { GooglePlus } from '@ionic-native/google-plus';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
})
export class RegistroComponent implements OnInit {

 
  data_token: any;
  user_token: any;
  constructor(private navCtrl: NavController, 
              private afAuth: AngularFireAuth, 
              private authService: AuthService,
              private modalCtrl:ModalController,
              public dbService: DbService,
            private token: TokenService) { }

  public email: string = '';
  public password: string = '';


  ionViewWillEnter(){
    this.resetForm();
  }

  to_login_page() {
    this.navCtrl.navigateRoot('login');
  }
  to_home_page(){
    this.navCtrl.navigateRoot('home');
  }


  createUser(form: NgForm) {
    
    this.dbService.addUser(form.value)
      .subscribe((res:any) => {
        console.log(res)
        if(res.ok) {
          console.log(res)
          this.resetForm(form);
          const toast = document.createElement('ion-toast');
          toast.message = 'Registro exitoso!';
          toast.duration = 2000;
          document.body.appendChild(toast);
          this.dbService.is_logged = true;

          localStorage.setItem("token", res.token);
       
          this.data_token = this.token.GetPayLoad();

          this.user_token = this.data_token.usuario;
            this.dbService.is_logged = true;
            this.dbService.user_id = this.user_token._id;
            this.dbService.user_data = this.user_token;
            
         
            this.dbService.setLogged(true);
          
          this.to_home_page();
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



  dismissModal()
  {
    
    this.modalCtrl.dismiss({

      'dismissed': true
    })
  }


  ngOnInit()
  {

  }

}
