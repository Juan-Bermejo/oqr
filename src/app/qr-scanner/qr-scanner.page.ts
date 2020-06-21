import { Component, OnInit } from '@angular/core';
import { ZBar, ZBarOptions } from '@ionic-native/zbar/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {

  constructor(private zbar: ZBar,private router :Router, private dbService: DbService) { }

  goTo(seller_id)
  {
    this.router.navigateByUrl('seller-shop/' + seller_id);
  }


  async readBarcode()
  {
 
    let options: ZBarOptions = {
      flash: 'off',
      drawSight: false,
      text_instructions:"Coloque el codigo en el lector.",
      text_title:"Lector de codigo de barras."
      
    }



     this.zbar.scan(options)
   .then(result => {
      console.log(result); // Scanned code
     
      
      this.dbService.getVendorById(result.toString()).toPromise()
      .then((data:any)=>
    {


        this.router.navigateByUrl('seller-shop/' + result);
       
    })
    .catch((err)=>
  {
    const toast = document.createElement('ion-toast');
    toast.message = 'Código invalido.';
    toast.duration = 3000;
    toast.position = "top";
    document.body.appendChild(toast);
    return toast.present(); 
  })
   })
   .catch((error:any) => {
      console.log(error); // Error message
      const toast = document.createElement('ion-toast');
      toast.message = 'No se pudo leer el código.';
      toast.duration = 3000;
      toast.position = "top";
      document.body.appendChild(toast);
      return toast.present(); 
    })
  
  }

  ngOnInit() {
  }

}
