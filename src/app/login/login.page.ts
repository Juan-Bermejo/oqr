import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from '../clases/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  login()
  {
    
    let user= new User();
    user.id=1;
    user.name="Ricardo";
    user.last_name="Ruben";
    user.email="richardruben@gmail.com";
    user.password="111";
    user.phone=1150648978;
    user.role="seller";
    localStorage.setItem("user", JSON.stringify(user));
    

    this.navCtrl.navigateRoot('home');

  }

  ngOnInit() {
  }

}
