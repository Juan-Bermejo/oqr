import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../../clases/user';
import { NavController, MenuController, Platform, ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { DbService } from '../../services/db.service';
import { TokenService } from '../../services/token.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  logged: Boolean = false;
  user : Observable<firebase.User>;
  user_token:User;
  data_token:any;
  spinner:boolean= false;

  constructor(private navCtrl: NavController, 
              private menu: MenuController,
              private afAuth: AngularFireAuth, 
              private authService: AuthService, 
              private platform: Platform,
              private googlePlus: GooglePlus,
              private facebook: Facebook,
              public dbService: DbService,
              private builder: FormBuilder,
              private modalCtrl: ModalController,
              private tokenServ: TokenService) { }

  private anyErrors: string = '';

  user_name = new FormControl('', [
    Validators.required
  ]);
  password = new FormControl('', [
    Validators.required
  ]);



  registroForm: FormGroup = this.builder.group({
    user_name: this.user_name,
    password: this.password,
  });

  ngOnInit() {

    this.platform.ready().then(() => {
      // 'hybrid' detects both Cordova and Capacitor
      if (this.platform.is('hybrid')) { } 
      else { }
    });
  }

  ionViewWillEnter(){
    this.dbService.is_logged = false;
    this.dbService.user_data = null;
  }

  loginRedirect() {
    this.navCtrl.navigateRoot('home');
   
  }

  onLogin() {
    this.spinner=true;
    setTimeout(() => {

      this.dbService.checkLogin(this.user_name.value, this.password.value)
      .subscribe((data: any) => {
        console.log(data)
        if(data.status == 200) {

      
          localStorage.setItem("token", data.token);
       
          this.data_token = this.tokenServ.GetPayLoad();
          console.log(this.data_token)
          console.log(this.data_token.doc)
          this.user_token = this.data_token.doc;
            this.dbService.is_logged = true;
            this.dbService.user_id = this.user_token._id;
            this.dbService.user_data = this.user_token;
            
         
            this.dbService.setLogged(true);
            this.registroForm.reset();
            this.dbService.checkIsVendor(this.user_token._id).subscribe((dataSeller:any)=>
          { console.log(dataSeller)
            if(dataSeller.vendor_data._id)
            {
              this.dbService.setIsSeller$(true);
            }
            else{
              this.dbService.setIsSeller$(false);
            }
          })
  
          this.dbService.getInfluencerByUser(this.user_token._id).subscribe((dataInfluencer: any)=>
        {
          console.log("Is_ influencer", dataInfluencer)
  
          if(dataInfluencer.influencer_data)
          {
            this.dbService.setIsInfluencer$(true);
          }
          else{
            this.dbService.setIsInfluencer$(false);
          }
        })
         
          //this.loginRedirect();
          this.dismissModal();
          this.spinner= false;

        }

        if(data.status == 401) {
          const toast = document.createElement('ion-toast');
          toast.message = 'Usuario o contraseña incorrecto';
          toast.duration = 2000;
          document.body.appendChild(toast);
          this.spinner= false;
          return toast.present(); 
        }
      });
      
    }, 1000);
  

    // this.authService.loginEmailUser(this.email, this.password)
    //   .then( (res) => {

    //     this.dbService.checkLogin(res);
    //     this.loginRedirect();

    //   }).catch ((err) => {
    //     this.anyErrors = err;
    //   });
  }

  onLoginGoogle(): void {

    let user_reg= new User();

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

          let data = res.user.displayName.split(" ");
          user_reg.name = data[0];
          user_reg.last_name = data[data.length - 1];
          user_reg.user_name = res.user.email;
          user_reg.email = res.user.email;
          user_reg.password = ".";
          user_reg.phone = Math.random()*100000;
          
          this.dbService.googleLogin(user_reg).subscribe((data: any) => {
            if(data.status == 201) {

              this.dbService.setLogged(true);
              this.dbService.user_id = data.user_data._id;
              this.dbService.user_data = data.user_data;

              this.loginRedirect();
            }
    
            if(data.status == 401) {}
          });

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

  async directLoginOne(){
    this.spinner=true;
    setTimeout(async () => {

      await this.dbService.checkLogin("amorelli", "1111")
      .subscribe(async (data: any) => {
        console.log(data)
        if(data.status == 200) {

        localStorage.setItem("token", data.token);
       
        this.data_token = this.tokenServ.GetPayLoad();
        console.log(this.data_token)
        console.log(this.data_token.doc)
        this.user_token = this.data_token.doc;
          this.dbService.is_logged = true;
          this.dbService.user_id = this.user_token._id;
          this.dbService.user_data = this.user_token;
          
       
          this.dbService.setLogged(true);
          this.registroForm.reset();
       await   this.dbService.checkIsVendor(this.user_token._id).subscribe((dataSeller:any)=>
        { console.log(dataSeller)
          if(dataSeller.vendor_data._id)
          {
            this.dbService.setIsSeller$(true);
          }
          else{
            this.dbService.setIsSeller$(false);
          }
        })

      await  this.dbService.getInfluencerByUser(this.user_token._id).subscribe((dataInfluencer: any)=>
      {
        console.log("Is_ influencer", dataInfluencer)

        if(dataInfluencer.influencer_data)
        {
          this.dbService.setIsInfluencer$(true);
        }
        else{
          this.dbService.setIsInfluencer$(false);
        }
      })
         
         // this.loginRedirect();
         this.dismissModal();
         this.spinner= false;

        }

        if(data.status == 401) {
          const toast = document.createElement('ion-toast');
          toast.message = 'Usuario o contraseña incorrecto';
          toast.duration = 2000;
          document.body.appendChild(toast);
          this.spinner= false;
          return toast.present(); 
        }
      });
      
    }, 1000);
  
  }

  directLoginTwo(){
    this.dbService.checkLogin('super01', '123')
      .subscribe((data: any) => {
        if(data.status == 200) {

          //this.dbService.user_id = data.id_user;
          this.dbService.is_logged = true;
          this.dbService.user_id = data.user_data._id;
          this.dbService.user_data = data.user_data;
          this.dbService.setLogged(true);
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
  }

  register_page() {
    
    this.navCtrl.navigateRoot('register').then(()=>
  {
    this.dismissModal()
  })
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
    }
  }

  ionViewDidEnter()
  {
    this.menu.enable(false);
  }

  ionViewWillLeave()
  {
    this.menu.enable(true);
  }


  dismissModal()
  {
    
    this.modalCtrl.dismiss({

      'dismissed': true
    })
  }


}
