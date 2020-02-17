import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellerPanelPage } from './seller-panel.page';

const routes: Routes = [
  {
    path: '',
    component: SellerPanelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerPanelPageRoutingModule {}
