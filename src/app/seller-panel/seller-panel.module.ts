import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SellerPanelPageRoutingModule } from './seller-panel-routing.module';

import { SellerPanelPage } from './seller-panel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SellerPanelPageRoutingModule
  ],
  declarations: [SellerPanelPage]
})
export class SellerPanelPageModule {}
