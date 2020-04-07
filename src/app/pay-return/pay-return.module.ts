import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PayReturnPageRoutingModule } from './pay-return-routing.module';

import { PayReturnPage } from './pay-return.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PayReturnPageRoutingModule
  ],
  declarations: [PayReturnPage]
})
export class PayReturnPageModule {}
