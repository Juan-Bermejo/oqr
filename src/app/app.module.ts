import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ScrollbarStyleDirective } from './scrollbar-style.directive';

import { AgmCoreModule, MarkerManager, GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FilterPipe } from './filter.pipe';
import { PipesModuleModule } from './pipes-module/pipes-module.module';
import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { ComponentModule } from './componentes/component/component.module';
import { MenuService } from './services/menu.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Validators, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddLocationPageModule } from './modals/add-location/add-location.module';
import { ModalCategoriesPageModule } from './modals/modal-categories/modal-categories.module';
import { ModalNewRegionPageModule } from './modals/modal-new-region/modal-new-region.module';
import { ModalSimplePageModule } from './modals/modal-simple/modal-simple.module';
import { PopOverProductsComponent } from './componentes/pop-over-products/pop-over-products.component';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { AddProductPageModule } from './modals/add-product/add-product.module';
import { ZBar } from '@ionic-native/zbar/ngx';
import { SellerShopPageModule } from './seller-shop/seller-shop.module';
import { NewSellerComponent } from './componentes/new-seller/new-seller.component';
//import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { SelectRelatedProductsPageModule } from './modals/select-related-products/select-related-products.module';
import { InputCodeInfluencerComponent } from './componentes/input-code-influencer/input-code-influencer.component';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { GenerateCodeInfluencerComponent } from './componentes/generate-code-influencer/generate-code-influencer.component';
import { LoginComponent } from './componentes/login/login.component';
import { ImagePicker } from '@ionic-native/image-picker/ngx';


export function tokenGetter() {
  return localStorage.getItem('token');
}


@NgModule({
  declarations: [AppComponent, ScrollbarStyleDirective],
  entryComponents: [
    PopOverProductsComponent,
     NewSellerComponent, 
     InputCodeInfluencerComponent,
     GenerateCodeInfluencerComponent,
     LoginComponent],

  imports: [BrowserModule,
     IonicModule.forRoot(), 
     AppRoutingModule, 
     ModalCategoriesPageModule,
     SelectRelatedProductsPageModule,
     ModalNewRegionPageModule,
     AddLocationPageModule,
     AddProductPageModule,
     ModalSimplePageModule,
     AngularFireModule.initializeApp(environment.firebaseConfig),
     AngularFireDatabaseModule,
     AngularFireAuthModule,
     ComponentModule,
     HttpClientModule,
     SellerShopPageModule,
     FormsModule,
     ReactiveFormsModule,
     JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:3001'],
        blacklistedRoutes: ['localhost:3001/auth/']
      }
    }),
     
    ],
  providers: [
    StatusBar,
    SplashScreen,
    MarkerManager,
    GoogleMapsAPIWrapper,
    Geolocation,
    HttpClient,
    JwtHelperService,
    Deeplinks,
    OneSignal,
    ImagePicker,
   // BarcodeScanner,
    ZBar,
    NativeGeocoder,
    StreamingMedia,
    AngularFireAuth,
    GooglePlus,
    Facebook,
    InAppBrowser,
    
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
