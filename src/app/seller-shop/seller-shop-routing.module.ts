import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SellerShopPage } from './seller-shop.page';

const routes: Routes = [
  {
    path: '',
    component: SellerShopPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellerShopPageRoutingModule {}
