import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SellerPanelPageRoutingModule } from './seller-panel-routing.module';

import { SellerPanelPage } from './seller-panel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    IonicModule,
    SellerPanelPageRoutingModule
  ],
  declarations: [SellerPanelPage]
})
export class SellerPanelPageModule {}
