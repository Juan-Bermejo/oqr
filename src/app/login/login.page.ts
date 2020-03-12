import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from '../clases/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user;
  constructor(private navCtrl: NavController) { 
    this.user= new User();
  }

  login()
  {

    this.navCtrl.navigateRoot('home');

  }

  ngOnInit() {
  }

}
