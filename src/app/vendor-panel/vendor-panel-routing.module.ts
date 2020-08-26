import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorPanelPage } from './vendor-panel.page';

const routes: Routes = [
  {
    path: '',
    component: VendorPanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorPanelPageRoutingModule {}
