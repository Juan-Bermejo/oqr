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
    loadChildren: () => import('./modals/modal-categories/modal-categories.module').then( m => m.ModalCategoriesPageModule)
  },
  {
    path: 'offer-details',
    loadChildren: () => import('./offer-details/offer-details.module').then( m => m.OfferDetailsPageModule)
  },
  {
    path: 'seller-panel',
    loadChildren: () => import('./seller-panel/seller-panel.module').then( m => m.SellerPanelPageModule)
  },
  {
    path: 'new-offer',
    loadChildren: () => import('./new-offer/new-offer.module').then( m => m.NewOfferPageModule)
  },
  {
    path: 'modal-new-region',
    loadChildren: () => import('./modals/modal-new-region/modal-new-region.module').then( m => m.ModalNewRegionPageModule)
  },
  {
    path: 'add-product',
    loadChildren: () => import('./modals/add-product/add-product.module').then( m => m.AddProductPageModule)
  },
  {
    path: 'add-location',
    loadChildren: () => import('./modals/add-location/add-location.module').then( m => m.AddLocationPageModule)
  },
  {
    path: 'modal-simple',
    loadChildren: () => import('./modals/modal-simple/modal-simple.module').then( m => m.ModalSimplePageModule)
  },
  {
    path: 'influencer-panel',
    loadChildren: () => import('./influencer-panel/influencer-panel.module').then( m => m.InfluencerPanelPageModule)
  },
  {
    path: 'offer-list-search',
    loadChildren: () => import('./offer-list-search/offer-list-search.module').then( m => m.OfferListSearchPageModule)
  },
  {
    path: 'promote-offer',
    loadChildren: () => import('./promote-offer/promote-offer.module').then( m => m.PromoteOfferPageModule)
  },
  {
    path: 'my-locations',
    loadChildren: () => import('./my-locations/my-locations.module').then( m => m.MyLocationsPageModule)
  },
  {
    path: 'related-products',
    loadChildren: () => import('./related-products/related-products.module').then( m => m.RelatedProductsPageModule)
  },
  {
    path: 'offer-videos',
    loadChildren: () => import('./offer-videos/offer-videos.module').then( m => m.OfferVideosPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'my-offers',
    loadChildren: () => import('./my-offers/my-offers.module').then( m => m.MyOffersPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
