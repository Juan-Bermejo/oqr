import { Component, OnInit } from '@angular/core';
import { User } from '../clases/user';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  user:User;

  constructor() {
    this.user= JSON.parse(localStorage.getItem("user_data")) ;
   }

  ngOnInit() {
  }

}
