import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'modal-categories',
    loadChildren: () => import('./modal-categories/modal-categories.module').then( m => m.ModalCategoriesPageModule)
  },
  {
    path: 'offer-details',
    loadChildren: () => import('./offer-details/offer-details.module').then( m => m.OfferDetailsPageModule)
  },
  {
    path: 'seller-panel',
    loadChildren: () => import('./seller-panel/seller-panel.module').then( m => m.SellerPanelPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
