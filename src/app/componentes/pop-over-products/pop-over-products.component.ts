import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-pop-over-products',
  templateUrl: './pop-over-products.component.html',
  styleUrls: ['./pop-over-products.component.scss'],
})
export class PopOverProductsComponent implements OnInit {

  list_products= ["Producto", "Servicio"]

  constructor(public popoverController: PopoverController) { }

  dismissPop(selected)
  {
    this.popoverController.dismiss({
      "result":{
        "kind": selected
      },
      'dismissed': true
    })
  }



  ngOnInit() {}

}
