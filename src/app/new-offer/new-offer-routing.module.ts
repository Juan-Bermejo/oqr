import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewOfferPage } from './new-offer.page';
import { ComponentModule } from '../componentes/component/component.module';

const routes: Routes = [
  {
    path: '',
    component: NewOfferPage
  }
];

@NgModule({
  imports: [
    ComponentModule,
    RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewOfferPageRoutingModule {}
