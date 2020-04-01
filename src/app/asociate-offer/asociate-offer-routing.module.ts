import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsociateOfferPage } from './asociate-offer.page';

const routes: Routes = [
  {
    path: '',
    component: AsociateOfferPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsociateOfferPageRoutingModule {}
