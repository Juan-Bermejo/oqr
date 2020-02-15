import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ScrollbarStyleDirective } from './scrollbar-style.directive';
import { ModalCategoriesPageModule } from './modal-categories/modal-categories.module';
import { AgmCoreModule, MarkerManager, GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FilterPipe } from './filter.pipe';
import { PipesModuleModule } from './pipes-module/pipes-module.module';


@NgModule({
  declarations: [AppComponent, ScrollbarStyleDirective],
  entryComponents: [],
  imports: [BrowserModule,
     IonicModule.forRoot(), 
     AppRoutingModule, 
     ModalCategoriesPageModule
     
    ],
  providers: [
    StatusBar,
    SplashScreen,
    MarkerManager,
    GoogleMapsAPIWrapper,
    Geolocation,
    
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
