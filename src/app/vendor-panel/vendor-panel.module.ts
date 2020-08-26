import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VendorPanelPageRoutingModule } from './vendor-panel-routing.module';

import { VendorPanelPage } from './vendor-panel.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorPanelPageRoutingModule
  ],
  declarations: [VendorPanelPage]
})
export class VendorPanelPageModule {}
