import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-modal-new-region',
  templateUrl: './modal-new-region.page.html',
  styleUrls: ['./modal-new-region.page.scss'],
})
export class ModalNewRegionPage implements OnInit {

  currencies;
  countries
  aux_country;
  aux_currency;
  aux_price;
  aux_commission_currency;
  aux_commission;
  aux_stock;
  aux_regions: Array<any>;

  constructor(private countrySrv:CountriesService, private modalCtrl:ModalController) {
    this.aux_regions= new Array();
    this.countrySrv.getCurrencies().subscribe((currencies_data)=>{
      this.currencies = currencies_data;
      console.log(currencies_data);
    })
      this.countrySrv.getCountries().subscribe((c)=>{
        this.countries= c;
        console.log(c);
      })
   }

   addRegion()
  {
    console.log({
      "region": this.aux_country,
      "price_currency": this.aux_currency,
      "price":this.aux_price,
      "commission_currency": this.aux_commission_currency,
      "commission": this.aux_commission,
      "stock": this.aux_stock
    });
    this.aux_regions.push({
      "region": this.aux_country,
      "price_currency": this.aux_currency,
      "price":this.aux_price,
      "commission_currency": this.aux_commission_currency,
      "commission": this.aux_commission,
      "stock": this.aux_stock
    });
    
    this.dismissModal();
  }


  dismissModal()
  {
    this.modalCtrl.dismiss({
      "result":{
        "region": this.aux_country,
        "price_currency": this.aux_currency,
        "price":this.aux_price,
        "commission_currency": this.aux_commission_currency,
        "commission": this.aux_commission,
        "stock": this.aux_stock
      },
      'dismissed': true
    })
  }

  ngOnInit() {
  }

}
