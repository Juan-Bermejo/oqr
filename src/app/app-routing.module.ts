import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { 
  AuthGuardService as AuthGuard 
} from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
  
},
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
   // canActivate:[AuthGuard]
    
  },
  {
    path: 'modal-categories',
    loadChildren: () => import('./modals/modal-categories/modal-categories.module').then( m => m.ModalCategoriesPageModule)
  },
  {
    path: 'offer-details/:offer',
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
  {
    path: 'my-account',
    loadChildren: () => import('./my-account/my-account.module').then( m => m.MyAccountPageModule)
  },
  {
    path: 'near-me',
    loadChildren: () => import('./near-me/near-me.module').then( m => m.NearMePageModule)
  },
  {
    path: 'new-home',
    loadChildren: () => import('./new-home/new-home.module').then( m => m.NewHomePageModule)
  },
  {
    path: 'billing-information',
    loadChildren: () => import('./billing-information/billing-information.module').then( m => m.BillingInformationPageModule)
  },
  {
    path: 'seller-shop/:seller', 
    loadChildren: () => import('./seller-shop/seller-shop.module').then( m => m.SellerShopPageModule)
  },
  {
    path: 'offer-list-asociate',
    loadChildren: () => import('./offer-list-asociate/offer-list-asociate.module').then( m => m.OfferListAsociatePageModule)
  },
  {
    path: 'asociate-offer/:offer',
    loadChildren: () => import('./asociate-offer/asociate-offer.module').then( m => m.AsociateOfferPageModule)
  },
  {
    path: 'pay-return', 
    loadChildren: () => import('./pay-return/pay-return.module').then( m => m.PayReturnPageModule)
  },
  {
    path: 'select-related-products',
    loadChildren: () => import('./modals/select-related-products/select-related-products.module').then( m => m.SelectRelatedProductsPageModule)
  },
  {
    path: 'canal-influencer',
    loadChildren: () => import('./canal-influencer/canal-influencer.module').then( m => m.CanalInfluencerPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'offer-influencers/:offer',
    loadChildren: () => import('./offer-influencers/offer-influencers.module').then( m => m.OfferInfluencersPageModule)
  },
  {
    path: 'orders/:seller',
    loadChildren: () => import('./orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'qr-generator',
    loadChildren: () => import('./qr-generator/qr-generator.module').then( m => m.QrGeneratorPageModule)
  },
  {
    path: 'qr-scanner',
    loadChildren: () => import('./qr-scanner/qr-scanner.module').then( m => m.QrScannerPageModule)
  },





];

@NgModule({
  imports: [
    
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    //RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
