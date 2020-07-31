import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OfferLandPangePage } from './offer-land-pange.page';

const routes: Routes = [
  {
    path: '',
    component: OfferLandPangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfferLandPangePageRoutingModule {}
