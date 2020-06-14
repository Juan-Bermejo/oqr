import { Component, OnInit, ViewChild } from '@angular/core';
import { Seller } from '../clases/seller';
import { TokenService } from '../services/token.service';
import { DbService } from '../services/db.service';
import { User } from '../clases/user';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-qr-generator',
  templateUrl: './qr-generator.page.html',
  styleUrls: ['./qr-generator.page.scss'],
})
export class QrGeneratorPage implements OnInit {

  @ViewChild('qr', {static: true}) qr;

  seller: Seller;
  user: User;
  miQrText: string = "holis";
  a:any;
  b:HTMLCollection;
  urlImg:any;

  constructor( private token: TokenService, private dbs: DbService) {
  
 
   }

   ver()
   {
    this.a = document.getElementsByTagName('qrcode');
    this.urlImg = this.a[0].children[0].children[0].src
   
    console.log(this.a[0].children[0].children[0].src)
   }

  qrGenerator()
  {
    this.miQrText = "hola mundo";
  }

  ionViewWillEnter()
  {
    this.user = this.token.GetPayLoad().doc;
    this.dbs.checkIsVendor(this.user._id).toPromise().then((data:any)=>
  {
    this.seller= data.vendor_data;
    this.miQrText = "ofertacerca.com/#/seller-shop/" + this.seller._id;
  })
  }

  ngOnInit() {
  }

}
