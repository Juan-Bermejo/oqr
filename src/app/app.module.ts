import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
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

import { AddLocationPageModule } from './modals/add-location/add-location.module';
import { ModalCategoriesPageModule } from './modals/modal-categories/modal-categories.module';
import { ModalNewRegionPageModule } from './modals/modal-new-region/modal-new-region.module';
import { ModalSimplePageModule } from './modals/modal-simple/modal-simple.module';
import { PopOverProductsComponent } from './componentes/pop-over-products/pop-over-products.component';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { AddProductPageModule } from './modals/add-product/add-product.module';
import { ZBar } from '@ionic-native/zbar/ngx';
//import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';



@NgModule({
  declarations: [AppComponent, ScrollbarStyleDirective],
  entryComponents: [PopOverProductsComponent],
  imports: [BrowserModule,
     IonicModule.forRoot(), 
     AppRoutingModule, 
     ModalCategoriesPageModule,
     ModalNewRegionPageModule,
     AddLocationPageModule,
     AddProductPageModule,
     ModalSimplePageModule,
     AngularFireModule.initializeApp(environment.firebaseConfig),
     AngularFireDatabaseModule,
     AngularFireAuthModule,
     ComponentModule,
     HttpClientModule
     
    ],
  providers: [
    StatusBar,
    SplashScreen,
    MarkerManager,
    GoogleMapsAPIWrapper,
    Geolocation,
    HttpClient,
   // BarcodeScanner,
   ZBar,
    NativeGeocoder,
    StreamingMedia,
    AngularFireAuth,
    GooglePlus,
    Facebook,
    
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
