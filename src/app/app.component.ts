import { Component } from '@angular/core';

import { Platform, MenuController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DbService } from './services/db.service';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { HomePage } from './home/home.page';
import { LoginPage } from './login/login.page';
import { SellerShopPage } from './seller-shop/seller-shop.page';
import { PushNotificationsService } from './services/push-notifications.service';
import { NavParamsService } from './services/nav-params.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private dbservice: DbService,
    protected navController: NavController,
    protected deeplinks: Deeplinks,
    private pushService: PushNotificationsService,
    private navParams: NavParamsService
  ) {
    this.initializeApp();
    this.deeplinks.route({ //routeWithNavController(this.navController, {
         '': HomePage,
         '/seller-shop': SellerShopPage
       }
     ).subscribe(match => {

           // match.$route - the route we matched, which is the matched entry from the arguments to route()
            console.log(match.$args)
         switch(match.$link.path)
         {
           case '/seller-shop':
           this.navParams.param = {
            "offer": match.$args.offer,
            "seller": match.$args.seller
          }

          this.navController.navigateRoot('/seller-shop');
          break;
         }
         
        
           
           // match.$link - the full link data
           console.log('Successfully matched route', match);
         }, nomatch => {
           // nomatch.$link - the full link data
           console.error('Got a deeplink that didn\'t match', nomatch);
         });


  }



  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.pushService.configuracionInicial();
    });
  }

  
}
