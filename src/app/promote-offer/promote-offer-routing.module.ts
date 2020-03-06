import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PromoteOfferPage } from './promote-offer.page';

const routes: Routes = [
  {
    path: '',
    component: PromoteOfferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PromoteOfferPageRoutingModule {}
