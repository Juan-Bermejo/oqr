import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-seller-panel',
  templateUrl: './seller-panel.page.html',
  styleUrls: ['./seller-panel.page.scss'],
})
export class SellerPanelPage implements OnInit {

  usrName:string="Usuario1";

  constructor() { }

  ngOnInit() {
  }

}
