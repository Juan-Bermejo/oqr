import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalSimplePage } from './modal-simple.page';

const routes: Routes = [
  {
    path: '',
    component: ModalSimplePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalSimplePageRoutingModule {}
