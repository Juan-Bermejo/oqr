import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellerShopPageRoutingModule } from './seller-shop-routing.module';

import { SellerShopPage } from './seller-shop.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellerShopPageRoutingModule
  ],
  declarations: [SellerShopPage]
})
export class SellerShopPageModule {}
