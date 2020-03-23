import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillingInformationPageRoutingModule } from './billing-information-routing.module';

import { BillingInformationPage } from './billing-information.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillingInformationPageRoutingModule
  ],
  declarations: [BillingInformationPage]
})
export class BillingInformationPageModule {}
