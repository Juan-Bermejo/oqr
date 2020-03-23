import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillingInformationPage } from './billing-information.page';

const routes: Routes = [
  {
    path: '',
    component: BillingInformationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingInformationPageRoutingModule {}
