import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCategoriesPage } from './modal-categories.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCategoriesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCategoriesPageRoutingModule {}
