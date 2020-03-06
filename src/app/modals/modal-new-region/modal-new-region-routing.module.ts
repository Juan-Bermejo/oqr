import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalNewRegionPage } from './modal-new-region.page';

const routes: Routes = [
  {
    path: '',
    component: ModalNewRegionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalNewRegionPageRoutingModule {}
