import { Component, OnInit, ViewChild, NgZone, HostListener, Renderer, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, Platform, LoadingController, AlertController } from '@ionic/angular';
import { NavParamsService } from '../services/nav-params.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Product } from '../clases/product';
import { User } from '../clases/user';
import { Location } from '../clases/location';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';
import { SellerShopPage } from '../seller-shop/seller-shop.page';
import { Seller } from '../clases/seller';
import { AgmMap, MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { environment } from '../../environments/environment';
import * as Mapboxgl from 'mapbox-gl'
import { TokenService } from '../services/token.service';
import { LoadingComponent } from '../componentes/loading/loading.component';
import { BilleteraComponent } from '../componentes/billetera/billetera.component';
import { RegistroComponent } from '../componentes/registro/registro.component';
import { LoginComponent } from '../componentes/login/login.component';
import { MensajeComponent } from '../componentes/mensaje/mensaje.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { RespuestaReservaComponent } from '../componentes/respuesta-reserva/respuesta-reserva.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-offer',
  templateUrl: './offer.page.html',
  styleUrls: ['./offer.page.scss'],
})
export class OfferPage implements OnInit {



  qr_data: any;
  saldo: any;
  loading: boolean;
  influencer: any;
  user_data: any;
  locations_data: any;
  dataloc: any[];
  offerVendors: any;
  current_latitude: number;
  current_longitude: number;
  @ViewChild('AgmMap', { static: false }) AgmMap: AgmMap;

  offerId: string;
  map: Mapboxgl.Map;
  marker: Mapboxgl.Marker;
  is_my_offer: boolean = false;
  user: User;
  offer: Offer;
  latitude: number;
  longitude: number;
  mapType = 'roadmap';
  labelLayerId: any;
  layers: any;
  selectedMarker;
  markers: Array<any>;
  myLatLng;
  myLat;
  mylong;
  array_products: Product[];
  offerLocations: any[];
  offer_sellers: string[];
  my_offer: boolean = true;
  seller: Seller;
  is_seller: boolean;
  zoom: number;
  influencer_code:string;
  influencer_id: string;
  is_logged: boolean = false;
  selected_vendor: any;
  quantity: number = 1;
  urlImg:any;
  letterObj = {
    to: '',
    from: '',
    text: ''
  }
  pdfObj = null;


  constructor(private route: ActivatedRoute,
    private platform: Platform,
    public navCtrl: NavController,
    public paramSrv: NavParamsService,
    private alert: AlertController,
    private modal: ModalController,
    private router: Router,
    private geolocation: Geolocation,
    private dbService: DbService,
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private file: File, 
    private fileOpener: FileOpener,
    private tokenSrv: TokenService,
    private wrapper: ElementRef, private renderer: Renderer
  ) {

    this.markers = new Array<{}>();
    this.offerVendors = new Array<any>();
    this.locations_data = JSON.parse(localStorage.getItem("location_data"));


    if (document.URL.indexOf("/") > 0) {
      let splitURL = document.URL.split("/");
      this.offerId = splitURL[5].split("?")[0];
      this.influencer_id = splitURL[5].split("?")[1].split("=")[1];
      this.influencer_code = this.influencer_id;
      console.log(this.influencer_id)
    }

    this.dbService.getInfByCode(this.influencer_id).subscribe((data: any) => {
      console.log(data)
      if (data.ok) {
        this.influencer = data.influencer;
      }
    })


    this.dbService.getOffer(this.offerId).toPromise().then((data: any) => {
      this.offer = data.offer;
      console.log(data)
    })


    this.dbService.getOfferLocations(this.offerId, this.locations_data.town, this.locations_data.suburb).toPromise().then((dataLoc: any) => {

      for (let i = 0; i < dataLoc.vendors.length; i++) {

        this.addMarker(dataLoc.vendors[i]);
      }
    })
    this.getCurrentPosition();

    this.dbService.getLogged$().subscribe((logged_check) => {
      this.is_logged = logged_check;

      if (this.is_logged) {
        this.user = tokenSrv.GetPayLoad().usuario
        this.traerSaldo();

      }
      else {

      } this.user = null;

    })

    this.dbService.getIsSeller$().subscribe((data) => {
      this.is_seller = data;
    })

  }


  async toLogin() {
    const modal = await this.modalController.create({
      component: LoginComponent,
      cssClass: "modal-login"

    });
    modal.present();

    modal.onDidDismiss().then((data) => {



    })

  }

  async toRegistro() {
    const registroModal = await this.modalController.create(
      {
        component: RegistroComponent,
        cssClass: "registro-modal"
      }
    )

    registroModal.present();
  }

  goTo() {
    this.router.navigateByUrl("my-account")
  }

  async toBilletera() {
    const billeteraModal = await this.modalController.create(
      {
        component: BilleteraComponent,
        cssClass: "modal-billetera"

      }
    )

    billeteraModal.present()
    billeteraModal.onDidDismiss()
      .then(() => {

        this.traerSaldo();
      })

  }



  pago() {

    let json = {
      vendor_id: this.selected_vendor.vendor_data._id,
      influencer_id: null,
      influencer_code: null,
      offer_id: this.offer._id,
      quantity: this.quantity
    }

    if (this.influencer) {
      json.influencer_id = this.influencer._id;
      json.influencer_code = this.influencer.code;
    }

    console.log(json);

    this.dbService.reserveOffer(json).toPromise()
      .then(async (data: any) => {
        console.log(data);

        if (data.ok) {

      

          const mejsModal = await this.modal.create({
            component: RespuestaReservaComponent,
          })

          return await mejsModal.present().then(() => {
            this.downloadPdf(data.transaction);
          });
        }
        else {

          if (data.saldo === false) {
            const alertSaldo = await this.alert.create({
              header: "No tiene suficiente saldo en tu billetera.",
              message: "Por favor carga el saldo en tu billetera para finalizar la reserva."

            })
            return await alertSaldo.present();
          }
        }
        this.traerSaldo();
      })


  }


  getGeoLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.myLat = resp.coords.latitude;
      this.mylong = resp.coords.longitude;
      this.latitude = this.myLat;
      this.longitude = this.mylong;
      //this.addMarker(this.latitude, this.longitude);
      this.myLatLng = { lat: this.latitude, lng: this.longitude };

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }


  addMarker(data: any) {

    this.markers.push(
      {
        vendor_data: data.vendedor,
        location_data: data.location,

        //location: location,
        lat: data.location.latitude,
        lng: data.location.longitude,
        address: data.location.address,
        alpha: 1,
        sellerName: data.vendedor.shop_name,
        seller: data.vendedor._id,
        img: data.vendedor.profile_img
        // icon: "../../../assets/iconos/User-Blue-icon.png"
      });

  }


  ngOnInit() {
    //this.getCurrentPosition();


  }


  async traerSaldo() {
    this.dbService.getTransactions().toPromise().then((data: any) => {

      if (data.ok) {

        this.saldo = data.total;

      }

    })
  }



  async selectMarker(sellerId) {

    console.log("selected: ", this.seller)


    if (this.influencer_id) {
      this.router.navigateByUrl('offer-land-pange/' + this.offerId + '?seller=' + sellerId + '&influencer=' + this.influencer_id);
    }
    else {

      this.router.navigateByUrl('offer-land-pange/' + this.offerId + '?seller=' + sellerId);

    }


  }


  joinOffer() {
    this.paramSrv.param =
      {
        "offer": this.offer,
        "seller": this.seller
      }
    this.navCtrl.navigateRoot('asociate-offer');
  }

  ionViewWillEnter() {
    let data: any
    console.log(this.tokenSrv.GetPayLoad().usuario)

    if (localStorage.getItem("token")) {
       data = {
        user_id: this.tokenSrv.GetPayLoad().usuario._id,
        influencer_code: this.influencer_code,
        offer_id: this.offerId
      }

    }
    else {
       data = {
        user_id: null,
        influencer_code: this.influencer_id,
        offer_id: this.offerId
      }
    }
    if (localStorage.getItem("location_data")) {
      data.location = localStorage.getItem("location_data");
    }
    console.log(data);

    this.dbService.setView(data).toPromise().then((dataresponse: any) => {
      console.log(dataresponse);
    })
    .catch((err)=>
  {
    console.log("error en promise", err);
  })
  }



  async ngAfterViewInit() {

    const loading = await this.loadingCtrl.create(
      {
        duration: 2500,
        spinner: "crescent",
        message: "Cargando mapa..."
      }
    )

    loading.present();



    this.map = await new Mapboxgl.Map({
      accessToken: environment.mapBoxKey,
      style: 'mapbox://styles/mapbox/light-v10',
      //center: [this.current_longitude, this.current_latitude],
      center: [-58.5733844, -34.6154611],
      zoom: 13.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: false
    });





    await this.map.on('load', async () => {



      await this.markers.forEach(async (m) => {

        console.log(m);
        const div = window.document.createElement('div');

        if (m.vendor_data.profile_img) {
          div.innerHTML = " <ion-row> <img src='" + m.img + "'/> </ion-row>" +
            "<ion-row> <ion-col size=3> <img src='../../assets/images/delivery.png'/>  </ion-row>";
        }
        else {
          div.innerHTML = "<img src='../../assets/logoOfertaCerca/logoCelesteFondoBlanco.jpg'/>";
        }

        div.className = "img-seller";


        div.addEventListener('click', async () => {

          this.selectMarker(m.vendor_data.shop_name)
        })

        // let popup = new Mapboxgl.Popup()
        //         .setDOMContent(div);

        // const el = document.createElement('div');



        let marker = await new Mapboxgl.Marker()
          // .setPopup(popup)
          .setLngLat([m.location_data.longitude, m.location_data.latitude])
          .addTo(this.map)
        marker.getElement().addEventListener('click', () => {
          this.selected_vendor = m;
          this.setViewVendor(this.selected_vendor.vendor_data._id);
        })
        this.map.resize();

      })

      this.map.resize();


    })

    if (this.map.loaded) {
      await navigator.geolocation.getCurrentPosition(position => {
        this.current_longitude = position.coords.latitude;
        this.current_latitude = position.coords.longitude;

        this.map.setCenter(new Mapboxgl.LngLat(this.current_latitude, this.current_longitude));

      },
        error => {
          console.log("error location:", error)
        },
        {

        })
    }



  }

  async getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      this.current_longitude = position.coords.latitude;
      this.current_latitude = position.coords.longitude;

    })
  }

  setViewVendor(vendor_id)
  {
    let data: any

    if (localStorage.getItem("token")) {
       data = {
        user_id: this.tokenSrv.GetPayLoad().usuario._id,
        influencer_code: this.influencer_code,
        offer_id: this.offerId,
        vendor_id: vendor_id
      }

    }
    else {
       data = {
        user_id: null,
        influencer_code: this.influencer_id,
        offer_id: this.offerId,
        vendor_id: vendor_id
      }
    }
    if (localStorage.getItem("location_data")) {
      data.location = localStorage.getItem("location_data");
    }
    console.log(data);

    this.dbService.setViewVendor(data).toPromise().then((dataresponse: any) => {
      console.log(dataresponse);
    })
    .catch((err)=>
  {
    console.log("error en promise", err);
  })
  }






  /////////////////// pdf creator  /////////////////////////////////


  createPdf(data) {

    
    var docDefinition = {
      content: [
        {
          image:'data:image/jpeg;base64,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PL7hf695B/0FQ+8+pmbK03dgEmvls/8ABXH4a4/5Bvi4/wDbnD/8dqOb/grj8NxE2zSvFzNgkA20IyfTIlP8qa4Uzf8A6B5fcP8A17yD/oLh95f/AOCrumWt5+y/9qmZVuLLVLd7fPUliUIH/AWP5V+ale3fthftpal+1Lq9tbpZyaV4d092kgtfM3STsRgPIenHXFeI1+3cE5TiMuy1UMTpJtu3a5/NniFnuFzXN5YnB6wSSv3t1Ciiivrj4YKKKKABvu19i/8ABKn9otvDni28+H2pSN9h1Qm70wu/ywSgfPEM+vBA9a+OjyKveFfE934O8UWOt6W729/pt0t3byFtpV1IIyPTIH4V42f5TDMcFPCyWrV16o+g4XzyplOY08ZDa9n6dT9txhvx618ff8FXvgJ/wk3gOz8bafCv23QG8u9Kplpbdzjn2QktnsK+kvgV8V7L4zfCnRfElm6mPUrZXZAfmjccOhHqrZGOtbHjPwna+OfCWoaPqEYmtNStntplI4KspB/nX855XjauV5hGpLRwlZ+mzP60zrL6GeZTKlHVVI3i/PdH4o9f8+2f5UV0PxZ+Hl18KPiVrXhu93LcaPeSQISMb4+qH8UPHrXPV/T9CtGrTVWD0kk0fxliaM6NWVGotYtp/IOezFT2I6iv1i/YU+NK/Gz9nbRryabztT05PsF9k5bzY+Nx+oweeua/J1fvV9a/8Elfi03hr4r6r4RuJv8ARdfthd2qlsYmizuA9ynOPQZ6V8X4g5WsVljrR+Knr8up+h+FuefUc5jh5v3Kq5fn0P0RU4FOpqnctOr+fT+rgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK+fv8AgpF8Vf8AhW/7MOr28MnlXniB00uLnDbH5kIHcbAw+rCvoE9K/Pr/AIK8/EttV+IHhnwtHIvk6favqFwgP/LRzsUH3AGfpX0nCOX/AFzNqVKWyd38j43j7Nv7PyStWju1yr56Hx4BtBVSW3HcS1FFB6f4V/S+p/HMb2EaRYU3tjavJz0r9Yv2E/g6Pgz+zloVnNE0OoahH/aF7uXaxkk5wQecgYHPpX5q/s3fDZ/i38efC+gbPMjvtQV7lcZX7PGQ8g+pQMa/Ym1s1srWOFF/dxqEUD+EAYr8k8TsyajSwKe/vNemiP3bwZylSqVsxkvh91er3C+nW1tpJHZVjjQsxPAAHevyF/aw+L8nxy+O2va55jNY/aXtrEZ+5DEdgH4tlq/Rb9vf4s/8Kk/Zr8QXUM3l6hqkP9mWnOGDSnYzL7hNzf8AAa/KRx83XdgYHuSckn3qfDHK7KpmE1/dX6mnjNnT5qWWU3/el+n4CUUUV+veR+ChRRRQAUFtgz6c0UZxTKSufpx/wS11mPUv2TdNt/MVjpt/dW2Ac7cSFx+jA/Qg19IV8S/8EevG63Hh3xd4bkkXfZ3UWoQpnllkUozAeg8tefcV9tZxX8ycWYZ0M3rwf81/v1P7I4DxkcTkWHqR6Rt92gUUZor50+uCiiigAJwKhvLaO7t5I5FVo5FKsCMgg+tTNyKaVo2d0KSTVnsfkz+2p+zLdfs4/F27jSFm0HV5nudKlwdiBjl4mbpuBPA69K8fHA3fw5xn3r9nvi58INB+NXg660TxBYpfWd0hXBGHjPQMrdVYeor85/2ov+Ceniz4E393qWix3XiTwzkyCeGMtd2EYySrqAdyADl+w54r904R42w+KoxweNly1I6J9H/wT+YuO/DrFYGvPHYCPPSk7tLdfI439iX/AJOp8D/9hL/2UV+uR6fjX5G/sTf8nUeB/bUwD7HbX65Hp+NfK+J0m8dSf939T7rwYVstrq1vf2+R8g/8Fhv+SQ+GP+wyP/REtfnvX6Ef8FhTn4Q+GP8AsMj/ANES1+e9fdeHn/Ilh6y/M/M/Fb/koan+GP5BRRRX3B+bhRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABQMfxfd70UAbuKL223Czex9x/wDBIn40MYtb8B3025oQNS08M3RDhZEHvu+bHpk19xKQx7cGvx4/Zi+Ksnwa+PXhnxD5hitbW5EV0M/etpWCPn3VSTzX7B20wuIUdcbWAKkdxiv5/wDETKfq2Z+2h8NRX+ezP6l8J88+u5T9VqP3qTt8nsfn9/wVv+ES+HfiNo3jK2h2wa5bmwumVePPj+ZWJ6ZKZA9dpr4/r9Wf+CgnwtX4ofsv+IkSLzLzR4v7UtyFywMJ3sB9UDD8a/KbPA9+nvX6N4e5o8VlapT+Km7fLofk3ipk/wBTzqVaCtGqub57P8RU5de3PU10vwX+Icnwp+Knh3xJGzrJpN7DcyBf44gQsifimfzrmaR/uHPTHNfaYijGtTlSntJNP5n51hcRKhXhWhvFp/dqft/pWoQ6rYw3ELpLDcRiRHQ7ldSAQQe4q1XjP7BPxHb4m/sw+GruaVZLyxhNhcc5ZXiO0A+h2hTz2Ir2av5TxuGlh8ROhLeLa+4/uHK8dHGYOlio7Tin96CiiiuU9AKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooozQAMcLX5HftweN/+E9/ak8X3f2jzI7O+OnQbeRtiXHB9DzX6w+KtZi8O+GtQv5mVIbK3eeRicYVVLE/kK/FHWdUk13WLy9m3G4vJnmlL9S7OxP44wK/U/C/Cc2JrYn+VJff/AMMfiPjTjnDCUMKvtSu/RaFWgdaKCcCv2k/nV66fcfWf/BI/4ef8JB8ZNc8SXEe6PQ7FYoTj7ss5yfxEYI/Gv0TxkV8s/wDBJjwRHoX7PN7rJT994g1WaUNjrEnyJj6ENX1KW+Wv5t40xjxGb1f7vur5f8E/r3w3y1YPIaKe81zP5nwX/wAFf/ib9t8R+F/CdvMpjtoX1S4CtnJY+WgP/jxr4ur1/wDbx8cf8J3+1R4smZ90en3I02Aj7oWEAMP++ifzryCv3DhPA/VMqo0+rV389T+buOMyeOzqvX6c1l6R0Ciiivoj5MKKKKACgDccetFFFtdQ3Z7V+wH8ZR8HP2ldHkuJli0zXR/Zl0zMFVPMI2MxPACvjOa/VlZ1m+6wP0PSvw8UkH5XeM9mT7y+496/Ur9gP9pyP9oH4Sw2+oTxHxNoYFvqEYPMgHCyr6qwxyOM5r8f8TMlbcMzpLyl+jP33wd4kilPKKz1vzR/VHvg5NOpoOGp2a/Iz97CijOaKACiiigBGG5TUUsCyjaw3fWpjTAPmo2dxPU8y1X9kPwLqHxR03xlDpCaf4i02cTpd2f7kzEDG2QDhlI4PGfevTmFG05o+6O9bVsTWrJe1k5W0V+iObC4HD4fm9hBR5nd2Vrs+X/+Cq3w71Dxt+z7aX2nwzXB0DUBeTpFGXbytjo7YHZQ24noACa/NlfnTcvzL0yOlft9eadFqFtJbzwxz28wKuki7lYHqCDXz58X/wDgmd8Ofibez3lnZ3fh3UpssZ7CTbGzH1jOQfpgV+icG8a0cuw/1PFxfLe6a6XPyPxC8OsVm2M/tHATXNZJp9bbWPzEIwu7t60EYNfVHxU/4JN+N/CTzTeG73TfElquWSKQ/ZbgY/8AHW+lfOfj/wCGXiL4UX7W3iPRNS0Z84H2y12I59Uc4DD3FfrWX59gMbG+Gqp+Wz+56n4XmnC+aYBv61RlHz3T+Zh0UY+RW/hboexo74r2Nep4PQKKKKACiiigAooooAKKKKACiiigAooooANu/wCXkbuOK/XT9jL4nf8AC2f2a/CurSSeZdizW2usn5hLF8jZ9Cdufxr8i2XeMDgnjNff/wDwSA8ff2j8OvFHh6STc2l6iLmFSefLmXPA9AV/WvzvxKy/22WLER3hJfc9D9Y8IcydDOHhntUi181qfXur6dFq+lXVnMiyQ3EbROrDhlIwQfqK/GD4o+DpPh38S9e8PzZ87R9RuLQ8YBAYspH/AAE/lX7U9ee9flv/AMFLvA6+Dv2r9XmWNo49ctYNSQ4xlsGJj+amvk/C/G8mNqYb+eN16r/hz7rxmy32mApYxbwlZ+kv+CeA0GihulfuNj+bdlc+9P8Agjx47+2+E/FnhuaT5tOvIr+IE43CVSrY9cGMA+hIr7Ur80/+CUnixvD/AO03daczqsOuaZOignGXjcOMep25P05r9LM5r+dOPcJ7DOajX2rS+8/rbwvx31nIKS/kbj9wUUUV8afoQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABSY/nmlPSmjgn60AeX/tmeKR4T/Zg8c3W4IzaRNbKc4w0o8ofq4r8iiQGyu44zu3dye9fp/8A8FO9X/sz9kzW0VgrX9za22CfvYnRzj8FJ/A1+X9fuPhhR5cvqVP5pfkj+afGTEc+a0qX8sPzdwoHX09/SigLvO314r9JlU5IufZH5DGHNNR6vRfM/XL9iTwovg79lnwTZqpjLabHcspGDmX94cj6vXpGuahHpGi3d3MwSG1ieR2JwFVRkn8qp+A9GTw14N0vTYx8un2kVuv0RAo/lXLftUeID4b/AGcfHF4G8t49EuhGScYdomVf1Ir+VZSeKxz/AL8/zZ/bFG2DylW+xT/KJ+Q/ibXZPEfiPUdSmZmn1C6luJS/XfJISf5AVSoX/a5bkE+pznNFf1TTpqnBU10SX4H8UYit7WrKr/M2woooqzIKKKKACiiigAxu46Z4zXX/AAP+Nes/AP4i2XiTRZGNzCwE8LNtivICRmJh2Pv261yFAOOlY4jDwr0pUqqTjJWs+p0YTFVcPXjXoNqUXdNdD9i/2f8A9oDQf2hfh7a69otyrLIAlxbudstrL0KOvUHPTPUc13fevxz/AGfv2gfEH7OnjePWdCuGbzMLc2crn7PeICCVYfwsRwG7V+mn7M/7XXhf9pnw0lxpd3Fb6tEB9q06Ztk8R/iIU8lfRhxX8+cVcHV8squrRTlR6Pt5P/M/qjgfj/DZxRVCu1GstGn180esZ2mnUnelzXxdz9ICijNGaYBRQTiigAooooAKKKKAEcbkI56dqz9a8M6f4j0yS01Czt761mUo8c6CRXBGCCD61onpTSMChSlF80XZ+RnUpwqLlmk156nzT8Y/+CXvw7+IBuLrR4bjwrqUwJ82xb90xx0aM8Y9hivlH40f8E3fiJ8JxcXVjar4m0uHLCSwz54Uc5MYBJ+gr9Q9u7mlZdw6V9ZlXHGa4J25+ePaWv4nwed+GuS5inJU/Zz7x0/DY/D28s5tP1CWzuIpILqD/WQyKVkj+qnkfjUYO7pX7AfGr9lTwN8e9LeDxFoNrPMctHcxL5c8T9mDjnIPIzkZr4Y/aX/4JreKPhNHcap4ba48UaHGDIQEK3tog5IKgfvFAHbnFfqmR8f4DGyVOt+7n57P0Z+J8SeF+Z5cnWo/vaa7br1R8zUUsiNFKyMpV1JDKRggjrkUincOOfpX3i11WqPzNpptP7uwUUUUAFFFFABRRRQAUUUUAAbac9cdq+pf+CSviv8AsH9oTUNKaRfL1bSWj6/elifd+qZP05r5aB2817F+wH4h/wCEZ/a08GybhtmnktJOevmQFAf++iB9a8HijD+2yqvD+639x9Lwbivq+d4ar/fS+/Q/WNVxXwV/wWL8L/Z/FvgvWVQ7rq2uLKRscARsrqM/9tG/KvvXPP45r5J/4K/aAl78D9A1JQTLY6ykWQOiyRSZz+KL+Yr8J4JxHsc6ovu7fej+mvEbC+24frr+VKX3M/PCgDJoor+lW+h/IMXfVnqX7E3iX/hFP2rPA90zlfP1JbI+mJ4/K/mwH1r9dA+a/Fn4S61/wjfxV8M6jkL9g1a1ucntsmRv6V+0du3mRg/3uRX4h4oUYrGUqsesfyf/AAT+i/BXEN4GvRl0krfNEuKKM0V+Yn7YFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAHkU08D8KcelNbrR1A+V/+CuN/9k/Zu0qLOPtWvwxn6CCdv5qK/OGv0Q/4LAS4+BHhtMfe15G+mLef/Gvzvr+gPDmNsnT/AL0j+VfFyfNxBJdoR/IK1vAGmrrPjvRbNhuW6v4ISPUNIo/rWTXVfAuH7T8bfB0eN3ma5ZLj1zOlfZY6XLh5y/uv8j89y6PNi6S/vR/M/Zi0XFquP4gDXif/AAUS1RtM/Y/8WyL8rSxwQ474e4iU/oTXttucRAf3QMe/FeAf8FOZiv7ImvLu/wBZPaD6/wCkxn+lfzFkkefMaK/vr8z+y+JJcmTV3/cf5H5d0UUV/U9raH8Tx2CiiigYUUUUAFFFFABRRRQADk1e8O+J9Q8I6/a6lpd9cafqNqwaOeBmRkIOQfQ4PODxVGiplTjNcs0muz6lU6sqUlUpu0ls1uj7U/Zz/wCCr02l21tpvxAs5rmNcINUtUzJjpl4xyfX5efY19kfDP41eF/jFoy33hvWrDVISAWEMytJF7OvVT7ECvxj69entWh4d8Vap4P1SO80vVL7TbyNg0c1rKyFcHI4HGfc8V+eZ14dYLFN1cG/ZyfTdf8AAP1bh3xZzHBpUccvawXXaX/BP21HPf3pQff8zX5q/B7/AIKleOvAiR2viK3tfFdjGVAaTEN1gdfmHy7vc19TfCH/AIKVfDX4mCKG91BvDN85CmLUh5cYJ4wJfuY9yQK/MM04NzXBNudPmj3jr/wT9nyXxDyTMbRhV5JdpafjsfQm3nv+VOrP0XxDp/iOxjutPvrW+tpOUlglEiMPYjg1fDg9xXy8ouLtI+3hUjNc0HdeQtFGaAc0FBRRmjNABRRRQAUUUUAB6VGy7lK9cipD0po5FAHyz+2X/wAE7dM+MFtdeIvCENto/iqNC7ooCwahjnaw6K57N+dfnb4j8Oaj4S8QX2lata3Vlf6fL5dxbzrtaFh0P0Pb1r9tmU7cZx7ivm39vH9iS1+PnhyTXtEgjg8WaXGzxlVx9uQD5o2x1YjhT2Jr9K4P42qYWccFjpXpvZ9V/wAA/GPEHw5hi6csflkeWqtWltLzS7n5mg5bb/F1xRT7uzms724tbiH7Pc2shimhlB8yGVD8y/XAzg0yv3CMk1dH83yTT5Xo1oFFFFUIKKKKACiiigAJwK7b9mm9OlftGeBZA4UL4hsgzk4Gwzx55+lcTXSfByXyPi74Vk/uaxaN+UyVx5hDnwtWP92X5HoZTLlxtGX9+P5o/aCI+YitgjPUHtXzn/wVM0wXv7KN7MRxZ6hbS59MvsH/AKHj8a+jITmIV4L/AMFL4vN/Y78UZ/hls2/8m4a/mfh+XJmlB/31+Z/YnFkefJMSv7jPy1ooor+o076n8Vj7adrW4jkX70bBhj1HNftzpFwt3pdvIp3LJGrAjoRivxDDbDn05r9sPAxz4M0k+tnF/wCgivyDxUjrh5+q/I/evBOeuJh/hZrDmnU1adX5HtofvwUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABTXGRTqQ80AfJH/BYBT/AMKL8NnBwNbUZ/7YS1+d9fpB/wAFb7L7V+zRp8ne316B8+g8qZf/AGavzfr+gPDipzZOl2lI/lXxbhy8QSfeMfyCuw/Z7YJ8fPA7N90eILAnPp9ojrj63Phnqo0L4keH74kKLPUracknAG2VW/pX2GYR5sLUj/dl+R+fZbLlxdKX96P5n7UIP3Q/3RXzz/wU/Gf2StYx/DdWmfb9+lfQls26JfTAx79K8T/4KLaW2q/sf+LljTc0K283ToEuYmJ/75Br+Zcin7PMqD/vr8z+y+JoOpk2Iiv5H+R+VNFHf6dfaiv6m3P4n1tqFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFGM//qoooDTqb3gf4p+JPhtfi60DWtU0eZSObe5YK2PVOVI9uhr3r4bf8FUPiF4SWGPWoNN8S28bKMSIYbh8H+8vygn1PAr5noHJry8wyLAYuNsRSUvO1me5lnEmZ4GzwtaUfK7aP1o/Zg/bG8NftQabMumeZp+sWQVrrTrk/vYwepH95e2RxXr2cHivye/4J/eK7vwv+1f4P+zSOsd9K9pOnaVJIzjd7q3NfrBjbX4HxlkFLKsd7Kg/ckk15eR/UHh7xRXzrLfbYle/F2duvmDSYb8eKM854rw/9t79p7U/2XfC3h/VtP0+11JL7UBb3EUzFGKbGchW6AnbjJ4rO+Af/BRnwF8aJYbG7vB4Z1iQhRa6iwRJGPACS/cYk8AZyfSvIp5Hjp4VY2nT5oO+q8vI9ypxRltLHPLqtRRqJJ2em/mfQW70p1Qw3CTKrK6MrjKlTwRU2a8ryZ9AmmroKKM0UAFFFFAATgVGxBFSHkUwp9aN9BH5+f8ABU39mKHwh4ht/iBpFv5dnqri31RET5Y5v4JeOm48HPU/Wvj0fN07dfav2W+PPwutfjJ8JNc8PXSI39o2kiQuwz5Uu07H/wCAtg/hX436pY3Gi301peRtDd2srW00bLtZJELK4YHkEEcg1+9eHedyxeC+q1neVPS/dPb/ACP5c8VuHY5fmKxdCPuVdfR9fv3IaKKK/QtT8r22CiiigAooooAK6T4MxG5+L3hVFBbdrFouAPWZK5s9OK7j9mrTG1X9ozwLAobH9vWLsAPvATox/wDHQT9K48ylyYSrL+7L8juyuHPjKUf70fzR+xlvzEP85rwX/gplJs/Y88Tery2YA9f9LhP8gT+Fe9xfKor5w/4Knaotj+yneR7lzd6hbRAZ6/Pu/kufoDX8zcPw58zoR/vL8z+xeLJcmSYl/wBxn5k0UUV/Uu2h/Fm+oHGOenev2y8ExmLwbpasCrLaxAgjBB2ivxRtrc3lzHCAWMrBAAOuTiv2601PL06BR/CgFfj/AIqT1w8PX9D968E6euJn/hRYx83606mLyafX5GfvwUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABTc/PSt92mDOfxpMDwD/gpvo51T9kfXJFUM1jcW1x9B56If0Y1+XVfr3+2T4a/wCEr/Ze8c2oVnZdInuEVRks0S+aAB9UFfkJnmv3HwvrXwFWn/LL80fzT4zYbkzSlW/mh+TsFKrbWByRg5yO1JQU8wbem7jPpX6XKHPFwfZn4/CfJJTXTU/an4a+JE8WfD7Q9VjO5dSsYbkMOR88Yb+tYn7S3hr/AITL4A+MtNWNpHutHukRQMkv5TbcD/exXK/sE+MR44/ZO8H3W5TJb2n2KRQeUMLtEAfQ4UH6EV65fQLcWk0bruWRWUg9xiv5UxEXhcc0vsT/ACZ/bmFksblUb/bp/nE/D1W3jcvzYGCRzuOSM/kCfwp1bnxK8JyeAfiLr2hyLhtJ1C4s8Af3JMg/irVh1/U9Cp7SlGovtJP70fxTiqPsqsqX8ra+5hRRRWpzhRRRQAUUUDmgAooPyg54x19q6bw98FfGXi6xF1pPhHxNqls3SW00ueaM/wDAlUisa2IpUlerJR9Wl+ZtQw1as7UYuXom/wAjmaK7b/hmr4jH/mQPG3/gjuv/AIij/hmr4jf9E/8AG3/gjuv/AIiuf+08H/z9j/4Ev8zq/sjH/wDPmf8A4DL/ACOJortv+GaviN/0T/xt/wCCO6/+Io/4Zq+I3/RP/G3/AII7r/4ij+08H/z9j/4Ev8x/2Rj/APnxP/wGX+RxNFdt/wAM1fEb/on/AI2/8Ed1/wDEVzPiTwpqng3U/sWsabqGlXmM+ReW7wS4/wB1gDWlPHYao+WnUi35NMyrZfiqUearTlFd3Fr80Z9A60d6B1rrOSO56p+xL/ydT4H/AOwl/wCyiv1yPT8a/I39iX/k6nwP/wBhL/2UV+uR6fjX4Z4n/wC/0v8AD+p/Sfgv/wAiyt/j/Q+Qf+Cw3/JIfDH/AGGR/wCiJa/Pc5x8uN3bJI/Uc1+hH/BYb/kkPhj/ALDI/wDREtfnvX3Ph7/yJYesvzPzPxWuuIajjvyx/I+hv2Uv+CgPiL4Cahb6XrU11r/hPKqY5G8yeyGRkxn7zADJC96/SXwF8QdL+JvhOz1rRryC+0+9jEkUsThh9DjuOhHY1+KgLLyuN3bPTNfX/wDwSl+PN1oPxDuvAd5cSSadqkbXOnq54gdRudB9Rk49s14vHPCOHdCWYYRWlHWS7rufQeGnHmJp4qGWY2TlCWkW90+3ofoOh3CnU0c4p1fix/SAUUUUAFFFFACMMrX5Jft0+C/+EE/at8X2iR+XBcXa30eRgN58fmkj1+YsOO6n0r9bm5Ffmv8A8FaNFXTf2nLO4Vf+QhocMzHH8Syyx/yNfoXhriXDNXSX2ov8NT8n8YMLGeTRrveE1+Oh8v0UUV+9a21P5eQUUUUDCiiigABwa9m/YB8O/wDCR/tdeEIWjZltpZbtiBnb5UBIJ9BuwM+vFeM19Vf8EkvBzaz8f9W1hlZ49L0w7WAyqtK+ME+pCtx7GvA4oxHscqrz/uv8dD6bg3C/WM7w1P8Avr8NT9HAvAFfIn/BYHXls/gn4d03cN95rSy4B5ISKTPHp8wz+FfXROPyr4H/AOCxPir7V448F6Irr/o1pcX7gHpvIRc/Xa2Poa/DOCKLq51R8m39yP6Y8SMR7Hh+v/eSX3s+MqKKK/pLqfyBze9ZnR/B7Rf+El+LXhbT/wDoIavaW3/fcyL/AFr9n4F8qJa/JX9hvw0vir9q7wXalSy2+oG84GceTGJgfzA/MV+t5WvxHxRr82NpUu0b/e/+Af0f4K4ZxwNes/tSVvkhudzU+mkbTTq/MT9qCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAKPijSY9f8N31jMu6G8geCQeqsCD+hr8UPEOiyeHdevtNlVln0+6ltpAwwQyOc5HsCAfrX7esMrX5JftzeB/+EA/am8YWvlskN5eLqEJ24DLOm9iPUBhjPrxX6j4YYzlxVXDfzRv9x+I+NOB5sLQxa+zJx+TPJKGGVPb39KKBzX7XLU/ne3bsfoR/wSD8f/2v8J/Efh+RlL6Pqf2iIZ5Ec6hhx6ZB/Ovr5hgfTmvzP/4JV/Ej/hFP2km0iRikHiaweLBOF82P94h/75BX6mv0vD5Geq1/OfHWD9hm9SS2naS+f/BP628MsyeLyGlzb07xfyPy0/4KR+Av+EF/ao1iVUaOHXYI9RQ7cBmPyP8AXkY/GvBa+8P+Cwfw1+1eHvDPi6KM7rGZtPuWA4Ecg3Jk9vnH5kV8H44Hv096/ZODcf8AWsppTe8Vyv5aH888fZb9SzyvSjs3zL56hRRRX1B8aFFFFABSpy4+tJQrbGDYzt5x60bahy3aPor/AIJqfs6ab8cfizd6jrEK32l+F4opDDIPled2JTPqPlPXg4r9MtP0uHSbZILdI4YYwFSNFCqo9ABX5+/8Eg/G0Og/FXxHoEjIp1mxS4jJOPMeEgbR6nbIxwOwNfoWSBzkV/PviHXxDzeVOo3ypLlXlY/qjwnwuFjkka9GK55N8z6i5/nTqacOR+dOr4XU/UAooooAbIu9CPUdq81/aX/Zz0T9of4c6hpepW0f2wws1ndAYe3mAOxs9cbsEjvXpbnC0wrujIPzcVvh8VUw9RVaLtJO5x47A0cZQlh68VKMlsz8RNY0qXQtXurG4SSG4s5mt5EkXaytHlDkHnrj86rDrX0z/wAFM/2cZ/hh8XH8WWULf2H4ml8yUqh2W11t2spOMDeSCAepBxXzMrqec/KOuPTvX9Q5PmVPMMJTxUHutfXqfxZxBlNXLMfUwdVfC9PNdD1P9iZsftVeBx3/ALS6f8BFfrmen41+T37Anhe78Q/tY+E1hjZo7CZ7y4YKT5SqmRu9M9Bmv1hPI/Gvx/xNmnmFOPVR/U/ffBim45VVb6z/AEPkH/gsN/ySHwx/2GR/6Ilr896/Qj/gsLz8IPDH/YZH/oiWvz3HNfeeHn/Ilh6y/M/MfFb/AJKGp/hj+QL1r1H9iK+uLX9qnwNJC3zPfojEd1eIqw/KvLWbAO3luw96+i/+CY/wzm8aftRWOpGPdY+F7ee6kYDK+Y48qIE9MgEsB6Cve4krQpZZXnPblaPl+FMPOvnGHpU9+dfcfp4hxinVHux/KpK/l3pof2wgooooAKKM4oByKAA9K/On/gr3Ip+P3h9Qy7v7AU4z2+0SV+irn5TX5l/8FV/ESa1+1L9lTax0nSLW3bB+7uaWTB9Oo/MV9z4dU3LOYtdIyPzLxaqKOQST6yj+Z82UUUV/QZ/KgUUUUAFFFAGTQAV+gn/BIXwR/Znwv8QeJGjkVta1AWseVI+SFeo9tzsPqCK/Plnwp27c7dwz0x6/Sv18/ZD+G3/Co/2dfC2iSRtFdx2azXSldrCaT94+QehBbB+lfnPiVjvZZdHDLecvwWp+teD+W+2zeWJltTj+L0PTGHFflj/wUg8c/wDCYftY68sbiSDR4YdMjwcgFV3v+TSEH3r9QvEGsQ+H9DvL65kWK3soHnkdjgKqqSST7AV+LvxE8WyePPH2s61cM7TatfzXTZ7byTg/TAr5XwxwftMZVxL2jG3zbPtvGfMOTAUcHHecrv0Rj0DrRQxKrxwexr9w9T+b1ZWkz6e/4JN+EP8AhIf2kbrUWjZk0PS5ZBIFyqtIY4lBPYldxHqAa/SqvjL/AII/eBjYeBvFXiKSJlbVL6OyiO3+CFOf1b9K+za/nPjzGfWM5qf3bR+5H9beF+XvC8P0ubebcvvYUUUV8efoQUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAHpX5+/8FgfhyNM8d+F/FESkLqdrJp0xA43xsJFyfUqSB/umv0CrwP8A4KQfC3/hZf7MGsyQxeZeaCU1OEqu5gIzmTH/AGz3V9JwjmH1PNaVR7N8r9HofG8fZV/aGSVqSWqXMvVan5Z0HpQGz+NFf0xrY/jqV3odB8KvHUvwu+J2h+Ioi27Q76O7Cp/y0jR13J/wJQRX7N6NqsOt6Vb3ltIk0F1GssciEMrqQCCCOoI9K/EQ4I56d6/Uv/gnJ8V/+Fm/s0aVDNJv1Dw67aVdAt82Y/utj0K4x64r8p8TsvcqNLGr7L5X6PVfifuPgznDjiKuX1H8S5l6r/gHXftgfC7/AIXD+zv4m0WOLzbz7I1zaKF3EzxfvIwB7soH41+QxVoQyt3+8P7rB9p/Wv3DkjEqMG+6QQa/Iv8AbJ+ETfBT9onxFpEcZSxuJvt9plcDyZDnj1Ac4471xeGGZO9XASe/vL5aP9Dr8aMndqOZw6e6/wBDzCiiiv2M/AuVLRBRRRQAUE4FFFHkB3n7MfxSf4N/Hnw34gLtHaWl4kV0B1MEgCyfkpNfsFY3ceo2sdxE6SQzKJImXkMpHH55r8QSAR8xKr3I6iv03/4JvftDD4u/BaLRr64E2veGQttOGb5pIv4HHcjHGfavyfxOyeU4QzGn092X6M/cvB3iCFKtPKpv4vej69UfR0ZzjjtT6aCRTs1+Nn9DBRQTiigAb7tNH97tTmPFNwTQBzvxP+F+j/F7wbeaHrtot5p94hRlI+Zcgjcp7MM8EdK+QfEP/BHWOXXWbS/G01rpbOXjhn07zpYB2Cv5i/mVP0NfcPakC5616+V8QY/L044So4p9NGvxPnc64TyvNZqpjaSlJddmeR/syfsieGv2X9Fki0mN7vUrvH2nUJxmaY56ew9q9bY5X9KUjAoK5rhxWMrYqq6+Ik5SfVnrYDL8Pg6Cw2GiowXRHx//AMFgRn4QeFx1/wCJz/7Rl/xr8+X+U7ejenev1Z/ba/ZYvP2qfB2k6VZ6pbaW2n3ouHlmhMuV2kEAfjXjvgf/AII96Lplyk3iLxVqeqqrAmC0gS1QjPI7nFfqvCfFmW5dlcaOJk+ZNuyXnofhPHfAubZrnkq+Ep+41FXb8j4m+Hfw11v4seLIdD0DT5tQu5iqsqRlggJA3OQPlUZ5Y8Ac1+pX7IH7MVn+zN8MItNVln1a+YXOp3OOZZsDgH+6vQV1Xwk+AnhX4H6Ktj4Z0az06P8AjdU3Syn1Zzya7THFfMcVcZVc1/c0Vy0107+bPt+BvDylkn+04hqdZrfohOop9RkbQPvdakr4g/SwooooAG5FN6DinHpTS2aPIBs8vkxMxxtUZr8dv2n/AIgr8UP2hPFmuK/mw3OovFCVO5TFGNiYPccZz7V+k/7c/wAbl+CX7PmtXkMoj1HUojYWWG+cSSAqHUdTtzuOOmM1+TwGz5d24ZwW7kgHn8c1+v8AhflskquPmtH7q/U/n/xmziMp0csg9V7z8n0Eooor9eduh+Dq9rsKKKKQBQOtFCkqflGW7D1oJb7nov7JXwnb40fH7wzoOwSWbXSXV4MZ/wBHi+eQH0BI2/U4r9f4YlhQKB90YFfE/wDwSP8Ag6bPSdY8dXUHzakwsbBinCxr8zsD6FuMjjIIr7Z6Cv598Qs1WKzR0k/dpq3z6n9VeE+S/Usn+sTXvVXf5LY8I/4KMfFP/hWn7MGuJDN5d5rwGmQBfvESHbJj6R7/ANK/LFV+VR/DHk5P3mJr61/4Kz/GBfFfxT0nwnaz7rbw5Cbq6VWyGml+VVPuFwcV8lV+leH+WvC5VGcl71R83y6fgfj/AIpZwsbnUqcHeNNcq9ev4gBk0jOEj3nG31PSkkOI269O1dh8CPhzJ8WfjN4d8OxozLq1+kcyqu7bbqQ0h/BNx+gzX2WJrKjRlWltFNv5H5/hMPLEV4UI7yaS+bsfp3+wz8O/+FY/sy+FdPmjaO7uLUXtwCu1vMl+c59xkD8K9fqpptiunWscMahIoQsaL2VQAABVuv5RxmJeIrzry+02/wAT+48twccJhKeGj9mKX3IKKKK5ztCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKABulUdc0mHXtGurG4jWS3vImhkRujqwwQfqKvHpTcfLmhScXdbompCM4uEtnp95+Mfxu+HFx8I/iz4h8O3Qw2k3rxxsV27o2O6NuexU8HvXK19l/wDBXD4LjSvFWi+OLWJhFqCfYL8hTt3r/qmY9BnJAz6V8aE4/lX9QcN5osfl1LEdbWfqtD+LeLsneWZrVwnRO69HqgOP4vu96+qP+CUXxfbwZ8aL7wzeSMtr4mtQ0KsdoW4iySef7ynA9TivlZhuUj1GK1/BPjC6+HvjLTde09vLutJu0vYju6lGDFD7HGK2z3Llj8BUwnWS09VqYcN5tLLcyo4yO0Wr+j0P2uYjG0+/HqK+Nf8Agrh8Gf7V8IaN42tYf32kymzvWVcloZPuZ9hJjk92FfVvwx8c2fxK8AaTr1hIkttqtslwhU7sbgCRn1ByD7ioPi98PLP4r/DPWvD98oa31W0kgYkZ2Ejhh7g4I9xX855Njp5ZmMK705ZWfpsz+teI8tp5xlFSjHVTjePra6PxfPBx74orT8YeFLzwJ4r1TR9QRo9Q0u4eznDLt+62VbB9VrMr+nqVSM4qcHo9T+Ma1OVKbpT3i7MKKKK0MwooooAD067ffHSu+/Zr+Pl9+zl8WtP8R2fmtZqRFqNuvP2q2Zhuwv8AfUZIHriuBoPIrnxWFp4mjKhVV4yVmjqwWMqYWvDEUXyyi7p/oftV8O/H+m/Evwdp+taTdQ3NnqUSyRtHIHAJGSuRxkcgjtg1ubsD3r8t/wBh/wDbSvP2bfEf9maxNNceD9QlLTRffOmtx+8T1XuQK/Tbwp4r0/xtoVtqWm3cN7ZXSCSKaFwyOD7iv5t4m4bxGU4hxl8D+F9LdvU/rzg3i/D53hFNO1RfEvPv6GkvPWnUmc0ua+cR9kFFGaKYBRRRQAUUUUAFFFFABRRRQAUUZxQDkUAFFGcUbqAA9Khnl8mKRmZVCjOT2qRmGOtfGv8AwUX/AG2I/Cul3fgXwreRyateR+Xql3BJu+xRHgxgj/lo3IPdQc16mT5TXzHExw2HV29/Jdzw+IM9w+U4OWLxD22Xd9jwH/goT+0sfj/8YHsNPmEnh3wuzW9qUf5bqfpJJ7qOgPtXgNBJVVj6qgwOc5Ockk0V/TGV5fSwOFhhaK0ivvfU/jbOM0rZjjJ4yu7uT/Dogooor0DzAoooHNAATgVqeB/B198QvGWm6Dpis2oardJaQgKW2OxAyR6LnJ9AMmstR5h2qpkP90DJNfaX/BKD9nb+0dSuviJqUJeC3BsdK3pxI3/LSdT0PoCPQ+leHxFnEctwM8Q97WXqz6LhXIZ5vmVPCQ2bu32S3Psz4O/Daz+EPw20fw3p8YjtdJtkgU/3yBy34sTV74h+NLP4d+BtW1y+kWO00q1kuZGLBchVJwM9zjA9yK2Mc18af8FY/wBoD+xPDen+AdPuNt5rCi8vgjZMcCNwrAdAx9a/nfKMvq5pmMaO7k7t+W7P6xz7MqGSZROutFCNorztZHxB8SfHN58S/HuseILyRpLjVbt7g7uqoWIVfwFYtFFf1BRpxp01CGyVl8j+Ma9adWpKtVd5Sd36sDjHzdO9fYH/AASR+En/AAkHxF1vxlcRN9m0WI2FqzLx50hy+D6qnykdRu5r5Bj3bxtXzGyCFAzu9B+NfrR+xT8GF+B37PHh/SZItuo3EQvb9tuC00nzNn3HA/CvhfELNPq2W+wg/eqO3y6n6R4V5H9dzhYma9yir/PoeuDlqdTQfbvTq/AEf1WFFFFMAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAPSmnkU49Kb0OOaTA8//AGlfgzb/AB3+DeveHZgvnXluWtXYcRTr80bf99AfhmvyF8RaJd+GdcvNOvomgvbGdraaORSrI6nkEHkHHOPSv2625WvgP/gqt+zUPD3iCH4haTBttdS2WmqoicJNn93Lx03fdJ7nHrX6X4cZ9HD4l4Cs/cnt5P8A4J+N+LXDH1rCrNMOvfp6PzXf5HxrQOvb8elA5J/2eD7UN0r9y1t6H817bbH39/wST+OX/CQeCNT8D304a50V/tlgGb5mtpD93HX5HyD6bq+xXBdGA+Xtmvx2/Zw+Mtx8BPjNofiSN28m1uNt+in5ZrdsJKv5HcvuK/YDQdbt/Eej2t/ayJLa3cSzROjBldWAIII+tfz/AOIWT/VMweIp/BU1+fX/ADP6m8KeIfr+VrC1X79LT5dD8/8A/grB8BV8KePrDxxZQ/6Jr+LS+wMCOZB8jk9Pm4HuRXyKDkV+xH7S3watvjx8G9a8OzqnnXVuzWkjD/Uzr80be2GA/A1+QevaJeeF9evNNvIXhvLGV7aaN1KsjKcHIPIJHPNfoHh5nixWB+q1fip6fLp/kflnirw68Dmf1ynH93V/B9fvKdFFFfoGux+WKVwooooAKKKKAD8dvvjOPwr2T9lT9tDxH+zJrCRJ5uqeHJ2ButOkm5j55eNjwDjtXjdBLD7u3d2z0zXHjsvoYyk6GIjzRfT/AC8zuy3M8VgK6xOEk4yXVfk/I/Yr4FftHeFf2hPDK6h4e1KG4kCgz2jOBcWp9HTqPr3rvM8V+J/g3x1q/wAPNfh1XQdVv9LvrchknicqpIOcPH/EPY9a+yP2ev8AgrGYlh074gaftVAqDVbJS289NzxdR7lfyr8V4g8O8VhpOrgffh26r/M/onhbxZwmLjGhma9nU79H/kfdAOfzp1cr8OPjP4X+Lmlx3nh/XNO1SNlDFYJgZI8/3k+8p+oFdSXA71+d1KM6UuSomn57n63h8RSrQU6MlJPqncWijdignFSbBRSb1z1paACiijdQAUUbsCjdQAHkUwtinMwC0x3VRliFFAN2Vxw5/wDr1Hd3UdnBJLLIkccalmZjgKB3JryP49fts+A/gJayLfatDqGqKCFsLJxNNu7BgudnPdq+D/2mP2/vGH7Qcs1jbyHw54dyQLS2c+fcjpmRx2x1UV9VkXB+PzKSko8kOsn+nc+E4m8QMryiDi5c9TpGP6s98/bR/wCCj1vocd54X+H94t3qUgaG71ZCGitRyGERHDMPUdK+Eb29m1O7kuLiSW4muHaV3lfLSMeSzH19BUartXaNm3llC5GPXJPeiv3fIchw2V0PZYeOvWXVn8zcScUY3O8R7bFP3VtFbIKKKK9u+lkfN9LBRRRQAUbd/wAvPzccUFtoyeAOppyWzXEqwiOSR5CECIDvYnoAOuT2o5klr/ww46uy+S7s6z4G/B3UP2gPilpPhrT423X0x+0SgEfZbdcbnz64zj1Nfr18OPAVj8MfBun6HpsKQWWnwrDGqLgcDkn69a8S/wCCfH7Jw+AXw3GratCh8Ua8Fmumx/x7p/DGvpxjPv8ASvot2wpxX898ccRf2ji/Y0X+7hovN9z+q/DThFZTgfrFdfvamr8l2MP4j+O9P+GngfVNc1KZYLPS7Z7iRiwBIUE4HqxxgDuSBX4//Gf4qX3xo+KGteJNQkZpNUuWdEJ/49ol4SNf9nGD9a+nv+Cpv7Tg8Q65H8O9Hut1tZlbrV5Im+VnBykII64PLDrjrXxvX3Xh3kEsNh/r1Ve9U28l/wAE/L/FXipY7Gf2dRf7unv5y/4AUHGPm6d6KksrObUbuG3tYnnuLiRYoo0Us0jscKoA5JJIAA61+kuVo67f5H5LFOT5Urt6I9r/AGA/gJJ8b/j7p8txCZNE8Oyi/vzs3RyOCDFGT05I5Hpmv1ThjESKqjH9K8h/Yp/Z2g/Z6+C2n2MixtrF6outRnUcySMPu59FzgfSvYyMV/N3GWePMsdKcPgjov8AM/rrw94aWUZXFVP4k/el89kJu+anU0DAp1fKRv1PvAooopgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAAa5/4mfD7T/ir4F1PQNUjWWy1S3e3kBGSu4Y3D0I6g+oroCcCoyM8c/MaqFSUJKcHZrVGdajCrTdKorpqzR+Mfxn+F2ofBX4max4Y1YH7Vp8xCSBSFlhJzG/0PAz68Vy9foh/wAFSP2av+E98Cx+N9Jt86v4bjY3gSPLT2n8ZbH9wZbJ6D6V+d45Ff0twrncczwMa321pJef/BP45404bnk2ZTw/2G7xfk+nyDOO2fY96/Rf/glp+0N/wnnwxm8G6lcCXVvDBxC7OM3FsxypHc7emfpX50DJPy4z2zXdfs3fGq5/Z9+L+leJrdpPstu4jvIV6y2zMA4x/eAyRU8WZKsyy+VOK9+OsfVF8DcRPJ80hXk/cl7sl5PqfsVjduGK/PX/AIKqfs6/8IX45tfHmmwsun60fsuohEO2Of8AgcnoN3A56mvv3w14htfFnh+01KymjntbyJZYpI2DKykZGCOKwfjd8JtO+Nnwx1bw3qkavb6lbvGrEcwuQdrj3U4I+lfhHDmcVMrzGNZ7XtJeXU/pni3Iqed5TKjH4rc0H59D8Zs0VtfEbwJqXwx8b6p4f1ZPKvtJuWhlBXbuP8LDP8LJjB6E1i1/TNGrGrTVSDunqn5M/jmvRlRqSpVFaUXZ+qCiiitDMKKKKACiiigAoBwaKKPQFvoWtD16/wDC18t1pN5faZdKwdJbaURsrDkHg44PPPFe7fDD/gpd8Tvh7DFBd31n4itYsAx6jGwmIH/TRP5818/0V5+NynB4zTE0oy9V+p7GX55mGAd8LVlDyT0+4++PAf8AwWE0O7jjj8SeF9TsZeN0tlIs8f1wSp/nXq3hX/gpB8JvEzIreJF0+STA8u8tZYdp93K7B9d2K/LGlQ4dfr6V8hivDfKat5QvD0d/zPusB4tZ3RSVVxn6qz/A/bHwv4w0vxto8OoaTqFpqdjcfNFcWsqyxuPZlJBrWr8yf+CZfx11XwF8d9O8MyXM7aL4oBhltXk3x21wiZVo+wDcA1+m2a/IuJMhnlOL+ryd1a6fkfvXBvFEM9wCxajyyTtJeYHpUbHHpT2bArw79sX9s7Sf2YvDvkxeVqHiS7jJtLEPyo6CSTHKpnv35rycHg62KrKhQjeTPczPMsPgMO8TipcsV/Vj2DxH4t0zwjpcl9ql/Z6bZwqWea5mWKNAOSSzEAfjXi/jT/go78KPBkk0f/CRjVZo+ken2sk2fo4Gw/8AfWK/OL4xfHnxV8ddfk1LxFq815uf9zbqzR29sv8AdVB1+prjq/Wct8MKXIpY6o3LtH/M/Cc48Zq7m45bSSj/ADS3+4+6fiH/AMFhLSPzIfC3hO5uOoS41GcRKD2JjTcxHtkV88/Fv9u74k/GFJIbrXm0uxlyjWmmL5CFTwQzH5mGPfNeOUV9nl/COVYR3pUk5d5an57m3HWd49NVqzUX0jovwFe4e4nkkkaSSZz80juWLfiaSiivplFJWR8fzSbvL8QooooAKKKKACgnAooyUb+6w5GR0/CjyDd2YBsN1HrzX2Z/wTY/Y0PiC+tviB4ksyun2r79GtZVP77oRO2eoB5XtXA/sH/sS3Hx71mHxBrtu8fg2zkDxhlKtqUgYEgccpxgke9fphYafDpFhHb2sUcMEKhI40XaqADAAA7D0r8p484uVJSy3BP3n8T7eR+3eGPAjrTjm2YRtFaxi+vmSKAg6jrnmvGf22v2qLX9mz4XTSW8kcniPV1e30uHuHxzKw/uoOfcgDvXoPxe+Kmj/BfwFqGv61cLa2NjGXIJG6dsHCIO7MeAB1Nfk5+0P8dNX/aH+J9/4g1RtsZYx2VqHzHbQj7uP9ojrXxvBfDLzPE+2qr91DV+b7H6B4icZRyfCfV6D/fTVl/dXc43VNTuNZ1G6vbyaSa6vpmlnkdtzSyk5Lew7Cq9FGM9Otf0NGCivdVl27I/lOc5Sk5zd29W+4Mdqnd0xzX1V/wS/wD2a/8AhYvxEk8bapa/8Sfw3J5dmjKSs12cZPodnB9jivm/4deAdQ+J3jLTdB0lTLqGrXC28IClthLAFiB/CucsegAJNfr78DvhJY/BL4Z6V4b06PbDpsIRmA5nfALOfUk5r8/8QOIPqeE+qUX+8qfhHr95+peFvCv9oY/69XX7ul+MuiOtUbcCpKavIHBp1fgh/UgUUUUwCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAK2q6ZDq+nzW9xGk0M8bRyRuMq6kYII9DX5Lftl/s9Tfs3/Gy90mNXOj6jm90pyDjymb5o89Cyt29Oa/XInivC/29/wBm5f2hfgvdC0g3a9oim805lXLSMBlouOcOox9cV9hwXnzy3HpVH+7npL9H8j898RuGVm2WOVJfvaeq811XzPyrZShG4bd3TPegnHVQw7gng0+a3a0uJI5I2hkV2V0bqki8MvtTCu8Y9eK/oqNrJo/kmUWm4yVnt6f8Mfe3/BKr9pT+2NCuPh3q1yGutM3T6RI75aeA8tH7lDk49K+zg4YdjxmvxX+HHxC1L4V+PtN8RaTM0F/pU6zxAH5ZFyCUb2OMH2Nfr38Dfi5pvxy+GGl+JNNmSSDUotzIGGYpBwyH0IIPHpX4P4hcPvB4v63RXuVHr5S6/fuf074VcUrHYP8As6u/3lJffHv8j5c/4KofsxLrOh2/xC0iD/StMXydVSNNzTQ9pDgfwdST0XnoK+C8c1+3Wu6La+ItIurC8hS4tbyNoZYnXKupGCD7EV+Sf7W/7Olz+zb8YrrR2SSTS77fdaXMQcNDuyVz3Ze4HQV9P4dcRKtT/s2u/ejrH07fI+O8WuFfq9ZZrho+5PSS7Pv8zzGijHNFfqfmfiYUUUUAFFFFABRRRQAUUUUAFA60UDrTHHc9U/Yk/wCTqvA3/YT/APZRX65N1r8jf2JP+TqvA3/YT/8AZRX65E5r8M8Tv9/pf4f1P6T8GP8AkV1v8f6HP/FL4h2Xwr+H+seINQZVtdItHunG4AttUkKM/wATHCgdyQK/Hv4t/FDVPjH8QNR8QaxLJPdX8zOg3ZW3QH5UHsF/Wv0E/wCCrnjObw5+zZHYws0ba5qsNm+P4kVXmI+n7sCvzZr6DwyyuEcNPHSV5Sdl6I+U8Ys5qTxsMtT92CTfm3sFFFFfqN1fQ/FgooopgFFFFABRRRQAUDmgKT26dfahB5oXau/edqjGdx9KG0t3YNb6f0wztI5APbNfRn7Ef7C15+0Bq0Gua9DPZeC7V1ZVZGWTU2DDIU4+4ehIrs/2MP8Agm5deMzZ+JviBb3FrpOVktNJlP7265BDy9Cqf7PUivv3S9LtdC0+G1tYY7e2t0CRpGuFRR0HoK/K+LuO40lLB5c7y2cu3p5n7bwD4Z1K0o5hmsbR3UX9rzfkR+G/Dlj4R0W30/TrWGzsrSMRxRRLtVFHoKj8WeKtP8FeHrzVNUuobGwsYmmnmlcKsagZ6ml8T+KNP8G6Hdalqd5b2NjZxNLLNM4RI1AySSa/M79tv9t2/wD2jNck0fR5JrHwjYykxxg7ZNQI43v/ALIPIXuK/O+HuHcTnGJstIrWUn/W7P1nivizB5BhL6OdrRiv60SMf9tb9rnUP2nfHMkNtJNa+E9MlK2FqDtN0ynmWQfqo714nRRX9F5fl9HBYeOGoK0Vt/mfyTmmaYjMcVPF4mV5SfyXkgpGXeu3O3cOvpSt92vQP2Y/gbdftC/GPTfDlsH+wTOJ9RlVc+RbKRu57bhkDPU1risVTw1GVes7RirsxwWDq4vEQw1BXlJ2R9Xf8Eq/2a/7O02b4iapbfvtQzb6QjoVMUXR5On8XQHoa+2qzPCvh218KaDZ6bZQra2djEsEMSDAVV4HFadfzDnea1Mxxk8VU6vRdl0P7P4ZyOllOX08HT3S1fd9QoooryT3wooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAD0pjLlce3NPIyKaRigD8zv+Ck37NTfCT4p/wDCTaXb+ToPip8tsQ7be4A3Mp4wu/BwPr6V81Z4r9i/2jvgnY/Hv4Q6t4dvFVWuoi1tKRzBMvzI4+jDnHYkV+QnivwneeBvFF9o2pRyQ3elzPbSo6lWyp+UkHnnrX79wDnyx2E+q1n+8p6eq6H8seJ/C/8AZuPeLpL91V/B9TPY4X/62a+nv+Ca37UR+EXxJ/4RbV7gJoPiSVUjZ3/d2tySAuOwVsgE9M18w0qO0bho3kjdTlXT7ynsR7ivrM2y2lmODlhay+LbyfRnw2Q5zWyrGwxlHeL1811X3H7hpyRjHIrx39tj9mK3/aV+E1zYwrEmu2I+06dMRg7158st2V8YP1rmf+CeH7VS/Hv4Zf2XqlxH/wAJP4dVbe7BcE3KDhZV9QeAT0zX0Q2Cvf0zX811KeKynH2+GpTf9fef1/RqYLPsru/ep1Fqu3/DH4g3+nT6TqU9ndRPb3dqzRTwOMGJ0bB6/Soa+1v+CoH7Jy6Xcv8AEbQbUC3kULrcUa/cx92cADgf3j6cmvirY3Pyn5Tg8dD1r+jchzqlmmDjiqe+zXZn8kcTcP18mx88HV1S+F910Eooor2T58KKKKACiiigAooooAKB1ooHWmOO56p+xKcftVeB/wDsJ/8Asor9ctvH0Nfkb+xLz+1V4H/7Cf8A7KK/XIf/AF6/DfE7/f6X+H9T+k/Bf/kWVv8AH+h8n/8ABXfRnvf2fdFvFVitjrkZkIHCBoZlyfQZIHPcivzpxxX7DftRfCRPjf8AAzxF4d2j7RdW5e1LDhZ0w8Z+m4Ln2zX4/wCsaZNo2sXVheQtb3VlK0M6N8rRyK2MEHkZxX03hnj4ywMsL9qL/BnxPjFldSnmkcYvhnFfetCGijOaK/S9HsfkPUKKKKACihvkPzfL9aGOw/N8v1oFdWuFA2scNgqeCD6VY0nRLzxHq0Wnafa3F9f3BCRW0MbSSyE8ABVBJyT2FfVn7OH/AAS31zx1Pb6p46mk0LS/lIsIzuvJB3DN/AD0weRXkZrnmCy+n7TFTt5dX8j3cl4azDNqqpYOm357JerPmz4ZfCfxF8Y/EcOkeHdLm1S+k6qgKQwjOAXboo9Sa/Qn9kv/AIJ2aF8E/s+ueJtmveJlRXBlUGCxPXCDoSD/ABH0r3L4U/Bnwz8FfDkel+G9KtNNtIx83lp88p/vM3Vj9a6jPPBHPSvxbiTjvFZgnRw37un+L9Wf0Vwj4Z4TLGsRjbVKq8vdXov1BE2Lt/D6VzvxL+KGifCrwlda3r1/b6fYWqk7ncAuQCdqjqzHHCjJJ4rh/wBp39r7wr+zVoDPqNwt9q0yH7NpluwaaZscbhyVXP8AERgV+a37QX7Snif9o3xZLqGtXsi2aMfsdhEdsNunoR/E3vXLwzwbiMzmqlS8KX8z6+h2cY+IWDyeDoUffrbJLp6nZ/ti/tu61+0trj6fZmbS/CFrJ+4tFbbJekHiWU9h/sHrXhdFFfvmX5fh8FRWHw0eWK+9+bP5fzXNsVmOJlisXLmk/wAPJBRRQzBFLMQqrySegrusebdddgypznOMZOOuK/TX/gnF+zSfgn8JF1jVIdviPxIFuLklNrQRdUj9Rgckep9q+RP+Ce/7NzfHj40w3moW7N4f8NSLeXgKnbLPkGOEnp2yV9K/UiCJYYFRFCqvAAHQV+Q+JPEC/wCRXRfnL9EfvfhFwrdvOsRHygv1JFXmnU2OnV+Qn76FFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAB6V8J/wDBVf8AZsFpNb/EbS4W2sRaaqidCScRyn6dCfp6192N901h+OfA+n/EPwnqWi6nB9o0/Vrdra4jI+8rAg49Dz17cV7GQ5vUy3GwxUOj1811PneKsgpZxltTB1N2rxfaXQ/FM8fnigjI6Z9s4zXZfH34N33wF+Kuq+Gb5dps5C8EmDi4t2bMbjPUdFz68da42v6cwteniKUa9N+7JXR/GeLwlXDV5UKytODs/kdd8C/jPqXwH+Jel+JtMkkY2LgTwfdF1ASN0TD1689utfrj8JfitpPxi8Bad4g0mdJLPUIw4AYFkbHKH/aHOR7V+MB6V9Jf8E7v2tpfgn4+Xw7rd1/xS/iCYIHlbC6fckgBsnhY2yMseBjPavhOPOF5Y7DvG0F+8hv5r/M/S/DDjL+zcT9QxUv3VR6eTP0k1/w/a+JdHurG+t47m0vYjbzxSLuWRCCCCPcE1+U37Z/7MV1+zN8VZrdFkk0DVnaXS7ls/Kv3miJ6Fh09cc1+strOtzArr8ysMg+org/2lP2ftJ/aN+GV7oOpKsczKZLO6C5e0mH3XX6HGR3FfmHCfEU8pxl5P93LSS/X1P2fjrhOnnmAvS/ix1i+/l8z8eWG3rxwDz6HgfnRW58Sfh1qnwm8d6j4e1i3+y6jYTMJF/hcHhWX1Vh0xxmsMjacHr1xX9HUasKsFVpu6lqj+R62HqUKjpVVaSdmvMKKKK0MwooooAKKKKACgdaKB1pjjueqfsSf8nVeBv8AsJ/+yiv10r8i/wBiT/k6rwN/2E//AGUV+ulfhvid/v8AS/w/qf0n4L/8iyt/j/QRuVNfGH/BQf8AYNuPGd3N428G2bTakitJqWnxDJuhjmRFAy0g5+Uck4xX2g3IqMjK+vavhspzbEZdiFicO9V07o/SOIMgwub4R4TFrTo+qfdH4g3tlJY3s1vJHJHPbPsmiZSHib0YdQfY1D3r9Zvj5+xF4D/aEdrnVdL+x6soO2/sz5U2e27HDfiK+dfEn/BHKZbpm0fxpH9nY5Ed7YB2T6MpB/lX7Vl3iLltaC+sXpy6rdH865t4S5xhpuOFSqR6O9n8z4j3Dn/Z6+1BJVN23I6j3r7d8Mf8EdbhLhW1fxwfJ3DcllYbXI74dnO0++Diva/hh/wTd+F/w3VJpNFbXryMh/P1R/PJYc/d4X8CMVpjPETKKMbU25vslb8WZ5b4U55XlaslTXdu/wCB+bXw8+D/AIn+K2ora+G9B1LVpWI3PBCWjQk4GXxsX6sQB34r6h+Cn/BJHWdVaG58a6xHo9qxDtYac3mT9eQ0jZVT7rnFfemi+HrLw9YR2un2tvZWsIASKCNY0UegAGB+FXmdQa+CzbxIzDER5MKlTj97+8/UMj8IsswrU8ZJ1ZdnovuPPvg5+zH4M+A2mLD4c0a2tZsASXTKHuJvdnPJ/D8q79cRrVXXPEFj4d0ya8v7y1sbW3QySzXEgjjjUDJJY8AAA18v/tA/8FRvCvw++0WPhSMeKNUTK+YDts4zjht/8YB5wvJHSvksLgcwzSt+7Uqknu3/AJs+4xmZZTkeHtUcacVslv8AcfTfibxVpnhLRLi/1K+s9Ps7dC8k9xIqRoACSSSQO1fFX7Uv/BU1fLutF+HKNJJ80UmsTphY+xMKkfMfRjxXy38cP2lPF/x/1hrjxFqkk9rv3wWUZMdrb/7qjkn3b8a4Ov1jh7w6oYdqtmPvv+VbL/M/DeKvFnE4tSw2Vrkh/N1fp2Luv+Ib/wAVa5dahql1PqF9eMZJLieQvIT/ACA9hVKiiv0yNOMIqENEui6H47OpOcnOo7t9XuFFFBOBVEgTirOk6Rea5q9rY2Nu1zfXsqwW0IQs00jEBVAHJySBgetVijbflUk9uK+vv+CWH7Nn/CXeLJvH2pw+Zpeju0GlCROJbj/lpKMjBVf4SO/0rx8+zaGW4KeKnulp69D3eG8iq5vmEMHT6vV9ktz62/ZE/Z+tP2cPg1puiR7ZL9lE9/cY+a4mbkkn26D6V6pUYVQduKkr+Y8ViZ4itKvVd5Sd2f2fgMFSweHhhqKtGKsgooornOwKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKaV6+9OPSm9fyoA+Wv+Cm/wCzZ/wtP4ZDxVpdvu1rwujSybUy09rz5i8ddv3h9DX5vdvwz+HSv3BvLRLyzkhkRZI5VKujDIYHsa/KT9uX9nKT9nr43XUFrDJFoOtM15pr4J3FjmSL/gOc47Dmv2Dw34g5k8srvbWP+R/Pvi7wtySWb0Fo9J/ozxmj5T97cF7leoHtQDmgrvGPXiv1xW2Pwm1tVofoR/wTW/bGbx/okfgPxJdf8T7TI/8AQp5Xyb2Eds93UdvT6V9fB934HmvxH8M+KtQ8I67Y6vpt1LY6hp032i2nQ7WhYc8j+IcdO9fqx+xx+1LY/tM/DlbhzDa+INOxDqdkHBMUmPvr6o3UH6jtX4Xx5wv9TqvH4WP7uT1XZ/5M/pXww42+vUVlmMf72K91/wAyX6nH/wDBQX9j5fj74JfXNFgQeKtFjLwgLzexjlojjkkjO33r8zbizks7qSCWNonjd43iYcxOnUfpX7hFQy4618L/APBSf9i4wPcfEDwrZ/u9pfWrKGMnAHP2hQBxjkv2wM+tdHAfFnsJLLsTL3X8L7Pt6HH4ocD+3g83wMffj8a7rufENFCneBt53ZxjvjrRX7YfztotgooooAKKKKACgdaKB1pjjueqfsSf8nVeBv8AsJ/+yiv10r8i/wBiT/k6rwN/2E//AGUV+ulfhvid/v8AS/w/qf0n4L/8iyt/j/QKKKM1+aH7IDcimjhaSZl8tgdvQ8GvEfjz+3r4B+A5ltbnUP7Y1iPI+wad++kRvR2+5H6EE5Hoa6sLgq+Kn7LDwcpeSOHMMywuCp+1xdRQj5s9tY4/vUjTqi8sB7k1+eHxJ/4K3+Mtfmkj8O6NpWg2rZVJrn/Sp+eh2j5QR7jHrxXhnxG/ar+InxWSVNa8WaxcW8uVa2ik+ywODwQUiKgg9MNwe9fcYHw1zKtZ1nGmvN3f9fM/M8y8YMnw91hlKo12Vl95+nfxX/a2+H/wcgmXWvE2nQ3UYP8Aotu/2i6z6eWmWB+oxXzF8Yf+CvBImtPA+gFuCqX+psVHswjXnPfk18Pt80m75tx64GP1yc0tfcZX4c5dQlzYluo18l93+Z+aZz4uZxi04Ya1KL7av7ztPil+0N4y+NWpmbxH4gvr6JW3xwFvLtoj6Ki/zbiuL5AZm+ZmNFFfdYfC0qEPZ0YqK7JWPzXFYyviantMRNyl3buFFFFdBzBRRRQAUqcuv1pGbaMngDkk9qHPlgljt28knjH1ppXBWvqdB8JvhjqPxj+IWleG9LjLXmqS7DJ18lMgM+B2Uck9gK/YD4SfDPT/AIReANN8O6XF5VlpsQiTjBfHVj7k5NfMf/BLL9mj/hEPCk3jzVbVlvtcQJpqTRlZLa29cEZBb+X1r7DLYFfgHiBxB9dxv1Wm/cp/i/8AgbH9QeFXCry/A/XsQv3tX8I9Pv3EAw1Ooxk0V8Aj9YCiiimAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAB6V47+2v+zrH+0R8GryyhjX+2tPVrvTnI5MijPl57B8bTXsLcrTcZBroweLqYWvHEUnaUXdHFmOX0cbhp4WurxkrM/Dy6spbC7ltbqNrea2dopISMGOVWww/Sm19Vf8FP8A9mf/AIVr8QF8aaXCI9F19lS7RE+W3uyfvE9AHHHPVuK+Vd3T3JA9yOtf1BkuaU8wwcMVT6rXyfU/i7iDJauVY6eCrfZej7roALKcrjd2z0rtPgJ8ddZ/Z4+Itr4i0WRpGhIFzA7bUvoCRujYf3hzg9utcXR838O0t2BPGfeu3E4aniKUqNZXi1Zo83B4qthq8cRQlyyi7p+Z+zXwX+MGj/HL4fWHiLQ7mOa1vEBZdwLQP/FGwHRgeoNdNe2cV/byQzRrJHIpVlYZV1PUEd6/KT9jX9rW8/Zg8ehriSabwrqTKNQtuX8sA/65F7MOSV6kCv1P8KeKbHxn4ftdU064iu7G9jEsMsThldSOoIr+cuKuG62UYnl3hL4X+nyP624J4uo59g/e0qxVpR/X5n5w/wDBQb9jWX4GeKp/FGhW7SeFNWmLzIqHGlTMf0Ricc9K+af73+zjPtnpX7ZeLvCWn+OPDt7peqW0d3Y38LQTRSLuDKwI/Pnr2r8sf2yf2StQ/Zj8dNtWS58MahI76febT+6Y8mKQ9M+lfpHAvF31qCwGLf7xKyfdf5n5D4lcBvAVHmWBX7qT95fyv/I8boowcUV+ma9T8fWqCiiigAoHWigdaY47nqn7En/J1Xgb/sJ/+yiv10r8i/2JP+TqvA3/AGE//ZRX66bq/DfE7/f6X+H9T+k/Bf8A5Flb/H+gHpVTUNTh0uxmuJ5oYYoYzI7yHCxqBksfYYqyzgIee1fD3/BT/wDawmspW+HPh+78uaVBJrE8MvKJ1EAI6FhyR1AOa+KyTKK2ZYyOFo9dW+yP0TibiChk+AljK3TRLu+iOW/bX/4KL6h4z1G88LeAruSz0mPfBeakh2y3h5DLEeydeep9q+RZZHuJpJJJN8sp3vJITJJIfc037p9udiZztz1JPrRX9IZPkuFy2iqOGj6vq2fyDn3EOMzfEuvjJN9o9Egooor1lseL5sKKKKACiiigAooooAKKKKAD8M+3rXp37JXwBuv2jPjNp+jqrHTIXF3qcgUsqwgjKk9AWGQM9a8xUBpNpVmyQCqjLHPoPev1H/4J7/s3D4E/Bq3udQhX/hIteC3V8+3DRqeY4/UYBGR6k+lfJ8ZZ8stwDcH+8npHy8z7rw/4XlnGZx9ov3cNZefke6aHo9v4f0i2sbSNYbWzjWGJFGAqgYAq7TVGD0p1fze5OTcmf15GKhFRirJBRRRQUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAHpTeAacTgU3GaPMDjfjr8ItP+OPwy1bw7qEatHfW7rE5H+pkwdjj3U4NfkH8RPAt98M/G+qeH9VjaPUdLuWgfKlQQDlXGezL371+123j8K+Jv+CrH7NX27T7f4jaRbK09mottWVV5eEnCS8d1J5PpX6F4e5/9UxX1Kq/3dTbyZ+Q+LHC313Bf2jho/vKe/nHr9x8JUUDlc9sZzRX70fzLa2wb2T5lxuXkZFfTf7AH7acnwN8RQ+FvEF3K/hXUJQkU0smRpchOByePLJPJ6L17V8yUEZFefmuVUMxw0sLiFo+vZ9z1sjzrE5Xi44vCu0l06Ndmft7p19DqECzQzJNFKodGBzuB6GsH4sfCvSPjL4GvtB1u2W4sr6Ipnb80R7Mp7MOtfFH/BPT9ug+Fri18C+ML3/iVyMqaTqNw/zW5Jx5UrHoCTwT0/l99xssy5Vtw6iv5vzbKsVk+M9nK6s7xl3Xc/rrIM+wXEGXe0jZ8ytKL6d0fkN+03+zVrH7M/xBn0vUFkk024dpNNvVjPlzp/cJ6bh3Fea9a/ZD49fAjQv2hPAF1oOuW6ukykwTgfvLWTHyup9QcH3xX5U/tA/AHXv2cviBPoetRbUJZ7O5VD5V9D2ZWIwWA6gdO9fs3B/F8Myp+wrtKrFf+Bef+Z/PPH/AtTJq/wBawycqEn/4D5M4WigDcAR/FyPeivu2fm2oUDrRQOtAo7nqn7En/J1Xgf8A7Cf/ALKK/XFl/lX5HfsS/wDJ1Pgf/sJf+yiv1yYfKa/DPE7/AH+l/h/U/pTwY/5Fdb/H+hzvxZ8fWvwt+G+teILtlEGkWUt0wJxu2qSFHuxwoHckCvxt8YeLL7x34q1LWtQna4utSuJLiZ3PzEsx2j8F4r9Hv+Cp3jSTwz+y/PZo3lnXNRgsiQeWUHzT+fl4r8z6+i8McCoYSpjGvek7L0R8j4y5tKePp4G/uwV2vN/8AKKKK/ULW2PxnUKKKKACiiigAooooAKKKKAChm2jPpzQTgVd8OeH77xZ4hstL02FrjUNQnW3tolUsXkYgAYHPUjNTKpCEXOpstX6GlKlOpNU4K7ei82z33/gnH+zc3xp+Lqa5qUO7QfC8qzzK6HbPdZBjj6YO0gEj0+tfpzHH5C7R/8Aqrz79mL4FWX7P3wk0nw/arme3jEl3NjDXMzcsxPfk4H0Fei7ea/mvivPHmePlVXwR0j6f8E/sDgXhmOT5bClL+JLWT8/+ALRSEnH40tfMn2gUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUADHC1k+KfDNp4w8N3mlahEtxZ6hA1tMjDKujAg/oa1j0qN1yO/pTjJxkpReqM6lONSLhNXT0Px5/aX+B95+z/wDGHVvDtzGxg8w3VhIQQs1sx+Ur646cdCMVwNfpr/wUg/Zp/wCFx/CBta023Z/EHhdGuYSibpLiDGZYsDk/LkqPUV+ZRGD9c4/Dg/lX9I8IZ4sywEZy+OOkv8/mfyDx5wzLJszlTgv3ctY+nb5BRRRX1R8SKhYONp2tngg7cH69q+6/+Cef7d/9pmz8B+Mrz/SWbydI1Gd9v2gdFikJPD5IC924HpXwmOtO814fnjkkjkXlWjba6nsVPY+hrxc+yPD5phnQrLXo+qfc+j4Z4kxOS4tYrDvTrHo0fuErZXd1+nevP/2jf2eND/aQ+HtxousQ7ZMb7O6RR5tpMPusD6A4JHQ4r57/AOCf37ei+OorfwX4yulj1mMiLT792CpfLwFRiekhOAB1Y4xzX2IDk9a/nXMMvxuT432c9JRd011XRo/rLK80wHEGXe0haUJK0ovo+z/Q/G346/A7Xv2f/H1x4f1632sGL2dwqlY72Ls6E9cdwOneuNB3dOc8j3r9gP2kv2a9B/aW8AzaTq0fl3SAvZXsYHm2kuPlYH0zjK9DX5YfHP4Ga/8As/ePLjw/r1qyyK5e0uVQrHexdmQngkdwOlft3CXF1LNafsato1UtV0fmv1P5u464ErZJWdagnLDyej/l8n+hx1A60A5QN/C3APY0L1r7jzPz1b3PVP2Jf+TqfA//AGEv/ZRX66DrX5FfsTMB+1V4HGef7RBx7FeK/XUH+dfhfif/AL/S/wAP6n9JeC//ACLK3+P9D5C/4LCS4+C3hqP+9rYP5QS1+elfoR/wWF/5I/4X/wCw1/7Qlr896+68PP8AkTQ/xS/M/NfFj/koJ/4Y/kFFFFfcH5qFFFFABRRRQAUUUUAFAGTRSOcI2c4x2oKQo3E/u/v9V4zzX2h/wSp/Zr/tbVp/iNqVuGs7cNbaMXX/AFx/5aTDPXngEe/pXy18F/hNqHx1+KeleGdPG6TUZ9ssq/8ALpAMb5PqBk/hX6//AA78CWfw28F6boenxLDZabAsEaqu3OByfx6/U1+a+ImfPDYZYGk/fnv5R/4J+ueFHDCxuMeY117lPbzl/wAA2gzZ/GpKYMn86fX4af0yuwUUUUDCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAbPEs8LIw3KwIIPevyv/b9/Ztb4B/GmaaxhaHw/4jLXVkyqSscg5li9PfHoc1+qR6V5V+1/+z9a/tGfBrUdFeJf7ThU3Wmykcxzpyoz2ViNp9jX1HCOfPK8fGcvglpL07/I+G4+4ZWcZZKNP+JDWP6r5n5GY5oqxqWk3Ghapd2N1A9rdWcrQXERB3RyocEEdRxzz2qvX9JxlGSUou6etz+QpRcZcslZrcKDnHHXtRRTJJLe4a0vEmimnt5Y8MJIm2spHcHsfev0E/YI/b5T4hRW/g3xldRw69CFjsb5yFj1BeFVWJ4EvQY6t9ev574zUlvdSWl0lxDNNbzRkbXiJVlI7gjuK8HiDh/D5rhnSrK0ltLqn/kfTcL8U4vJMUq9B3i/ij0a/wAz9wN2R9fSvPv2jP2b9A/aS8DTaRrMJjuFUtaXsQHnWknZlP1xkdDivnz9gj/goAnjaOy8F+NrqGHWFCw6fqLttjv+QqoxP3ZScADq31r7EQ5Od2R7V/POOwGMyfGck7xlF3TXXzR/V2V5pl3EOX88LShJWcXun2a/I/HL4/8A7P8Ar/7Onj+fR9ctSsbMTZXiqfJvo+zA9Nw7gdK4lOWH93ODX7GfHz4A+H/2h/A1xouvWyyKwLW9wnE1rJjh0PXIODjocV8XeJP+CQHjGDxJImj+JPDs+lyNhJ7xZo7mNO4KqrK3HbIz7V+vZB4gYSvQUcwlyTW+js/M/BeKPCzMMLiubKoupSlstLryZ4/+wVot1rP7VvgqO3iaQWtw1xMwUtsjSInJ9BnjPrX61Hp+NeD/ALIH7Dmj/svwzX0lwNY8RXi7JrwptWNf7sa/wiveD0/GvzfjXPKOZ4/2lD4Yqy8z9e8OOGsRk2WOnitJzd2ux8g/8Fhv+SQ+GP8AsMj/ANES1+e9foR/wWG/5JD4Y/7DI/8AREtfnvX6t4ef8iWHrL8z8P8AFb/koan+GP5BRRRX3B+bhRRRQAUUUUAFFFFAAOaAd6bhyrLuBHQj1o27/l9eOTivXv2LP2eZP2jPjhZ2NxG7aLpey91J9hC+WGGIP+BYI/GuPMMZTwmHliarsoq78/I78sy6tjsVTwlBe9N2/wCCfW3/AAS9/Zq/4V98PD401S3H9reIlH2bemGt7Ufd68gt1PtivrSq1jYQ6XaQwQRrHFCojRFGFUDgADsBVmv5gzbMqmPxU8VV3k/uXQ/tHIMmo5XgaeDorSK1831YUUUV5x7AUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAU1l605ulNNLfQD89P+Cp/wCzWfB3i+38faTDs07WmW31RET5Y5/+WcnHA3HCn1P1r5EzxntnGfev2h+Lvwx0/wCMHw81bw7qcayWup27Q5IyY2I4ce4OCPpX4+fFD4a6h8IfiFq3hvVFb7Zo9w0DHaQskf3o3HrkY5r938Pc+WLwn1Ks/wB5T281/wAA/l/xV4X/ALPxv9oUF+7qPXyl/wAEwaKKK/Rj8mSsgoPNFFAyS3uXtpFaOSSNlOVeNtrIfUHsR619+f8ABPX9u8+OobXwV4xuo11mNQmn3zsFW/ToEYnpJ0AHVvrX5/jrUljeTaTfW9zbzTW11ZuHhuYHw8RzkMMdwefwrweIMhw+a4Z0aukvsy7M+m4X4oxOSYtYii/d+1Huj9wFOSMYxUlfPf7A37Wkf7Rnw/aw1KSJfFGgqsd6mRmdD9yVfUHuema+hM1/NuYYGtg8RLDV1aUXY/sDKc0oZhhYYvDO8ZK/p3QHpTT0/GlJ4pD0/GuM9I+Qf+Cw3/JIfDH/AGGR/wCiJa/Pev0I/wCCw3/JIfDH/YZH/oiWvz3r+hPDz/kSw9Zfmfyf4rf8lDU/wx/IKKKK+4PzcKKKKACiiigAozRRuC8sMqOSPWjoF7D4beS4uFhSOSSRnEYRFLMzHooHXJ9K/Vf9hX9nCP8AZ5+DNnFdrG+vasPteoTAc7m5CD2UdvXNfIX/AATP/Zr/AOFq/E7/AISvVLfdonhiRTEWUlbm7yCvPRtnBPpxmv0nI2dB+lfi/iRn3PUWWUHpHWT8+x/Q3hDwvyU3nGJWstIeS6scp5p1RgZ7VJX5WfuW4UUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFACOodCrdCMGvjn/gqf+zYfFfhW38e6TB5l9oqGLUFjTJmtjzvOOvl8kk9F9hX2O33TVHWdIt9e0m6srqFbizuo2imidcq6sMEfiCa9PJ8zqYDFwxVPeL1811PD4iyOlm2AqYKr1Wnk+jPxFzzRXpf7WnwDuP2dPjLqOhssh024drrS5mUgPbk5xnoSG4OPSvNAcmv6fwWMp4qhHEUfhkro/i/MMDVwWJnha6tKLs/l/mFFFFdRxhRjP8RX3Aziiii3ca7o7D4HfGPUfgN8UdM8TaWzq1pIGuIVb5biIkb4SO4K5wexOa/Xj4b+P9P+J/gjS9e0yaOaz1SATRbWBx/eH1ByD7ivxXFfb3/BJf8AaDYT6l8O9RutyqG1DSTI2COcSxD6H5wPTca/MvEXIfb4b+0Ka96G/mv+Afr/AIS8TywuL/svES/d1Ph8pdvmfc/Q0p6fjQpytB6fjX4ef0wfIP8AwWG/5JD4Y/7DI/8AREtfnvX6Ef8ABYb/AJJD4Y/7DI/9ES1+e9f0L4ef8iWHrL8z+T/Fb/koan+GP5BRRRX3B+bhRRRQAUUUUAA5rT8FeE77x94u03RdLjabUdUuFt7dVUt8xIGSB/Cuck9h1rMVDN8q5+bgYr7k/wCCVH7N/wC4n+IurW6t5+bbRgyfdj6PKPrjAP1rw+Is4hluCliZ77Jd30PpOFcgq5xmMMJT23k+0VufVH7PXwVsPgR8LdJ8O2KACxjBmcf8t5SMux9ck/y9K7ymleadX8yV8ROtUlWqO8pO79T+zMHhaWFoxw9FWjFWSCiiisjoCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAD0pv3SKcelIelTIDwD/goT+zX/wAL4+D095YQ7vEHh1WvLIqm55lA/eRAAZJZc4H97Fflw6sHkWTHmQyGM7fVTgj8O9fuK674ypXIPGK/ML/go7+zZ/wpH4uSaxptusfh/wAVN5sYVSq2s6fM656fN1xX654bcQcs3ldV6PWP6r9T8H8XuFrxWcYdbaT9Oj/Q+dqKB8wyOR60V+xeZ/P/AJBRRRQAKMt6e/pXS/CH4k3Hwg+JuieJbVnEmlXazuqdZYtwLof95QR+Nc1R9enesq9GNanKlNXUlZ/M2w9edGrGtB2cWn92p+23hbxBb+KfDtlqVrJHNb30KTRujBlZWAIII4PXqK0D0/Gvnn/gmb8TG8f/ALMen2c8yy3nh6Z9Nf5stsU/Ix9ipGD7V9DHp+NfytmmDlhMXUw0vstr/I/tzI8wjjsBSxcftxT+fU+Qf+Cw3/JIfDH/AGGR/wCiJa/Pev0I/wCCw3/JIfDH/YZH/oiWvz3r928PP+RLD1l+Z/Mvit/yUNT/AAx/IKKKK+4PzcKKKKACgrvG3n5uOBzQBk0hMezMn+rK7iQeq9z/APXo0Ha9kv8Ahzuf2evgjd/tB/FrS/DNqjCK8fzL2dD/AMe1qCNz+xIzjPU1+vXg3wrZ+B/DVnpOmwpb2NjEsEMartCqBivnb/gmh+zQ3wi+FX/CSata+X4k8UBZ5QyYNtB/yzjGRxxyfqPSvp1hg1/PXHeffXsa6NJ/u6ei831Z/Vfhnwv/AGbl31msv3tTX0XRAeDTqavAp1fDo/TAooopgFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRnFAOaACijNBOKACijOaM0AFFGaM4oAKKM0BsmgAooDZooAKKKKACiigHNABRRuozQAUUZooAKKKKACiijNABRRnNFABRRRQAUUUZoAKKM4o3UAFFAOaKACiiigAooooAKKKM0AFFGaKACijOKN1ABRRRQAHpXm/7UvwKs/2hvg/qnh+4VftTxmaxlI/1Nwoyhz6Z4PsTXpGaaee1bYfEToVY1qbtKLujlxuDpYuhPDV1eMlZo/EXxDod34Y8QX2nX8LwXtjK1vLGVKlGVsHIPTI5qnX2Z/wVX/Zs/sPXbf4gaTBstL4Lbaukafdkz+7lOOmeFJ/xr4zKkdunX2r+nchzaGZYKGKhu912a3P4x4nyKrlGYTwdTZO6fdPYKKKK9k+fCgHn09zRRjdxR1Fpu9j7O/4I8+NWg8aeLPD0jbUurSLUYkJ7q/ltgfiK++D0/Gvy7/4JkeJn0H9rPR4PurrFlc2b/hGZsfmv6V+oh6fjX89eIWH9lnEpfzJP9P0P6s8JcY62Qxpy3hKS/VHyD/wWG/5JD4Y/wCwyP8A0RLX571+hH/BYXn4QeF/+wyP/REtfnvX6b4ef8iWHrL8z8c8Vv8Akoan+GP5BRRRX3B+bhRRRQAHkenvXtn7Bn7OTftB/Gy3a6j3aB4fZLu9BXKOcgpET05I5HpmvGdPsLjVdQgtbWKSa6uZFihjRSzSOxwqgDkkkgADrX6xfsY/s82/7O/wZ0/TXjjbWLxftWozKOZJW/h+g6fhXxPHHEH9n4J06b/eT0XkurP0Lw54WebZlGpVX7qk7vzfRHrVpbR2NrHDEoSKFQiKOigdKmqML+vNSA5r+efU/rSKSVkFFBbFGaCgoozRmgAoozRmgAoozmjNABRRmigAooooAKKKN3NABRRmjNABRRuooAKKKM0AFFG6jNABRRmjNABRRmgNQAUUE4o3cUAFFGaM0AFFGaKACiiigAoopNwoAWijNBOKACijNFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRnFGeKAA9Kb9004sAM1T1nXbPQNOuLy+urezs7VDJNNPII44lAySzHgADnJoim3ZEykormk7JFpsE+9IThfX8elfHn7Q/8AwVW0nwjc3Wl+CbBfEV3HmN7+fMdnG3T5Rw0g91496+WfiB+3Z8UviDcSSTeLNQ063k+X7LpoFtGo+o+Y/jX2uV8A5pi4KckqcX1e/wBx+b5z4pZNgJulBupJdI7fefrMZ1B+8oPuadHID/d+or8Xbn4weLbqfzpPFHiKSTOQzalKGB/Ctvwz+1H8R/CUiNp/jjxIhVgwWa8aeMEeqsMMPY9a92p4XYpL3K8W/RnzdHxqwblaph5Jd7o/Yg8HtS7gO/51+enwZ/4Kz+JPD8kdr400201azUhWvbQeTOo7sU5U4HOBjNfbHwX+PPhn49eF01Tw5qUN5HgeZFnbNbn0dOqn69a+LzjhnMMt1xMPd7rVH6JkPGmV5v7uFn73Z6P/AIJ2eDijHFGeKBkD/PFfP+R9SBwv40YHrXzL/wAFNPjL4m+C3w08P3fhfVJtJurvUTDLJGituXy2OPm+nH0r4v8A+G8fi5/0O2of+A0P+FfaZLwTjMzwqxdGSSbe/kfnnEXiPgcnxrwVeEnJJPTzP1qwPWjA9a/JX/hvH4uf9DtqH/gND/hR/wAN4/Fz/odtQ/8AAaH/AAr1v+IY5j/z8ieF/wARmyv/AJ9T/A/Wo4HvSb1AySFHXmvyW/4bx+Ln/Q7ah/4Dw/4UD9u74ts3/I6ah6f8e8P+FH/EMcx/5+RD/iM2V7eyn+B+tCFWP3s0pPb+dfEX/BND9pPxt8ZfjJrGn+JtfudWtYdGa6jjkjRQjiaJc/KOuCfzr379uzx/rHwv/Zh8Sa3od49hqdo1qIJ1UFot11ChIB/2WI5r5TMOH6+EzFZdUa5nyq/TWx9xlPFmGx+UyzenF8kebTr7p7AOaMD1r8lf+G8fi5/0O2of+A8P+FH/AA3j8XP+h21D/wABof8ACvq/+IY5j/z8ifEf8Rmyp7Up/gfrVgetGB61+Sv/AA3j8XP+h21D/wABof8ACj/hvH4uf9DtqH/gND/hR/xDLMf+fkRf8Rmyv/n1P8D9ajgDr+tIGU/MG9q/JY/t3/Fxhj/hNtQ54/494R/SvrD/AIJg/H/xd8br3xknifWptWXTRZm3EsSoYvM84t93jqo/KvMzjgXG5dhZYutOLirbeZ7OQ+JmAzXGRwVGElKXc+umI3daMD1ryP8Abd8fat8M/wBmjxNrOh3Umn6lZpAYLhF3FC1xGhwDx0J6+tfnj/w3j8XP+h21D/wGh/wrmyHhHFZtRlWw8klF219LnbxRx9g8jxEcNiISk5K+h+tWB60YHrX5K/8ADePxc/6HbUP/AAGh/wAKP+G8fi5/0O2of+A0P+Fe5/xDHMf+fkT5r/iM2V/8+p/gfrUQPWk3gEZx7Zr8lv8AhvP4uLz/AMJrqBx2+zQ8/pXT+Dv+Cm/xY8M3Ef2rVdP1qEEEx3dkseR6FkwfyrKt4aZoo3hKMn2uaUfGPJ5StUhOK72P1DJ//XRjNfKf7O3/AAVI8N/E29t9L8VWv/CJ6lOVRJpZRJZysSB98f6vP+3gDua+qILpLiJZI5FkjcZVlOQw9q+MzLKcVgans8VBxfns/Rn6Nk+eYLM6XtcHNSXbqvVDhIpJG7pwR6U7A9a+Pv8AgqF8fPGHwY1rwbH4W1y40hb+O7e4EaK3mbPK29f9418rf8N4/Fz/AKHbUP8AwGh/wr6bKOBcbmGFji6Ukoy7nxmfeJmX5VjZ4GtTk5R7eZ+tWB60YHrX5K/8N4/Fz/odtQ/8Bof8KP8AhvH4uf8AQ7ah/wCA0P8AhXpf8QxzH/n5E8j/AIjNlf8Az6n+B+tWB60YHrX5K/8ADePxc/6HbUP/AAGh/wAKP+G8fi5/0O2of+A0P+FH/EMcx/nj+Iv+IzZX/wA+p/gfrUcAdf1oH8q/JX/hvH4uf9DrqB9vs8Iz+OK9k/YO/av+IXxR/aU0fRde8TXWpabcW100lu8SKrMiZXlRz61x4/w9x+Ew88TOcWoq7O7LfFfLcbi6eEp05qU3ZXsfoMKdTVfJpxOK+DP1MCcCmhlPfdg84pWI2mvz7/a9/wCChPjbwh8eta0Xwdq9tZ6PopS1Ym0jnZ5x985ZTwOnUDNevkuR4nNK7o4a10r6nzvEnE2EyXDxxGLvZuytufoFmlJ2rkkBV5JzX5Y/8PJ/jB/0M0H/AIKrb/CnQ/8ABSv4vQyqzeIreZVIJjOmW6+YPTIGRnpkc19RLw1za124fe/8j4leMOSOSjaf3L/M/UoOG9OuKcea5v4S/EG1+Knw40bxDZyLJb6tbJcKVOQpIGR+ByPwrpCPlr4OpTlTm6c1ZrT7j9SoVoVqUa1P4ZJNejMH4j+ANP8Aif4J1TQdWhE9jqlu9vKuOzAjI9COoPY1+QPxw+E2ofA34o6p4Z1KP97psmI5DlRPCxzHIM9ewz68V+zZ5XvXyh/wVB/Zo/4WH8Pk8aaTb7tY8NozXQRMtPa/x5x12DLD05r7ngHiF4DGfV6r9ypp6Poz8z8UOFv7SwH1uhH95S19Y9T86aKAMrntgHPseKK/f009Ufyz5hQBk0Ubd3HrxTe13sHqeufsJ3Z079rfwO277166df78Mqn/ANCH5iv1qK/LX5R/8E9PDNx4q/a48KtDGzQaeZ7+RgpO1FjwGPsWwM9M8V+rnRq/CfE6UHmUFHdRV/vP6Y8GYzWU1JS2c9PuPkH/AILBgn4P+F/+wz/7Qlr896/SD/grV4Wk139nSxv4Vdv7F1eK4lKjISN0kiJb0GXUZPcgV+b/AEH47fx9K+68OaillCit1Jn5p4tUpRz+U5bOMbfcFFFFfeH5lvsBOBQWAGTyvXjuKK2vh14A1L4q+O9N8P6Wu++1WVYIQq7tuSAXIH8K5yx6AAk1nWrRpQdWbsoq79DahSnVqRpU1dt2Xm3sfS3/AAS9/ZoHj/x9J421S3DaX4dk8uzDDKy3ZwWPodnB9jiv0WVdrdfve3Arkvgl8KNP+Cvw20nw3psapb6bCsZfHMz4BZz7k5611+a/mXiTOp5njp4h/DtH0P7H4N4dhk2WQwy+Nq8n3k/8gbpTAcGmXt/DZWkk000cMcSb3d2Cqi+pPYcHmvj39on/AIKci01s+F/hjYf8JFq9w5t11AQtNCJCdu2KNfmmbOMY4J4rjy3KMVj6nJh437t6JerPRzriDBZXT9pi5Wvslq35JH2BcX0NtE0k0iRovLMzAAAetcjrv7RngLw3c+Tf+NPCtlMpwY59Vgjb8iwNfGOj/sXfHD9qKb+1PHXiafRbG4YSJb38rStECeqW8ZVY8ejHNd5oX/BHnwzbQr/afizX7qb+J7SOK3Df99B/5170sjynDvkxmMvLtCLkl89j5ePEmf4tc+AwNovZ1JW+dj6Lsf2nvhxqUirD488HSOx2hV1i3JJ9Mb66/SvEFjrtustld2t3C3IeGQOp+hHFfJ+o/wDBH7wbLZsLPxN4ot5udrTNbygHsSPLGR7Z5rh9b/4Ji/EL4RTvqngDxw000I8wRI76fPIRyACC0ZJx/FgevFT/AGTklZ8lDFtP+/Gy+9BLPuJMP7+KwKlFb8krv7mfeYbj2zQeDXwV8PP2/viH+z14ri8N/FzQ7q6t43CretAY7lFzguDgLMAOcp1r7W+G/wAS9F+K/hW11rQr63v7G6HDxSBth7q2OjDuDyK8nNMixWAtKolKD2lF3T+Z7+R8UYLNLwotxqLeElaS+R0H8PSs/WvFGm+H3hXUNQsrGSfJiWaZYzLjGdoJycZGceorQOT92vhn/gsk+Ln4eqzMu4ahnaM97XtkA/Q1nkuXLHY2GFcuVSvr2sr/AKGvEmcSyvL542nHmcbWV7bux9lf8LK8PDn+3NHxnr9rj/xp3/CzPDv/AEHNJ/8AAuP/ABr4x0X/AII92uqaTa3TeOLqFZohIYl0qIqhZc9d/arf/Dmmzz/yPt3/AOCqL/4qvaeU5FF2ljJf+AM+bp59xJOKlHAxs9fj7n2H/wALM8O/9BzSf/AuP/Gj/hZnh3/oOaT/AOBcf+NfHn/Dmmz/AOh8vP8AwUxf/FUf8OabP/ofLz/wUxf/ABVH9mZD/wBBcv8AwBl/21xN/wBAMf8AwNH2GfiZ4dx/yHNJ/wDAtP8AGn6f490PVL+O1ttX024uZsiOKO5RmfAJOBnJ4BP4Gvjhv+CNVoBx48vM9s6TF/8AFV5j8FvhD/woT/gpHovhGPUJdRj024H75o/K3l7FpOgY9C5rWnkGV14VHhMS5ShFys4taI5MRxZnWEq0o47BqMaklG6le1z9HNX8Tab4eaFb++tLNrjPlLPMsbSYxnGTzjI6etU2+Jfh5eDrmkrzjm7Tr+dfHf8AwWT5sPAal5FVnvR8pPpB2yA30PBqv4c/4JB2evaFbX3/AAm13At5Ck4i/sqIiMsoJ53+9Y4XI8B9Rp4zG13DnbSSjfZ2OvG8T5n/AGlVy/LsMqns0m25W3Vz7M/4WT4dHXXNJ/8AAtP8acPiX4eJ/wCQ5pP/AIFp/jXx3/w5rs9uR48vD/3Cov8A4qlH/BGqz6/8J5d/+CmL/wCKp/2ZkP8A0Fy/8AY/7a4m/wCgCP8A4Gj7FHxG0Bjga1pefT7Un+NaFtqEF9GrwzRSq3IZWBBr4ob/AII12aKxXx5dBuxGkx8fk4NZGq/8ErfHnw+zd+DfHkMs8fzqpEunSsw5ADIzgn/ewPWl/Y+TVHyUsbZ/3oNIl8RcQ0Vz1cv5l/dmmz717j/Gl3Yr8/dD/a7+M37IHiSLTfiZpd1rWis4Rbu5UbyuRu8udRtkbHRTyTivtL4LfHDw78d/BkOueH76O5t3G2WMkCS2fusi9VYehrzM04fxOCiqztOm9pRd1/wD2Mj4rwmYzdBJ06q3hJWfy7/I67Bz2607OBzwBzTWYKCxIC+pNDSBB96vD8j6jYcGz2ppdUT5to/GvnH9q3/gol4f+Akk+j6OsXiTxKoKtDFJ+4tD281x3H9wfMeg5rwbT/hp+0N+2tLJdavqV14Y8O3mNkM8j2lq0R9IEHmSfKTjfhT3PNfTYPhmtOisTi5qjTezlu/Rbs+LzDjTD0q7weChKvVXSOy9Xsj7h8SfGrwf4PnaLVvFXh7S5F+8l3qMULD8GYVjxftUfDWaTy18feDWYkAf8Tm3OT/33XzZ4a/4I76PHEja14w1K7mbHmC0tI4R74Lbj+Nbdz/wSA8CmHEfiDxWH7EywEfj+7H866vqGQQ0lipPzUNDj/tbiuXvRwUEuznqfUnh3xxo3i6287StW07Uo+m+1uUmUfipNaW4EdcnrXwx4n/4JIa34ekN54P8eNHewnfCt7A8W0jkYkjbKtnGGA461hWH7Svxx/Yp1mOz8e6dceIPD+9Yklu5fMVxkf6u6Axux0WTn6Uf6s4bFJ/2ZiVUl/LJcr+V9yf9dMXg3/ws4OVKP88XzR+dtj9BFbJ/xqSvOv2e/wBpbwt+0h4Z/tDQLwNcQhftVlKdtxaE9nTqAex6GvRAwYcGvl6+Hq0JulWjyyW6Z9xg8ZRxVFV6ElKL2aFoozRurE6gPSq891HbsN8ixlugJxmpmcbT3+lfnz+2XqusftU/tq6b8PdAvpre30pPsLypI/lI5w9xIVUgN5agKRnqMHGa9jJcpeYV3By5YxTk5PokfO8TZ8srw0akYOc5SUYxW7bPv/8AtCEH5pI/bmg38KnmVPzr4U/4dB+Iv+igW3/gBJ/8cpU/4JEeIInVm+IFthTnH2KRc/j5nH1r01kuVf8AQcv/AABnhLiTPn/zLnf/ABI+7Y7hZ/uOrY9DU1fn/wDsE6/qX7Ov7Xev/DnxBdSSNfK1tE0jNsaSL545BvOf3iE4HfHFff4dSfvDv39OteZneUvL66pc3NGSUlJdUz3uG8/jm2Fdfl5JRk4yi900LRRuGaK8c+hCiiigAooooAKKKKACiiigAooooAD0pOopaYwwaAKmu69Z+G9DutQvriG1srKFrieaRgqxRqCWYk8AADOa/Mv9tj9trVvj94om0nSLifTfCFhKUijR9smosOruf7noO/vXuH/BVn9oqbw1o1j4D0m68u51ZBc6m0b5McAOFjPpvIPB6gV8EuWkbJNfsXh7wvD2SzPEq8n8N9l5n88+KnGVWVZ5PhJcsY/G1u/IAvJJLMzNQPmPHPOKtaJoV54n1i107T7OS+vr+UQW9siktcOTgKMc8kgcetfdf7OP/BKzSbLSLTUPiFNcapfMob+zoXMdvCDj5WIwWx0PIr7zOuJMHlcObEvV7Jbs/M+HeE8wzup7PBxslvJ7L5nwUTtbB6+lLtbHQ/lX656Z+xh8LdFshbw+B9AZMYzLbCVv++myf1rhfi1/wTL+Gvj+wmbTNOk8M6gykrPp7ELu7bkPBGewxXydDxOwE58lSnKK76M+5xPg1mkKTnTqQm+2qZ+YudhXg/NyBnBb6V03wl+MfiD4H+L4td8O30lre2+N0QcrDeLnJWUHjHbNbH7Q/wCzr4g/Zo8aHR9ah3QTlmtL6IERXiD0z3A6gciuBDDGeoFfeQlhsfhuZWnCS+8/MalPF5Xi+V3p1YP5r/gH69/st/tJ6T+0v8NodYsG8q8h2xX9q3yyW0uOcr1CnqCeor0rPWvyb/Ym/aDuP2ffjfp9xNcN/Yuquljqa+ZtjUMwAm9Plzn8K/V+2m+0pvVt6Mcqw7gjIr+e+L+H/wCysZyQ+CWsf1XyP6t4A4qedZdz1f4sNJefZnyP/wAFhv8AkkPhj/sMj/0RLX571+hH/BYU5+EHhj/sMj/0RLX58KcMO3PX0r9a8O/+RNBf3pfmfhXitrxDP/DH8hY0aV9qqzN6AZPTP8uaU28inmNx/wABr0v9jBftP7UvgnO11k1OMsrr0Ix0r9cDpkZH3V/If4VHFXGUspxEaKpKfMr6u1tbdh8EeH8c/wALPESq8nK7bXvpc/EQ28inmNx/wGlEEiOu5GHPcV+3TabHj7q/kP8ACmtp0fHyrjrjA/wr5b/iKVTph1/4E/8AI+2/4gnC2mKf/gP/AAT88/8AgkHG0Xx81xmVlVtBZASOp8+I4+uAT9Aa+nv+Clf/ACZv4s/37P8A9LYK9wgtFt59wXBIxwB0/KvD/wDgpX/yZv4s/wB+z/8AS2Cvk6ucPM88pYuUeVuUFa99mj7elw+sm4Zr4BT5uWM3e1t9T8sabJIsMbMzKqqMkk4AFOqawlaC+hdWZGSRWDDqpB61/RVSXJGU97I/kyjT9pONPa7SuDWE6bt0Mw2nacoeD6Uw28inmNx/wGv2x07TIvskYEahcDsPb2q0dOjx91fyH+FfkcvFKd/93X3/APAP3ij4KwlBSeJtdJ/D/wAE/EOSCSNfmRl+or7a/wCCOELw6l4+Z1ZQ62G3IxuwbnOPpuXPpuHrX3E+mxsv3VH4D/CnRWawj5VCjvt7mvFz3j6eZYOWEdJRUrap32d+x9Fwz4WwynMIY5V+blvpa3T1PE/+Ci//ACZ/4u/3Lf8A9Koa/Kuv1V/4KL/8mf8Ai7/ct/8A0phr8qq+w8L/APkX1f8AH+iPgvGb/ka0v8H6gzbRk8AckntQzbGKt8rKxUg9iOo+tAO05wp9mXcp+o7/AEr9kdL+BXgt9Mi3eE/Djbk+YnTYfmz1/h717/E3FkMmcFKm5c99nbY+W4O4IqZ/7RwqqHJbdXPxuf8AdrlvlHqaM/ryPev2M1L9mr4farayRzeCfCrK6leNMhVhkdiFyD7jmvhX/god+xnpvwClsfE3hhJLbQdQuDb3FopyIJWBK4z/AA5B49q87I/EDCZjiVhpQcJS2u73PW4k8LcdlGFeNjNVIR+JJWaR8ur94f47f17V91f8Eu/2sbrX52+HuvXkt3JHGZtFuJjmWSMAs8bE91HI74z2r4WXlh9e9dj+zr4ym8C/HLwhq0EjQSWuqWzSHO1TEXWORSfdCfwr3OKcpp4/L50prWKbi/NK583wbnlfK80pVoN8raTXdN9T6m/4LGQSS674EZY2ZVhvNxAyFJMOM/XBx9DXxUbeRTzG4/4DX7dNAt/HGzemen09qU6ZGR91fyH+Ffk+R8fTy3BxwfsVLlvq3bf5H7lxF4XQzfMJ5h7fl57aWv8AqfiKLWUuq+XJuY4A2nJNRg5Ge3rX7T/ELTI28CaxlEx9imyCoIPyHtjmvxZlbzJpG7s5dnxjcSzAAD0r9L4T4olnMajdPk5bdb3/AAR+Q8bcFrh+VKManPz3e1rWEzT1t5HiWRY3ZG+6wXg844P1BH4Uw8jnpX6vfsG2y3X7JXg2RwrSNasSQOv71/UVvxVxG8ooQrxhzOTtvbocvBPCqz7EzwsqnJyq+1+p+Uht5AceW+TwBt6177/wTWtZrf8Aa30FmjkRfs12cspA5hIH5niv09bS4yPuj8h/hSw6ZHBJuVVDdmxyPbpX5vmfiPUxeEqYV0ElNW3/AOAfrmU+EccDjaeMWIcuR32/4JYGKU80hFGcL+FfmW+5+0HF/Hn4pQ/B34Pa/wCI5mTOl2TSRK5x5kpGI1/4E5UfjX456lq02talc31xI0lxdSyTTu/V3kYuT+HSvuz/AIK5/GFbHwzoPgq1uB5mqudQu1Rv+WUeSgPsXH6V8HpjeueRnkYr938N8p9jgZYyS1qPT0R/MXi9nX1nM44KD92kv/JmNoxu46e/pV7SPC99rui6lqMNt51ro0UMt1MPuxCV9iFj0GTwM9TwKoq+w7tu7ac49cV+hqpGTfI9t/I/J6lOSipWsmtD9C/+CSfxhbxN8LNS8I3cpa48PzfaLZSeRbSnIAH+y24H/er69r8nP2Cvi+3wc/aW0Gaa48rTdYYaXeZbamJiPLZj0ARiCSelfrErhhkHr0r+e+PMrWDzSU4fDU95fr+J/Vvhdnax+Sxpyd50vdf6CnpVXUtOh1aymtriNJre4jMcsbjKupGCCPQ1ZYblpoXAr4tOzuj9HlFNWex+UX7bH7LN9+zd8TLqSO3kfwtqUpm064CHy4mkbBhZum4E5A6mvF8/qcD3r9qPiF8OdH+J3he60nXNPh1Cxuo2Ro3XJGQRwex569q+Rvif/wAEgbO+1Ca48I+JZNNjlbcLO9i8yFR6bhz+lftHDfiFhvYRoZi+WUdObo15n868XeFeMjiZ4nKUpQlry7NPyPhA8fh19qdFA08scaoztKwVVUZLk8AD1Jr6+0v/AII8+K5b1ft3izQ7eBWHzW1vIzgeozgZ+tfRH7O3/BPTwT8CrpNSljk8Ra4pDfbdQUN5bA5BROi4PfmvZzLxAyrD026EvaSeyV7X+Z85lHhXnWKrKOJh7KPVuz+45f8A4JrfspXXwY8IzeKNetvK1/xEg8uJkKtZW5+YRkHkEnkivqbdkH6UxV8te9OJ24OQPxr8LzXMq2PxMsXWfvSZ/TGR5PQyvBwwWH+GP4vq/mYPxN+H9l8UvAWraBqEfmWerWz28ox0yOGHuDgj3Ar8jfj18Bta/Z9+I15oesQyDa7G0uRGwjvIs5DLkc/LwcdK/ZH5cVxnxp+Anhf4++FpNJ8TabFfQfeikB2zQP2dHHKsPy4r6DhPimeU1vfV6ct1+qPk+POB6ee0FOk+WtHZva3Y/GxD5jMF+YqMkDsKMcZ7V9n/ABS/4JCaxFfSzeEfElpdWe7Mdnqu4NGPQSKD+ZFchpv/AASQ+Jd/dhby+8K2tuSAWNxJMVHcgeWM/TIzX7NR40yapH2nt0vW9/uP59xHh7xDTqcn1Zy81az899D5fI3J22njJOB+dfoF/wAExP2TbnwFpc/jvxDatDqerRiPTLeWMq9nbepBGVZv5fWul/Zz/wCCZHhf4R6rb6x4guJPFOtwlWjaWPZbW5ByNqexHevp2OFbeJVRdqrgAKOlfnfGHHEMZS+p4H4X8Uu/kvI/WOAfDepga6zDM0uZfDHs+78x2fl/nSO3yH6c0v515L+2p8cP+FDfAHWNWt5lj1S6UWNgc/Ms8gIVgO+3lsei1+bYPDTxVaNCl8UnZfM/YMwx1PB4api6vwwTb+R82ftt/tKa98fPihH8I/h4zXCSTm21CeMkrdOCFeMsv3Y0z8x7d+le+/snfsW+Hv2btCjmaNdU8TXEYF3qUy5Yd9if3VHTjk/y8x/4Jbfs/DQ/BUvxD1SDz9U8SMRYySjMkNrk5fn+KR8kn0x2r68c7Qf84r6niDMY4aP9k4F2hDSTW85dfktj4XhXKJY6bz7M1zVKmsIvaEemnfqA2qvHAHaqOteLdL8MxB9S1GxsFbo1xOsYP5mvkT9sf9ujW5fHR+HPwxjlvtcklNtd3tv88iSE7TFEAD84yMt/B3rl/Bv/AASs8VfExRqvj/xlPDqFzl5Io4zdSjd/edyBkewrHD8N06dCOJzOsqSlqla8mu9v8zrxfGFepiJYXJ8O67jo5XtFPtfqfbuieO9F8Ssy6dq2m3xXqLe4WTH/AHyTWozKV5I2nivhnxR/wR/vtGh+1eF/HDR30PzRC5svLO4criSNty84+YA461l/Cr9rr4ifsf8AxNt/B/xYtbq/0mYhLe8lIkmgjyAZEl/5axgckEbhiqfDeHxEJTyuuqjSvytcsvlfcwjxli8JUjTzvCujGTtzp80U/N9D7O+MHwQ8M/HHwpNpHiTTIL63kU7HYYlgbHDo3VWHUe/rXwnb3Hiz/gmD8fUhuJ7nUvAmuS8EAmOeEHJIXtOik8D730NfoZo2uWviDSbe+s7iK4tbqMTQyxtlZEIyCD+Nef8A7WPwGtf2hvgxqmiyRwm/WIz6dMw5huF+ZeeykgA+xNYZBnDw0/qWM1oT0kn0812aOzijIVjKKzLL3y16fvRkvtLflfdM7zwr4ps/GXh6z1XTriO6sb+JZoZY2DKykZ6jivin/gsx/wAf/wAO/pqP8raug/4JO/Gm61Hw/rngDU5JPtHh9hPZJL/rEiLFZIyDyNjjp23Vz/8AwWY/4/8A4d/TUf5W1etk+WywHEUcM3dLms+6cW1+B4ef5xHM+FHjFo3yprtJSSa+8+1vB/8AyK2m/wDXsn8hWX8VfivovwX8FXXiLxBcmz0mz2CWVYmkZdzBQcKCepHbv9K1PCHPhXTf+vaP+QrxX/gpdJ/xh14oYHDK9ng+n+lwV8thMPGvj40Z7SnZ282fa47GTwmUSxNNawhdX8kRn/gpt8HxwfEV1n0/su69/wDpn7H8qd/w81+EH/QwXn/gruv/AI3Xlf7D37FXw2+Mv7Nmha94i8PNqGq3j3Amn+33MfmbZ5UHCOo6e1et/wDDtH4M/wDQon/waXn/AMdr6LGYfh/DV50J+1bi2tOXofKZbi+K8ZhoYqm6PLNJq9+pXb/gpt8HwOfEN5j/ALBd1/8AG6+ZvBfxI0f4tf8ABU3TfEmg3DXOm6pcI8Mjh4iQumhThWA9CPrX1Ev/AATT+DKMG/4REjHP/IUvP/jtbHw//YZ+GPws8XWevaH4dez1SxffBN/aN0+w7dv3WkIIxxgjFVhc0yXCQqvCxqc04OOvLbX0Znjsj4jzCrRWNlS5ITUtL309T57/AOCyZzD4A/66Xv8AKCvsr4fru8CaP/15xf8AoAr41/4LI58rwD/10vf/AEGCvsr4fZ/4QfR/+vKL/wBAFcuZ2/sPCW7z/M7Mi/5KXHvyh+QeNPGul/Dzw9Nq+t31vpumWpUS3Fw4jjiywUbieBliAPUkDqa4dv20PhYnI8deHeP+nta5j/gpWc/sb+Kl/vNZD/ydgr59/Y5/4J9eCv2hPgLpfibWrrxBa6jeSTIwtbiJUwkjIOGjb+761OU5Tl88veOx05RSly+6k+ifU0zziDNaearLcspQm3DmfM2utj6ttP2xPhffzBV8eeF1LcAPfxoPzJAr0LTdVtdWtY7i1uYbiCUbkkjcMrj1BHWvlvU/+CRPw+ntGFvrni6CYA7GNzAyg9iR5IJH0I+oryD4Pax4q/4J/wD7Vmn+BdW1Br7wrr0sUUZaQiFllkCJOoYnyyrE7+cEKcVt/YeXYuE/7KrNzim+WSs2lvY55cTZtgKtP+2sPGNObS5oSvZva594+P8A4eaP8TfDV1pOuWFvqFjdRtG8cqZwCMHB6g+4wa+BdN/tb/gm1+1vaWr3FxN4K8RNsLyH5ZbZmADEdPMhLZPcqPQ1+iSSCRN3P09K+U/+CuPgKDxB8BdO1rCx3ej6ikYk28iOX5W5+oWs+E8a/rH9n19aVX3Wuz6NedzTjzLUsJ/a+G92tR95NbtLdP5H1TZ3sd/ZLPGytHModGH8SkZBr5h/4KGfthXHwf0WPwf4VmeXxZrS+WzW53S2Mbghdo6+a38I/GvQf2d/jHAv7GOheLtYm/d6fof2i7ZiNw8lWVlOf4vkIx1zxXzL+wd8PLz9qH9o7xB8UPFEbXFvpdyZLaOQFkFy/wB1RngiKPHHYmtMmyqjQr18XjVenQbVv5pXskY8RZ1iMXhsNl+Xvlq4pK7X2YWTk/Xoel/sU/sA2vgW3t/F/jq2XVPFV4ftEVvM3mR6fu+bJz96Q9cnpX1fEixAKvCqOABwKFj2Hv8AMck/pXzv+3H+29B+zlpy6LoixX3izUEHlofnWyVshXdQepP3V/ixivLqVcdnmO5fik9l0iv0SPcp0cs4by7m+GMd39qT/Vtn0Fqes2ejWrTXlzBaxRjLPK4VV+pPArL034neHdXvBBa69o9zPkKI4ruN2J+gOa+GPBH7BvxQ/akMXiT4heKLnSY7z95BDdRm5uo0bnATISJcdByRXU6z/wAEcbUWpk0zxtdR3iqcGawXbI3YEqwIBPcc16csjyii/ZYnGe/15YtpfM8WnxNn2Ij7fC4B8nTmklJr0PtpHVxkNuH1zWf4p8L6f4x0a40/VLO3vrO4QxyQzIGVlIIP6Gvz9j8a/Gb/AIJ2eILaPX2m8QeDZZRCqvI09tjcANj43Ru38KseTjg19zfB34xaL8bfAlj4g0a5V7W8GGRj88MgHzIw7MPT8a87NMjrYGMcTSmp03tOPfz7M9jJeJcPmkpYOvTdOqvipzW68u6Ph/8AaS/Z18QfsIfEm1+IXw/num8OCcNJbyOT9iZ2G6FuzQuOAW5Un6GvtH9nH466V+0P8MbLxDpbj99+7uoCfmt5hjcjDtg+vYiul8c+ENP8f+EtS0jVIFubDUrdoJ0K7tykEHHvzwRznFfDP7FuuX37KX7Y+tfDPVJpDpusStHCzErEJB80Ui5/vghPduOvFexz/wBtZbP2v8eir36yj1v5o+e9i+HM3pqlf6riHa3SE+luyZ9/AZo2YoRs0rHiviHqfppzPxb+Idp8KPhprniC8ZRb6PZS3bAtjdtUkKPdiMAdyQK+Pv8Aglb8P7rx34/8XfEvWFaa8knezilYZDSu3mTMD6jKqfxFdT/wVq+LbeHvhto/hC1k/wBK8RXHnTxqfm8iIhufZmwPcjFe3/shfCMfBH9nzw5oMiBb5LYTXrBdrSTv8zk++Tj8BX2NFfUcilU+3iHb/t2O/wCJ+c4hLM+J40f+XeFjzNf33t9yPSrm8htbd5ZZI444VMjuzAKijkknsOOtKsqyorLhlboR3Brwr/goh8W/+FXfsz63HDL5d/4gX+ybYg7WHnArIw+ke7B9cVtfsP8AxdHxg/Zu8OalI++8t4fsNyC+5hJF8pz7kAN+NeCsqrLALMfsc3L+B9V/blB5q8pT99R5vx2+4+bf+Cm/hG4+EPxw8H/FDS42VmliW4dc/wCvgdWjyf8AaXK47gGvtb4deL7bx/4J0vWrNla31S2S4TBzjcBkfh0PvXnf7b/wfX40fs6eIdPWFpbyzhOoWaqpZmlhy4Uf72Cv415j/wAEo/i+fFfwUuvC91NvvvC9xsjDtlnt3JKkd8Btwz0r3cT/ALdkUK/2qD5X/he3+R8vgf8AhM4mq4baGKXPH/Et/vPqvaob8MU+m4w9Or5A/RAooooAKKKKACiiigAooooAKKKKABjgVHI+1Pw5qQjIqtqD7LOU/wB1TQo3diakuWDl2R+RX7YHxFm+Jf7SXizVGl823XUHsrbnjyYRsUj2JJPvXmqkA/M21e59KsapfNrGq3F5IdzXMzSE+7GQ/wBKrkbhj14r+sMuowpYSlSp7RSR/DWbYipXxtWvUerk/wAz7K/4JL/AiDXte1jx5fWyyLpkn9m6fuGQHGDI/sw49xmvv6vnH/gltp0Vl+yjp88YG7UL+5uJPZi+OfyFfR2c1/OvGGMqYjNqzm7qLaXoj+tPD/LaeDyOhGCs5Lmfm2B6U3nFOPIqMnIr5k+z8jx39uL4EW/xy+A2tW/k7tU0m3e/091TdJ5sYLBB3+fG3A65r8nGGWUjazEsG2nKnGeR+Rr9wtQiWeymVhuVkIPvX4neLrFNJ8WaraxD5LS9mjXHZQ7Afoa/YvC/HVJU6uFk9I2a+Z/PPjPltKnXoYyCtKV0/Oxn7d/y5K54yO1frr+xj8R2+Kf7NPhPVpZPMujZrb3Bzk+ZETGxPudufxr8iidoz6V+mX/BKq8a4/ZWhjb/AJddUuoh9A+f616HiZhovL4VXvGX5nmeDeKlTzadHpKF/uZyn/BYQY+EHhj/ALDP/tCWvz4r9Bv+CwfPwg8L/wDYZH/oiWvz5yB977vevS8PP+RNB/3pfmeR4rP/AIyGf+GP5Hp37F8qw/tSeB2ZgqjVEOSfUAD9ePrX65/b4P8Ansv51+HwJtiuN0bx5CsjdQe3Wnfbpv7836//AByp4r4NebV4Vo1VDlVtVfrfuacFeICyDCzw7o8/M772tpY/b/8AtCAf8tl/OkTUoJXVRIm5jhRnqeuP0NfiGl7MXX95MOeo3cf+P17T/wAE7rya6/bD8HBpXkhcXJxvZkYizuCrcsea+JzDw5lhcLUxLrp8ibtb/gn6JlPi6sbjKeEWHa52le9/0P1ZU14P/wAFK/8AkzfxZ/v2f/pbBXvC/dFeD/8ABSv/AJM38Wf79n/6WwV8Lkv/ACMKP+OP5o/TOJv+RTiP8EvyPyxqS1UvcxqoJZmAAHfmo6PqoYdwehr+paseeEoProfxNRk4VI1FrZp2+Z+zFh8avB62cX/FUeHxuUEZ1CLn6fNU3/C6/B//AENXh3/wYxf/ABVfjHuYn+LzOgUdAPzpuH/2/wBf8a/LJeFtO+td/cfttPxprwio/Vlppuz9nW+Nvg9FJPirw7gf9RGL/wCKro9N1CDVrGG6tZori2uY1lhljYMkqMMhgRwQRyCK/D9Wkjbd+8G3nIJGP1r9jv2Z3z+zr4D53H/hHrA8nOf9Hj718jxZwlDJ4U5xqOfM2trbH33AvHlTP61WlOkociT0d92cP/wUXXb+x94v/wB23/8ASmGvypr9Vv8Agoxz+x94u/3Lb/0phr8qa+68L/8AkX1f8f6I/MfGZ3zWl/g/UD0r9u9J+bToQf7gr8RM4/hVv9ls7T7HHOPpX17b/wDBXzxRaQ+UnhXQnSL5FYzygkDAzjH41tx5w9jcznReEiny3vrbexz+GPFWXZP7f6/JrmtayufoQVGD0FfKX/BWnxPZ2H7P+n6a0kb3moatE8UYYF9qpIWfHXA4GenzCvH9S/4K/eM7i3aO18M+HY5GUgO003yn1xivnX4y/HHxJ8d/E/8Aa3ifUvtlxGCsKKNkFov9xEHr/eP1r53hvgPH0cdTxOMtGMXfe92fXcZ+JmWYnLKuDwN5SmrbWsjka6L4R6PLr/xW8M2MIzNeatawJx3aZFH8651htxncN3TAyT9B3r6r/wCCXH7Olx48+J6+Or6H/iS6Czizcrlbu5YYLA9CE6gjoa/UOIcyp4PAVK9XezsvN6I/F+F8rq5hmlHDUr/Er+i1P0ZthshVfQAVJTAxFPr+W731P7YirKxkeP8A/kRtY/68pf8A0A1+Jp+9+X83r9svH/8AyI2sf9eUv/oBr8TT978v5vX7B4W/BX9UfgPjZ/Fw3o/zB/uH6V+sv7AP/Jo/gv8A69X/APRslfk0/wBw/Sv1l/YB/wCTR/Bf/Xq//o2Su7xQ/wBxpf4/0PK8F/8AkaVf8H6o9kHSigdKK/ET+lQbpUczBIWZuwyakJwK8h/be+MP/Clf2cfEGqQzCLULiH7FZkNh/Ol+RSo6krktx2XNdGDws8RXhQhvJpI4syxkMJhamKqbQTZ+cX7YPxeb40ftDeJNVjl86xgn+w6fg5Ahi4JHsx3Hj3rzIqzjC8MeAfQ0EFRjdu2tt3d2ODk/jmrnhzw/c+LvENhpNkrNeapcx2kAUbmMjkKuB3PNf1RhcPTweFjRj8MI/kj+JMZiqmYYyddv3qktPnsfcn7B37M1v4y/Yy8WNexqJvHyzpbSSR48uFARAw9Qr/MMelfCupWVxpN7NaXcbQ3NrK1vKjLtZZELBgR1B4GQfWv2e+GHgi2+G/w90nQLONVt9Js47dQBgEhRkj6nmvzR/wCCjHws/wCFZ/tO6tJDD5Vj4iRdTg+Xau8/LLj/AIEM/iK/MuCeIHis2xNKb0qO6+Wn5WP17xD4TWDyTCVqas6SUZfPV/ieFwSzQzI9vJ5dwrBonzjYw6H8DX6+fspfF+H43fAfw74gVl8+5txFcJuy0cqfK6kdjxnB5wa/IHG7jpnjPpX21/wSP+MG2713wPczbFdl1SwVmxjPEqAevAJHYV6/iLlaxGXLFRXvU3+D0Z4fhLnX1TNvq037tVW+a2Pu3PNLTVbd3p1fgiP6mCiiimAMcLUeQB9akbpXz/8A8FAf2m5P2dvhVs0uYR+JNfJtbIggtbr/ABzY/wBkHjtnFdWBwNXGYiGGor3pOy8jzs2zShl2EnjMQ/dgrv8AyLH7S/7e3g/9na4m01jJrniCNcmwtHA8onp5j9EyfXn2r5i8R/8ABXnxzdX5Ok+HvC9ja/wrdie4kA92VlH5A/Q18o3mo3GrXk1zeSTXFxcSvLJJI5fe7dSc8k+/QVFX7xlfh/leFppYiPtJdb338j+YM68Us5xlZvCz9lDolvbzZ9qfDv8A4LB6jHdxx+LPDFi1vuHm3GlyyDYufmYI4LMQMnaOT0r7D+Dvxx8N/HTwqureHtRgvIeFljDjzbdj/DIucq3sa/GjrXoH7OH7Qusfs6fEmz16xubh7FWWPUbMEmO7h3Dd8n98LnB9cV53EHh9hKtGVXL1yTSvbWz+89jhXxUx9DERo5pL2lOTtd7rz0P2EU59+akrJ8GeLLLx14V0/WNPmjns9QhWeJ0YMCGGeo446fWtavxCUZRk4y3R/SlKpGpBVIu6auvQKKKKk0Ec4Wvhj/grj4nm8SeJPBHgy2LP9oL3jxocs7OfJj4H+0WxX3O5wpr4J/bcxqv/AAUc+G9jIP3K/wBkoV9Q2oHNfWcFwj/aXtX9iMpfcj4PxGqtZR7Ff8vJwi/Rs+2vh74Wg8EeBtJ0e1jWO30u0itY1UYACqBXHftd/F5/gj+z94i1yB1jvo4BBZE955TsQgd9pO4j0UmvSkwFx2Hp7V8s/wDBXfVZLL9mvSoYz/x+a9DGw9QsFw/80FeZkmH+uZnSpVPtSV/vuetxJiHl+SVqlLRwhZfdZHO/8ErPgLFaeFLv4iakrXWpa3K8FlJONzxwqx3yZP8AFI+cn0FfZleX/sZaPFov7L3giGFQqtpcUxA9X+c/qxr1CnxDjp4rMatSfRtJdktEiuEstp4LKqNKC1cVJvu2rthXjv7Z37OVr+0Z8HNU08Wccus2cTXGmSYCuZVBKx7j0ViAD25r2JhkVHnD/WvNweKq4atGvRdpRd0exmGApY3DTwtdXjJWf+Z+dfwz179p74S+DLPw/o/h/VV03TwywJNp8UzquSANzHOAecelb7fGL9rAoF/4R+7O7jJ0iH/GvvVRg5p3f+VfU1OLKVSTnPB023u7dT4ejwJVpwVOGPqqKVkrqyR+ev7Inwp+KvhH9rvT/F2ueEdUsbfWri4GqyLaJHFGk0eVzjoFkAJrov8Agsx/x/8Aw7+mo/ytq+6Mc18L/wDBZj/j/wDh39NR/lbV35TnM8yz6jXnBRai1ptZRdjy884dhk3DdfDU6kppyUry7uSvsfa3hLnwpp3b/Ro+fwFeKf8ABS1xF+x34m5APmWeNx4z9sgxmva/CH/Iq6d/17J/IVX8deANH+Jfhq40fXLGLUNNvNnnQSj5X2sHAP4gV8hhcUsPj415K6jO9vR3PvMZgZYzKnhoOznBK780fFf7HP8AwUD8B/AX9nzRfDOtR642oaebjzDbWgdG3XEjDBLDswP05r1If8FZvhgf+XXxR/4BJ/8AHK9CP7DPwnbj/hCdHxn+43+NOH7DXwpBH/FFaL8pyPlb/GvpMTmHD2IrTr1KVS8m27SXU+RwOU8WYTDww1KvS5YpJXi9kecv/wAFafhfsb/R/E3Az/x5J/8AHK9f/Z6/aL0D9pPwxd6t4eW+W1s7k2kn2qHy23gAnAyexH515l+0b+x58NPCv7P/AI21TT/COk219p+h3lxbzRo26KRIXZGHPUMAfwrl/wDgkLx8BvEf/Ywzf+iYajGYDKquVVMdgYzi4SjH3mnv6F5fmueUM7pZbmc4SjUhKXuq3w+pyP8AwWSz5XgH/rpe/wDoMFfZfgA/8UPov/XlD/6AK+NP+CyZ3QfD/wD66Xv8oK+zPAH/ACIuj+1lF/6AKxzOP/CHg35z/M6Mjv8A6y4/0h+R47/wUq/5M38V/wC/Zf8ApbBVT/gmK4P7IXh8cf666PHvcSEfoQfxrrv2z/hhq3xr/Zy17w5oKwyapqDWptxJJsU7LmKQ5bt8qHmvkrwd+yR+0p4A0FNK0XXP7LsLckxQwawAoz17V05VRw+LyeWEq1405c/N73ayRxZ5WxeB4ijjqWHnVh7PlfLbe9z9CGbaDn/9VfAP7f2u2vxO/bW8DaHo8kd1fWbWlpK8LCTy5WuTlWx0KghiDyAc1Ym/Zg/ai1xGtbjxlcW8Mw2Oza620g8HO1d2Ppz6V65+yH/wT5t/gN4pPirxJqSa/wCKWzsdQ/k2zN99tzfNIx/vN/8AXG+ApYLJZSxksRGrPlajGF92rXbOXMsVmnEMYYCOElRhzRlKU7bRd9EfS0JMcGWwNq8k180/8FW/EMOl/sw/ZpWXffapBGq55IXcxP4Yr6WuryOyt5ZJpI4o41Lu7nCoPU1+en7TXj+b9u79qPQ/BPhlpLvw/pM7RSXC8xuQwE8/HBUJkA9CRXmcI4OVTMI4qelOl70n006HuceZgqGVvBQ1qVrQiuuvU6j4ra/cfC//AIJVeFbF2aG58QmC2b+Eskkrzt+DKuP+Be9e6f8ABOr4eJ4C/ZW8OFlK3WrodSnYjBkaTkH/AL524rx7/grJYQ+Gvgp4C0K13RWNrdtGqBe0UGxR+G6vqj4BWUel/BHwfbxj93Do1oi/QQoK784xN8khOH/L6rOT+Wx5OQYPl4jlSntQowivV7nReINZt/Dvh++1C6by7aygeeZv7qKpZj+QNfA/7D3gi4/a0/am8RfEbxLG11Y6RcfaLeOQboxO/EUYzwVjjAIHYkV9d/tf6tJo37MXjqaEsJDot1GCO26Jlz+teNf8EjNEgtf2d9au4wfMvNenDE9dqRxBf6/nXNlEnhcmxOMp6Tk4wT7J7nZxBH67xDg8vqawipVGu7WiPqxRsPH1+n0o5UE9aFwF5+lKevpXx62P0PyOe+Jvw3034seB9S0HVreO4s9QgeJgwBKZBG5c9GGcg9jXwD4B8AftBfsr634g0bwZomqSaa94yrILOO4hmCn5ZE3H+JcAkV+kAOBTa97KM+qYGnOg4RqQla8ZK6uup8xn3C1LMq1PExqSpVIbSjo7dj4LPxn/AGsYov8AkAXYz1P9jQnH61554z+G/wAdfiH8YNL8aa14J1STWNJmgmhmtrNYsCJww6c546da/TnG0dc01RtbmvXo8ZRo8zoYWnFtNXSd7M8HEeH7xHKsRjas1FppO1roisHaW1VmVo2cBmVj04qZ2wM+nWjdkHGK82/ay+L6/BT9n/xHrquFvIbY29kufme4k+SMD1wxBwOwNfI4ehLEVo0oLWTSXzPucZi44TCzxFV6Qi236I+QrrP7ZH/BSeOPd9p8O+FZgox+8heG1cMTnph5sD3r9A+FQbR93tXyL/wSV+EjaV8PNY8b3i+bdeJLkw2kpBy1uhJLA9w8hJyOu2vrLW9Xt9A0e8vrmRIbezhaeV2OFRFBJYn0ABr6biytF4yOBofDRSgvXr+J8fwHh5QwE8zxHx15Oo/8PT8D4V/4KU+I7342/tF+EfhnpMq74Wj80L8wSedtoyBz8kf7w9woJ6c1c/4JW+NLjwB8TfGHw51ZvJuY5nubeFjjZJGfLkUA87sYJHpWb+wJok37Qv7Yviz4iajGzQ6aZZ4t3Oyadtsae3lwqRjqCah/akgk/ZW/4KEaD4ytVaHSvEEsd3cBR97OIrkD/gB3/hX2MqcHh5cOJK6p83/b6978j88oyqrFx4sbfLKtyf8Abnw/dc+/rhPNgZePmBHNfn58MJP+GN/+Cjt9osjfZdB8UXJt4+fl8q4IaDHssp2E9Bmv0BtLtLy1jkRlkjmXejLyrKen6V8a/wDBWb4VTw6P4b8faUDFeaNOLO4mA5VWIMTE9tsnc9yK+O4SrReJngKvw1ouPz6fifoXHmHksJTzXD/Hh5KX/bvU+0I23CnVwX7NfxXg+MvwT8O+IIZFZr+1UTDcCySqMOp9GyDx1rva+YxFCVGrKjPeLafyPtsHioYmhDEU9pJNfNBRRRWR0BRRRQAUUUUAFFFFABRRRQAVDeQ+ZbyL/eWpicCmk5ovZ3JlHmi4vqfij8Q/DreD/H+t6SwMZ02/mttjDaQUcjGPXDZx6VjnkV9A/wDBST4QTfDT9pbUb+OM/YfFii/gJXjzRxKB6njOB2Ir5+Jx0+Y9h61/VOTYyGKwNKvDZxX3rc/iHiLATwWY1sNU6Sl/wD9H/wDgk34yj1f9nu+0rcvnaLqssRXPIV1Rgce5LflX1NytflF+w9+00v7NXxd8++Z18O6wot9Sx8whAPyTAeozz7Zr9T/DviKz8TaXDfWF1b3lndKJIZoW3I6EcHNfhHHGU1MHmc6j+Gp7y+e5/THhln1LG5PTw/N79P3WuvkX99AANHGeDTTIqqWLfX2r4y6ex+kbK7M3xx4ktvB3gzVNUupFjtdNtZbmVicBVRCzfoDX4q6nfNqeo3F23+suZpJDnuGZiM+/NfdP/BTX9ruxtfDtx8PfDt8t1fX4UarLA25beIMCYtw43MRgr1Ar4Or9z8Ncoq4fDTxVZWdS1vRH8y+Lmf0cbj6eCoO6pXv6sVF3uF/vHFfp/wD8Ew9CbR/2SdEmdWVtUuJ7zBGOGkIH5gA1+Zfh/wAO3fi3XbPS7GJ5r3UJ0tYI1UlmkdgqjA9yK/ZX4R+BYfhp8NNE0CEfLpNpHbZC4BKqMn8TWPihjoxwlPDL4pSb+SR1+DOXyqY6rjfsxjy/NnzL/wAFhP8Akj/hf/sMj/0RLX58p94Z6Z5r9Bv+Cwn/ACSDwx/2Gf8A2hLX58V7Hh3/AMiaC/vS/M+f8V1/xkM1/dj+Rr+AfBWofEfxZp+h6TGs2o6nJ5USOwUO56Lk8D69utey/wDDs74vf9ACz/8ABpB/jXJ/sVf8nUeB/wDsKr/IV+u2GrzuNOLcbleJhSwtrNXd1fqev4ecC5fnmDqYjGOV4ysrO3S5+Wp/4JnfF7H/ACALP8NUg/xr1D9jb9hX4kfCT9pDw74i17SbG10vTzP58yXkcjoGtpokUKp9WHT1r765o28V8HjPEDM8TQnhqnLyzVnZf8E/Tcv8K8nweJhiqTlzQd1dgnT/ADzXg/8AwUr/AOTN/Fn+/Z/+lsFe8beleD/8FK/+TN/Fn+/Z/wDpbBXzWSf8jCj/AI4/mj6/ib/kU4j/AAS/I/LGnRq0kiqhjDscKX+6D2zwePwNNp9sM3Ef+8K/qStKUISmuif32P4ow8FOpCD2bV/vPqdP+CRfj6cbl13wrtJ+TfPcKcEjqBH6ZFS/8OfviB/0HvB//f24/wDjdfofp/z2sf3SwUZ9qsZ+v5V+Ay8Q865n78f/AAFH9S0fCnh9wUnCV2l9pn5zn/gj/wDEDH/Ie8Ir7rJcZH0/d195fCHwvN4G+Fnh3RLtka60fTbaylePJVmjiVTgkZxkV02c/wD6qaBk+1eLnHEuOzOMY4ySajqrKx9Jw/wdlmTVJ1MDFpyVnd30PEf+Ci5/4w+8Xf7luf8AyZhr8qa/Vb/goz/yZ94u/wBy3/8ASmGvypr9S8L/APkX1P8AH+iPxLxm/wCRrS/wfqDNtXJ4A5JParWpaJe6MI/tlndWvnMyR+dE0e9lBJAyOSACSB0xVXds+bkY5yOor9X/ANrj9nC3/aH+Al3pcMapq1pGLzTpAOkyDIX6N90+xr6LiDiaOV4mhSqR92o3d9tv8z5Lhfg+edYXEVqUrSpK6Xc/KBkJ+XkZq94b8O33i7xDZ6XpsayX19KltbxmURNNI7BVUM3AJJAyemar3VjPpl1Nb3ULWt1bu0M8Z+8kitggjtRbXc9jcRzW0zQ3ELB4pEOGjccgg+oODX1EpOVO9PdrR+fQ+Pp8saijWi7J+9331PsL9n7/AIJQ6pq99DqHj67h0+xJVm0qxk8ySYZGVllHGCMg7fXtX3V4Q8Iab4D0C30vSbOCxsLNBHFFEgVVA4/ya8t/Yk/aPh/aM+D1rdSlY9a0nbZ6lDn51kA4fHXDDnP1r2YnA7V/M/EmbZjicVKjmD1g7W2SP7A4LyPKcJgo4nK46TS956th3/WnU3jP406vnD7QyPH/APyI2sf9eUv/AKAa/E0/e/L+b1+2Xj//AJEbWP8Aryl/9ANfiafvfl/N6/YfC34K/qj+f/Gz+LhvR/mD/cP0r9Zf2Af+TR/Bf/Xq/wD6Nkr8mn+4fpX6y/sA/wDJo/gv/r1f/wBGyV3eKH+40v8AH+h5Xgv/AMjSr/g/VHsg6UUA4WgnFfiJ/Sojnahr8/P+Ct/xi/tvx1ovgu2mHk6PGb+8RW+9I/yopHqB830NffHiHWrfw9od5fXU0cFtZwvPLJIwVURRliSeAAB1r8avjV8RZ/i38WPEHiS68zzNUvGmjVxgxRhtip7cc49K/RPDjK/rGYPFSWlNaer/AOAfkni9nX1bLI4KDtKq9f8ACtzmDyK+iP8AgmT8Jx8Qf2kLfVriMNYeGYWvfnXgzN8kfPqPvfhXzuCAfm+73xV3RPEepeGfO/s2+vtPMwVJGtZyhlAORnFfs2bYKpisHUw1CXK5K1/zP53yLMKWCx1LF14c0YO9r72P21E67vvLx79K+R/+CtHwtXxP8KdJ8UWyq114futk20bmMEvynPsG2n8a+E/+FmeIx97X/EBXuBftk/rUGo+Pdc1XT5La81rVrizmVfMhmuy8Z2nIJ5r89yfw9xOX4yni4117rvsfq/EHiphMzy6pg54Z+8tNduxkDrXcfs3fFqT4KfG3w54l3MtvZXAjuFXq1u7AS599ucZrh++O/pQAGOG+6etfpmKw8cTQnRqaqSafzPx3AYyWFxEMRS+KDT+4/cCxvI9QtYp4mV45lDoynKsDzkGrFeD/APBPD4zf8La/Zr0f7VP52qaHnTLzJyxaPhWPsy4wT1r3jNfytj8HLCYmeHnvFtH9u5TmEMdg6eLp7TSf+YUUbqK5D0QJwK/Nb/grF4sm1n9o+1092b7PpGlRJGnbfI5ct+QAr9KWG4Yr87/+Cuvw8m0n4w6D4kWNms9W042bEKcedG+4c/7rfoa+48PZ045xH2nVO3qfmfizTqyyCbp7KUW/S58j0Um8ZPI+Xg+1LX9CddD+U+ugUE7RRTXl8lSx2jaN3zHjj1o06j9D9RP+CYviufxP+yZo8dy29tLuZ7JW9VRyR/6FX0NXiP8AwT4+Hdx8Nf2WPDtpeQvDeXYkvJkdCrAyOSMg89MV7dX8r55KEsxruntzP8z+2eF41I5Th41d+RfkFFFFeWe8FfBH/BQtl8Gftz/DnxFJ8sMcdjIzNwp8m+LNz7Arn0yPWvvcnFfHf/BXj4Zya18N/D3ii1G2bQ7028rgfdjmGASewDqvXuRX1HB1aMMzjCW01KP3o+H8QsPKpk8qsd6coz/8Bdz6+gdZYg68hh/Pmvmz/gqr4WbxF+y61xGp/wCJTqtvdswHCA74iT/38/WvVf2V/ivH8aPgJ4c15XBmurRUuU3fNHMow4PocjOPeui+KHw/svip8PdX8O6iu6z1e1ktZOM7AwIDD/aBwR7ivNwNaWXZlGdTenLX5PU9bMaCzbJZwp6+1hp6tXX4nm/7AHjmLxr+yf4QmEieZZ25sZF3co0TMu0jsdqg49DXtWc1+eP7JHxsvv2JPjbrHw78bbrXSby8IjuWBEUTZ+SYE8BGUjLdBj2r9AtI1q112yjubO6hurWZQ8UsThlcH0I4NdnE2Wyw+NnVjrTqPmi+lnqcHBecwxeXwoVHarTXLKL3TWmxbb7tVNT1K30nTbi6upkt7e1jaSWVzhY1UZJJ9AOaszSrFGWZlVfU18Y/8FBP20LPUNGuPhz4JmbVtX1rFpfS2TeaFRjtNvGVzulfO0gcqDXBlOV1sfiI0aS06vol1Z6uf59h8rwsq1Z6/Zj1k+iR78f2y/haj7W8deHTglci7XBI6857Uo/bO+FryKq+OvDrMxwALpa8B+DX/BKTwxqnw40q88Y3utp4guIhNcrazxxxwg8hBuQngYyc5zmuou/+CUPwttLaaaS+8UJHCpZ2a+QBQOvPl179TBcOwqOn7eo2nbSKaPlKGacW1KSrPDUkmr6yaaW+vyPYvC37V/w68aa5a6bpPjDRdQvr5xHbwQXAd5iegUDr6/Svlv8A4LMf8f8A8O/pqP8AK2rh/wDgnj8LtP8AFv7ZV9qWjxzN4b8KrcXFm0x3Eq+YYeRxkjLj1AyK7j/gsx/x/wDw7+mo/wAravWwOU4fLuIKOHw8nL3W3dWavFu33Hh5hnmMzXhatisXCMffSXLdppSSufa3hA48K6d/17R/yFee/tj/ABf1b4FfAHWvFGhpayahYvbrGLhSyYeeOM8AjPD9M16F4Q/5FXTf+vaP+Qrxb/gpYf8AjDzxN/10s8Y/6+4K+Ny6jGrmdOnUV4uaTXqz9AzbEVKGSTrUnaUad0100PnTw1+3n+0F4x0eLUNH8E/2rp82fLubPw5dTwyYJBw6sQcEEcHqDWh/w2Z+0t/0Tm+/8JW9/wAT/KveP+CZg/4w48L/APXS7z/4FS17/j2FfTZln2Cw2LqYeGBptRk0r36O3c+QyfhvMsbgaWKnmVVOcU7K3X5H54ePf2nv2jPiB4K1rQL74c6l9h1m0lsp2i8NXwfy5UKNtJTGcE4PrXt//BLHwNrngL4K69a65o+qaLcTa7NKkV/aSW0joYogGCuASpIIz04NfT5HHQU3YMcV5WYcTQxGDlgqOHhTjJpvlvuj2sr4NnhswhmOIxU60opxXNbRPfY+H/8Agsn/AKn4f/797/KCvsr4f/8AIi6P/wBecX/oAr41/wCCyRzF4B/66Xv/AKDBX2V8Px/xQ2j/APXlF/6AK2zLTI8H6z/M58j/AOSlx/pD8jP+LvxW0n4I+A77xJrjzQ6Xp/l+c8MRkYb5FjXCjn7zD8685+GH/BQL4bfFjxvZ+H9J1O8/tC+JWD7RavEkjYJC7mGNxAOB1ODVX/gpZu/4Y18WbTtbdZ4PoftkFfEdz+z/AHNn+yZ4Q+K3hmOe31LTb24W+aJiWjUXEgin46bMDOexrp4fyHAYzBOripNSlLlj2va6ucfFXFWZ5fmSoYOClCMOeae9r2dj9UhKp6N3rxX9rz9sWD9la009rjw5qmsLqwkSGaCQRQxyKMhWc/dJ9hn0zW7+yX8fbP8AaO+DWm69EyJfKv2e/gz80M6cMCO2eoz2NWv2nPgXZ/tDfCPUvD90qpcyIZLK4K/8e1woyj/QHGfUZFfP4XD0cNj1RzKPuxlaS2Pqsfi8RjMpeKymfvSjePX5HxhrPxJ+OH7fz/2bouly6H4QvD+8dEaGzdc4Iec/NL15VcZr6y/ZN/ZC0X9l/wAMssDHUtevcfbdRlT5nx/Cn91B6d+/avnz/gmv8a7r4b+NtU+EviaNbO6s7qU2Cv8AKY5VPzxnOM7h8wFfcZ5/PtX0HFeMrUJvLqMFTo6Ncv2l0bfU+T4Dy/C4ums2xM3VxGqbl9h9Ul0PkT/gsJo5uPgp4d1BQf8AQ9W2E4+6Hjbr+KivoH9mPXY/Ev7PXgq7RlZZNGtQSpzhhEoP5EEVy/7eXwzf4n/sxeJrWGNprrT4BqMCBdzO0J8wgAcklQw/GuA/4JV/F2Lxf8Aj4fmmRtQ8MXLWxQsNxiYkowHXbncM9OKxqR+s8ORcN6VR38lJHZTl9U4tmp/DWpq3rFntv7SPheTxp8A/GelwKWuLzRrqOEAZJk8ptv64r5v/AOCPnjaG5+Fvibw88ifbLLUvtwXdyUljRSQPQMhGfXNfYkv7xGC7ScEcng1+dvjIal/wTm/bFk1qK2nk8Ea7I8h8tTtMMh+eMdmaNiWC9cY9arh6P1zAYjK18btOPm47r5oni2X9n5phM6kvcjeE/JS2fyZ+iarx/OlYjbXP/Dn4l6L8U/C1rq+iaha31ndRhw0MgbZkZ2tg8EdwelbzEKpz0HXNfH1KU6cnCommuh99RxFOrSVWlJOLV0+gFtsZI/CvOdd/a1+G3hrW7jTdQ8Z6Ba31nKYp4ZLpd0Tr95WGeGHcHpXF/tl/ttaH+zp4Tu7KzvLW98WXULC2tVcN9myOJZR/Cq9cHrivn39kb/gndB8b/Bl14q+IUmvQzaxP51rFDN5EjqSS0zhlz8zHIz1AHXNfUZbkVD6rLHZnOVOGijZXcn6PofF5xxRinjo5dksI1alryu7RivNrqfVj/tpfCtTn/hO/Dv8A4Fr/AI0H9tL4Vg/8j14c/wDAxBj8ScV5iv8AwSY+GP8Az9eKvb/Tk/8AjdfLPjL9nLw5D+2/pPw68JNeX2nRXVvFqElzKJyNuJJwCB1VBz6d69PA5HkeM51Qq1Lxi5O6SVkeLmXEvEuXqnLFUKXvyUVaTb17H6hW863MCSLzG43DIwa+IP8Agq18RLrxj4y8KfDXSZGe5u5VuZ44vmZpZG8qBMDnduJbHXHNfbMtzDpmmSSSMkcNvHuZnOAqgdT6Dg18DfsqW837Wn7e+ueObxXl0nQZpLq2DqWVAMw2656BhgyD2Ga4OE6UaVWrmVT4aMW1/iekT0+Oq1StQoZRTfv4iST/AMK1kfbvwe+H9r8K/hlovh+zVY4dLtUgAXoSByfxOT+NeR/8FIviz/wrX9mnUraGQR3niZl0yMb9r7HyZT648sMCR03CvoBo1UeleZ/tC/sp+Gf2l/7LHiR9UMekM7wpa3PlKWYYJIxycV4uW4ql/aEMTjb8vNzOyu+57+c5fiHlM8Dl1lLl5Y3dla1vyPnf/gn78d/hl8A/gTDb614r0y117WLh7y8jYuzR87UQkA9AAefU1k/8FIvjJ8Nfj78JLGbQfFGl3muaLdB4UTf5hSQbXC8D2PoMc4r1Yf8ABKn4XFuniPb/ANhFv8Ka3/BKn4Ws23b4kK8g/wDEyb/CvtI5rkUcy/tP2lTm5r2srW7fcfns8i4nllP9j+ypKnyqN+Z3v3+87T9g/wCLi/F39mjQLySbzL3T4zp91ub5g8Z2jI7ZXaefWuw/aC+Ftv8AGb4PeIPDcwXdqlnJHCWHEcoBKN+DYP4Vn/s//sz+G/2a9HvLLw4+pfZb6b7Q8dzdGUK2Ooz0r0Ijc3418XjcVTjj5YnBtqPNzLpbW5+j5Zgq88rhg8xS5uXllZ3W1j4q/wCCSnxRmsj4r+HupM0F5ptw1/bW8hw0alyki4POQwGfTNfbNfn38brZv2Qf+CiWl+Jo/wDRtC8STrczEDamyYiK4BPT5SfM9sZr7+trpbuNZI2VkbBGD1BGRXscW0Yyrwx9L4a0VL57NfeeBwFiJ08LUyut8eHk4/8Abr1j+BNRRmivkz7wKKKKACiiigAooooAKKKKAA9KbjpTj0pucLQB4r+3L+zOv7SPwguLW1SP+3NKzdae7cEuoz5efR8AGvyp1HTptD1C6sbu3ktrqzfyriF1KmGQNgjmv3AIylfL/wC2x/wT+tfjnLJ4k8Mpa2HimNSZo2GyPUhjhWPRX9G/Ov0fgXi6GXy+p4x/u3s+z/yPyDxK4EnmUf7QwC/erdd139T82c7W6e+K9K+Bv7W/jr9neRYdB1bzLBTk6fcgyWhz1/2gfda43xz4E1r4Y+IJNH8QafeaXqEbHMFypBcDoyEgbl9xxWPjD7f4vTvX7TVw+Fx1HkmlUi/n+J/O2HxWNy3Ee0pSdOotO1j6+03/AILB+LI7NVuvCugzz45eOeWNfrgjNcL8WP8AgpZ8Sfijpk1jDcWHhmxmUo40xC00ikEEF5ORweq8+lfPhRgeh/KkJ25z2GT7V4+H4RyejU9pCgrrvr+B7mJ48z2vS9lPEy5X6bepJczS39zJNM8s8077nlkffJIfeot6hN2flwTntgdfyp8cDTyrEqszScKoBJbPoOp/Cvqz9kH/AIJxax8S9Stde8c29xpfh+MrLFYSHbc3+CCN4xlIz6dSDXfm2cYTLqHtcRLltsl18kjzslyDHZtiVSwkb3er7ebZu/8ABL39le41zxAvxE1y3ZbPT2aLSIpIyPNl/im5HKj+Fhxnp0r77PT8aqaFolr4c0m3sbGCO2tbVBHFFGu1UUdMCrZ6fjX845/nVXM8ZLE1Nui7I/rrhbh2jkuAjhKW+8n3Z8g/8Fhv+SQ+GP8AsMj/ANES1+e9foR/wWFOfhF4XHf+2M4/7YS/4ivz3zzX7X4ef8iaHrL8z+cvFb/koanpH8j1D9iv/k6fwP8A9hVf5Cv14r8h/wBivj9qjwP/ANhRT+GAP51+vFfEeKH+/wBL/D+p+meC/wDyLa3+NfkFFFFfmR+yBXgv/BSv/kzfxZ/v2f8A6WwV71Xgv/BSrn9jjxZ/v2f/AKWQV6WS/wDIwof4o/mjw+Jv+RTiP8EvyPyxp0Eqwzo77tqsGbau44HoO/0pvejvX9USgpRcZ7M/iejNwnGoun5n6RWn/BVj4Z2UZVofETSKcNss12nGBwd/P/1ql/4ey/DH/n38Uf8AgGn/AMcr82O9HevgZeG2U3fxfefpsPFvPYxUU4aabH6Tf8PZfhkf+XfxP/4Bp/8AHK9K/Z0/a48M/tOz6qvh2PU4zoxjM/2qAR/6zdtxhj/db8j6V+R7Hivtv/gjUQdS+IXrs078P+Po/wBRXzvFHBOX5fl08XQ5uaNt33aR9XwX4jZtmmbU8FieXllfZW6Hvf8AwUX4/Y+8Yf7ltj/wJhr8qa/VT/gor837H/i/nLBLc4/7eYa/KvvXreF7vl9X/F+iPF8Z/wDka0v8H6gelft5pb7NMh/3B/KvxCY4Br9vdLw2mw/7gFeT4qfFh/8At79D2fBP/mK/7d/U/PD/AIKifs0L8OviBH440u3K6T4gcR3qqpC2910DnsA4/Nq+Um24w2duSpA6+4+tfsz8bvhNpvxt+GOreHdThWSG/geNHI5hcqQrj3UnNfkB8Q/AuofDPxpqnh/VF8u80m4MEmRtLDPyPg9mGBnvX0Ph7nzxuE+qVXedP8V/wD5fxT4XWXY769Qj+7q6vyl1+87z9jf9ou4/Zu+MVpqUkkv9i35Wz1aENlShYYmA7lRk/hiv1n0bVYda0+K7t5EmtrhFlhkU5WRGAII/OvxCJx23ex71+gX/AAS3/acbxd4SbwHrFyz6lo8fmWEkzfNPb5+77lP5fSvK8RuHfaQ/tOgtVpL07/I9vwk4q9jV/snEvSWsb9H2+Z9iDlqdTVYHvTq/GT+ijI8f/wDIjax/15S/+gGvxNP3vy/m9ftl8QDjwLrH/XlL/wCgGvxNzmTHf0+hev2Hwt+Cv6o/n/xs/i4b0f5g/wBw/Sv1l/YB/wCTR/Bf/Xq//o2SvyabkEd/Sv1k/YBP/GI/gv8A69GP4GR8V2+KH+40v8f6Hk+DD/4VKv8Ag/VHsn8H4U1iAPwpwPFIxUV+H3sf0sfOP/BTL4xt8NP2dLrTbeby9S8VSCwiGeRFwZiP+AZH/AhX5jgbQVUltx3EtX0n/wAFQvjD/wALC/aE/sS3m36f4XtxbYByrXLnc5H0UBT7182ABm2nvwa/ozgXLPqeVwlJe9U95/Pb8D+SfErPP7QzqcY/DT91fqXvDXhy+8X+I7HSdNt2utQ1KdLa2gUhTLI5AVcngZz1PAHJ4r1pP+CefxglG7/hDJl74Oo2n/xVdZ/wS7+FH/CfftF/21NH5ll4XtTc/MuQs8nyxgnswHzAHniv0y/OvD4u43xOW4xYTCKLsle+uv39j6LgPw3wub4B4zGSkru0bdl/wT8of+Henxi/6E2T/wAGNp/8VR/w70+MQGf+ENlx7ajaf/FV+r1NK5/pXyv/ABEzNP5Yfc/8z7b/AIg1k73qT+8/Gb4r/BPxV8DtVttP8VaTJpN1fRm4gUzxyJKBw2GQkZHp71ygG488DufSv0W/4KxfCn/hKfgtY+JraNWuvDd0PNIXJ8mUqjfgDtr86VO8fL83av1XhTPHmmAWInbmu00j8T404bWS5pLDU23BpNXPqr/glF8Yv+ES+Mt94WuH22via1863VjgLPF978SK/RtWUjivxR+H/jm7+GXjnSfEFi7Lc6LeJeRerbWBKH2OMH2Nfsv4D8V2vjnwhp2sWciyW+pW6XCMpyCGUH+tfmHiVlXscdHGRWlRa+q/4B+0eD+dKtgJ5fN+9Tei8n/wTXUfNT6aB6U6vzVeZ+xCMflrzn9p39n7T/2kPhRe+H70xw3BHnWVyybvs068o30z1HcV6OeRTOnb8K1w9epQqxrUnaUXdHPjMHRxVCWHrq8ZKzXkfjF8Xvg74g+B3jObRfEVjNa3FuzLFI6lo50P3WiboQe47Vy5+UZ7V+0PxH+EXhz4vaI2n+JNHstWtWBwJ4/mjz3Vhyp9wQa8G8Sf8Emvhhq9601pP4m0ZZDkxWV6uz/yIjn8jX7LlfibhZUlHHQcZdWldM/nnOvBvGxrN5bNSh0TdmvK/U/NV5FQfMyqO5JxX0h+w7+xJq3xw8W2mva5ZzWvhKzlSdpJoWja/ZWDBEDD5ozjBI4wa+uvht/wTY+Fvw6u4rpdMvtZuoXWRZdSumlIYHI4G1T06EYr3aw06HSbOO3t4Y7eGIbVSJNqqPQAdq8/P/EiNWjKhlya5tHJ6O3ketwv4RzoYiOJzaSfLqop3TfmSWdnFp9pFBCqxxQqERQOAAMAVNTR/WnV+S3bd2fu0YqK5UFFFFBQN0rmfi78NbH4vfDfWPDepL/ourWz25fGWiJUhXHupwR7iumb7tMKk1dOpKnJVIOzTujKvRhWpypVFeMlZrumfAH7DXxivv2TPjfq3wr8ZOLOzvL4rFNI22K3nJAjKlv+Wco2jPTd3r788xZ0BVlZW5BHINfP/wC3J+xZb/tIeGzqmj+TY+LtNiY28/3ftigf6l27Z6Bv4c5rxH9nH9vvWvgJqx8C/Fiyv4109mih1F4WE0SLwN8ZG5kGOHHBHrX2+YYOOeU/r+CS9tb34dW19pd7/wBan5nleYT4brf2VmV/q7b9nU6JP7L7WPp79pv9kzwv+074c+z6vb/Z9UtgTZ6jCg863bt14Zc9VPB9q+Wh+wf8dPgjeyx+B/GKzaaSWjS31GS2JHbdE+Y8n/ZOK+3fAfxH0P4laLHqGg6tYatZzAFZLaYSAexx0Psea2+PX8zXiYHiDH5fH6u7OK+zNXS+8+hzHhPKs0qLGx0m18cJWv8AdufA0/7Hn7SHxWjaz8SeL2tdPlGyVbnWXkV1PDDy4hhuM8EgHpXuX7Lv/BP3wz+z3eLq13JJ4i8QhcC7uIgsNvyOI07H/aOT9K+hvMVxxhsVX1PVLXRbCS5vJ4bW3hQySSSuERFAySSeAAMnJrXGcVY/FU/YRtCL6Qio3+4jL+CsqwNX63PmqSjrepJyt95KW8tMsQAB6cAV8s/8FKP2p4vhv4Dk8EaLcsfEXiSHy5/JbdJZ2zfKcgchnztFRftPf8FL9F8E202ieA2h8SeIpsxJcohks4GPAIYcOwOPlGc4rmP2Lf2JNY8V+MB8TPigtxealcTfarGxvQWkZ8hlnmB6EcbU7YFd2U5THARWaZouWMdYQe8pdNN7HmZ7n88zm8nyR80paTmvhhHrrtex6z/wTz/Z1PwH+CsU19D5OueJGXUL0EENECP3cXP91e3Yk14r/wAFmP8Aj/8Ah39NR/lbV9yxR7B+PpXw1/wWZO29+HrdlXUST6cW1HDuOqYviCOJrbycn/5K9PlsHFmW0sBww8JQ+GPKvX3lqfa3hD/kVdN/69o/5CvH/wDgoroV54l/ZL8SWen2d1qF1M9rshtomllcC6hZsKoJOFBJ44AJ7V7B4OZW8KabzwbaPn/gIq9LGsg+Ybh1wRnmvm6WIlh8Yq6V+WV7ejPrq2BjjMt+qydlOCV/VH5w/Av9rH4vfAD4ZWHhfSPh61xZ6e8hWS50i7ZiHkkf+FlHf0712H/Dxj44Ef8AJOLX/wAEt9/8cr7uW3XH3V/KlFuoH3Vr6atxNl9Wo6tTAwcm7t8z3PkcNwXmmHpRoUsymoxVklGJ8ID/AIKMfHA/804tf/BLff8Axyt79n7/AIKH/ED4kftEaL4K8QeH9D0n7dK0d1GbO4huoMQGUfK8ny5HTI6GvtD7OoH3Vr4L1b5f+CwKx5+VbiEgAdM6Z/8AWPX0NdmX4rLcwhWprCRg4wlJNNvVHlZxg84yqph6ssdOopVIxaaS0Zrf8FkgRD4A95L3+UFfZngD/kRdH/68Yv8A0AV8Z/8ABZQgW/gDr/rL3k/SCvsr4fOH8CaPg5/0GL/0AV5eaW/sPCLzn+Z7WRf8lNj/AEh+R5B/wUqbZ+xt4rPPD2R4H/T5BWJ/wTz8L2fjL9hnTdH1OGO7stQ+2286MPlkRp5QR+VbX/BSpsfsb+K/9+y/9LYKq/8ABMj/AJM/8P8A/Xa7/W4kI/Qg0Uqjhw7eOjVW9/8At3QWIpxqcWKM9U6LTXdN6nzl8A9evv2Cv2xr/wAF6vMy+F/EEyRJLKdsexmxBOCcAYZtrnpjOelfoXHOLiPcG+8Mgj+dfNP/AAUo/ZnPxb+Ev/CRaTFINe8LRtOrRIWlmt+siADksFyQPUVpf8E7P2lf+F6fBuPT9RnEniPw2Ba3mT806DhZVHUgjjPTIrfO4xzPBQzeC99WjUXn0l8zPhucsnzKpkdV/u5XlSfl1j8jyv8A4Kb/AACvPCut6d8WPCqta6lp8iLfvEdpVlYGKU47bgAxPavpL9lb9oPT/wBo34Pab4gtmEVzIvk3UDMN8Myj5gR1GfvAHsQa7fxV4UsvGfhu+0rUYY7qx1CBreeNxkOjAgj8ia+A/gx4iv8A/gnx+2BdeD9anZfCniCVYYZJCViaJmPlTgnjKZKOew/CnhZLN8seEetajrHzj1XyMsbF5BnKxsdMPiGlNfyz6P5n6E3kS3VrJG6rIsiEFT/ED2r88b9rz/gnL+2fLeNFN/wg/iKRpFCKxH2Z25Uf3niclsddvsa/Qy0nW5gjkjbfHIoZGHQjqK4H9pn9nDRf2lvh1caJqiiKfBazuwmZLWXHysPbOMjvivK4fzSGEqzo4nWlUXLJdvP1R7vFmS1cdQhicC7V6T5oPo/J+TO18OeJLPxVodvqVhcQXVjdRiWKaJwyOpHYisT4v/Bnw/8AHHwfNoviKyju7OblG+7JA/Z0bsw7Gvhf4afHTx5/wTu8eSeFfG+n3mpeEbiUi2ZSWVVz/rIGPBOOSnr6da+2fg3+0R4P+Omix3Xh3XLK+dl3PbeYFuYf96M/MPyxV5lkeJy6osTh25U94zj26Xts0Y5NxLgs3ovBYxKNa1p05d+tr7rsfJniP/gmp8SPhL4guL/4ZeNZIraQlliN3JZ3QHUKWUFHH+8Bmqsn7OH7U3ieBrG98WXdrbsNrOdb+WRTwQ2wZx9Oa+9wML/jR1NdkONce0vaxhKXeUE395xy8Ost5v3M6kIv7MZtR+4+Sf2ff+CXeleCNfi1zxtqTeKNUSQTLAimO0VwQcvuJeQ5H8XBxyOa+sbO1jsrZIoljiijXaiIMKoHpTp5ESNtzbdozn0rwj9o79v/AMF/Aqxntre7h8Qa4isFs7KQSLE3OPNccJz1zzXm1K+ZZziEneb6K2i/RHrUqGTcPYZyXLTj1bd5P9WdN+1t+0tp/wCzX8KrrVJJIZNUula3022ZxumnIO3jqVBwWI6CvAf+CXvwLvtQ1PVfin4gWSW+1pnhsJJkO9gWLSTc/wB77oPcCuI+Df7P/jb9vn4pf8J18QjNY+GFcC3h2tH58IbP2eBT0jPO+Tktk4Nffuj6RZ+GdHgsrOGO2s7RBFHHGuFRRwAAK9jH1KeU4KWW0ZKVWp/Ea2SX2b/mfP5TRxGfZlHNsRFxoU/4Se7b+010PFP+CiXxmHwl/Zo1j7PMseo64DpdsQ3zKJOJXH+7Hv57HFYv/BMD4P8A/Cu/2eYdXuotmo+KJmvXJXa3lA7Yh/3yM/8AAq8W/b78QXH7Rv7XHhf4aaW3nQ6fIkVwqtuAaUgyNgf884+T6AZOK+7PDWhQeGtCs9PtY1jt7GJIIkUYCqoAH8qzxz+pZLSwy+Ks+eXotF/mbZVbM+JK+N3hQXJH/E9ZMTxR4gt/Cvh3UNSu3SO30+3kuZWdtqqiKWYk9gAOtfFF1/wWTaOefyfh+rQxzNErHWsNIQ2MkfZ+M9ea9b/4KcfFlfhz+zdfWMc2y88TSrpyqrYYxH5pT642AgketTf8E8PgpD4A/Zq0e41C2jk1DXGbUpjKm5lD/dX5hn7uD+NRluFwOHyx4/H0+dylyxV2tt3oXnOOzLGZzHK8sq+zjGPNOVk9b6I8cP8AwWYm/wCieL/4PR/8YpV/4LLTscL8O1LHj/kOjn/yBX21/wAI3p+OLK15/wCmQ/woHhvTx/y42v8A37FL+1Mltrgn/wCBstZFxH/0MF/4Aj4t0X/gsgt3q1nHeeA/s1rcTKkk66yJDGhPzMF8kbiFycZGcdRX2zYXsep2kNxE6yQyqHRlOQwPQg18yf8ABT/4IW3i39nebVrCzWO88NTpeHyU2sYT8snQc4Ulsdgprtf+CfnxY/4Wv+zNoc003nX2khtNuiTlt8WAM/VdpozXCYKrl0MxwEORczjJXb809fIWRY/MsNm9TKszqe0vFShK1r9Gjhv+CqfwjXxx8Ck8QQxs194WnE7GNCWMD/I/TsOGPoFJr0D9g/4xj4yfs36HdTzCXU9NT+z73JG7zIwACR7rtb3zmvUPGXhW18b+FdT0e+jWa11K1e1nUjhldSD/ADNfEH/BNrxNdfBD9pHxd8L9WkaJmlkEStwDLCSQRns8Jz7hc1rhP9uyKphn8dB86/wvdfqY5h/wmcS0cUv4eJXJL/EtmfeoOPxp1Rq6l+MH19qkr44/RQooooAKKKKACiiigAooooAKKKKAA8imOuR2xjFPPSmnlP8AEUAcr8T/AIL+GPjHor2PiTR7PVIWUgGVPnjyOqsOQfoa+b/H/wDwSN8Ia9I03h7XNY0GRv8AllIBdQj2AbBA/Gvrlcn0pcGvUwGeY/BaYarKK7dPuPBzThfK8xfNjKMZPvaz+9HwXdf8EbdTWQ+T44tCjdfM0pf/AIqtzwn/AMEctPgnRtc8aahdKCD5dlapb8ezZJB96+2cZFA4NexU45zqUeX21vkrngUfDPh6nPnVC/q2eS/B/wDYo+HnwQdJtH0G3l1AY3Xt5/pFwxHOdzdD7gCvV44yn+17mnEbaTLH1r5rEYytiJ89eTk/Nn2GDy7DYSHs8NBQXZKwjHBNB9acq5oHXpWB2nkv7W37LVr+1P4T03S7rVLnSlsLr7QskMYck7SvIP1rwcf8EcdHXGPGepMf+vKP/GvtFhntS89a9zL+JczwVL2GGquMe2n+R8xmnB+T5jXeIxlFSm7a69D5S+D/APwS50v4R/E3RfEkPirULyTSLhZ1ha0RRJhg2CQeM4619X0YxRXHmGa4rHTU8XNya0Vz0coyPBZZTdLBQ5E3d27hRRRXnnrAelcF+0V8GIf2gvhHqnhO4vJdPj1Qw/v403NH5cqS9DwfuAV3rdKYAxrSjWnSnGpB2ad0c+Kw9OvSlQqq8ZKzXkfFn/DnDRwn/I56lu/68o/8aU/8EcNHC8eM9S3ev2KP/GvtMDn8aXFfRf655ytFXf4f5Hx68OeHumHX3v8AzPis/wDBHDRwvHjPUt3r9ij/AMaD/wAEcNHC8eM9S3ev2KP/ABr7UxRin/rpnX/P9/h/kP8A4hzw9/0Dr73/AJnxX/w5w0cL8vjTUt3r9ij4/WvY/wBkf9jaz/ZOutea11e61b+3Bbh2kgWPb5fmAdPZ69wxRtyK5MZxNmeLpOhiarlF9NDty/gvJ8DXWJwtFRmtnqcP+0J8HYfj18K9U8Kz3k1jHqyxqZ403GPZIr5x06r3r5kP/BHDRwvHjPUt3r9ij/xr7TII6UuKzy/iDMMDTdPCVOVN36HRm3CeV5nVVbG0lKSVtWz4sH/BHHR0GR4y1JmHY2aDP619mWVuba1RT821QM+tTEUpOBWOZZzjcfyvFz5uXY2yfhzL8r5vqNNQ5t7COm6Pb7dq+ev2pP8Agnzof7SfjC217+1LzQtQWIw3DW0autyO24HuK+hdxP503HPfNY5fmGIwdX22Gk4y7nVmmUYTMqH1bGQUo9mfF3/Dm/R9v/I5al75sk/xre+F3/BLaH4R+P8ASvEWl+ONWS70ucSbRaIqzpkExtz0OMH2NfWv50hTd/er2KvF2b1YOlVrNxe6sv8AI+fo+H+RUqqrUqCUo6p3f+YyIYCjPPGSR1qamkYPenV83e59ltoU/EekDX/D99YtI0IvIHhLqMlNykZA9s18bv8A8EddHmZpF8Y6kpkyf+PJBjOT6+9fahpAfavUy3O8dgLrCTcb72PCzjhrLs0cZY6mpuOiPiwf8EctHjGf+E01PcP+nKPP86+pPgb8K4fgp8LNG8L29zJeQ6PAIVndAjSDJPIH1rrsYoJ21WYZ9j8fBU8XUcktVe25GT8K5XllR1cDSUG1Zi4wOKjnRnhZQ21mGAcdKfntRyDXkanvtXVmfHXif/gktY+LfEuoateeNtUa81OeSe4JskYM7nJxz26VQP8AwRw0hU+XxlqW71+xx/419qY5oIz9K+mhxjm8YqMazsttF/kfGVvD3IasnOpQTb3d2eR/sofsn6Z+yr4a1Cx0+8uNSn1S6+0TXE8ao2ANqrx6c169TAMH/Gn14OKxVbEVZVq8uaUt2fUYHA0MHQjhsNHlhHZBTX4NOPSm43dawOw5/wCJ/gC1+KPw/wBa8P3jbLfWLKW0dtoby96kBwD3U4I9wK+TpP8Agjjop37PGGpJuOQPscfH619o7MGnV62X57jsBFwwlRxT1drHz+b8LZZmc41MdSUnFWW+x8V/8OcdHjGf+Ey1JiP+nOMf1r6a/Z4+ETfAv4V6b4XOqXGsR6WCkM86BX2E5Cn6ZrujyKaBsp5hn+Px8FTxdRyS1WxOU8J5XllV1sFS5JNW0uG3DU6jGaK8g+iCiiigAooooAKKKKACiiigAooooAKKKKAEcbkPbjqK8++N/wCzR4P/AGgNHa38R6THcTKMxXUX7u5hYdCrjnI6jORXoR6U08L3/KtsPiKtCaq0ZOMl1W5zYvCUcTSdHERUovo1dHwn4o/4JY+MPh1rM2pfDfxtJbsG3xRyySWk6D0EkZwze7Ac+lUzoX7XngRPJt7i+1CGPgSNNYXhf8ZDvr746rSbeK+kjxdi5rlxNOFTzlFNnxUvD3Axk54OrUpX6Rm7fcfBLTftheIyY9t1bowwSsWm2+M/7RbP5Uy2/wCCevxl+M9zHcePvGiw25YM0M93JfSR884RcR/hnFffW3igLk1X+uGIgrYalTpvuoK4f8Q/wtV/7XXq1F2c3b7keG/s+fsCeA/gIYLyOxbXNcjx/wATHUcSOpzn92p+VOemBkete5Kuz19M0FMEU6vncXjsRi6ntcRNyfn+h9fl2V4XAUvY4SmoR7L9e4N0r5V/4KR/sx+Lv2iLzwa/hW0ium0cXhnMlysHlmQ2+wgngn5GOPavqqmjvxWmW5hVwOJjiqKXNHvttYxzrKaOZ4SWCxF+WVtt9Hc+B4vgn+1daIqQa7dRxIAqoNWhAUAYAo/4Uz+1l/0MF5/4N4q++D/WjDV9B/rliHr7Gl/4AfKLw7wi0jiKqX+NnwP/AMKZ/ay/6GC8/wDBvFR/wpn9rL/oYLz/AMG8VffGGow1H+uWI/58Uv8AwAP+Ie4b/oJrf+Bs+B1+DP7WW7/kYbwe/wDa0Jqz+z/+x/8AFzS/2qtA8beNYYrtbaQm9u31BJJGxbNEpwv+9X3ftY0ClU4yxTpzpqlTipKzajZ2Y6fh7glVhVnVqS5GpJSldXR8u/8ABR/9mbxd+0RD4RXwtbpcSaS900+64WHZvWMKQW4zlT+VeSwfBD9qyxgWGHWrqGGPCRqurxfu1AwK+/MZNLjbWGC4qxOGw0cIqcJRjdrmjfc6cy4FweLxc8a6k4Tna/LK2x+enjD9mj9pz4h+HrjSdb1CTUNLuyDNBLqsJVwrh1B9sgV9VfsN/CXWvgl+ztpHh/xBbpb6lZyTeYiSiVfmkYg5Hsa9gYnd0oJxWOZcSYjG4dYWcIxje9oq2p0ZNwdhMvxbxkJzlO1rylfQZNEs0LI67kcFSpHUV8HfEX9hf4o/Cz4465rXwnm+waTqnzRvDfrbyJu5ZGVuqhulfeZ/yaAveuXKc6xGXym6NmpKzTV0/kd2fcO4bNoQVduMoO6lF2a+Z8ED4NftZKd3/CQXn4avDzXL/ET9in9oT4tzW7eJmXVmtY/KSWTVIRIqk5PIr9IDkGk27T3r3aPHGLpT9pTpU4vuonzGI8NMDWp+zrV6so9nNs8r/ZD07x14e+EFlpXxAtbe31jSz9nSWC5E4uIh9wkjuBwfpXqr9KaV/OnAbcV8liq7rVZVWknJ3svM+9wOF+rUI4dNtRVk3v5HO/Eb4WaD8WPD02meINNt9Ss5lKlJF5TIxlT1U+4NfJnxM/4JLNa6q+pfD7xXdaNOj+bBbXUjhYmHI2yody898EjrzX2qy5oC8f4V3ZbnmNwOlCbUez1X3HkZxwvluZ+9i6d5fzLR/ej4H/4Vj+1p8LF+z6bq15rEEXCt9ttbwED0+0EP+lB1f9sS/wD3Sw30W4YJNvpaA/j2+o6V98AYoI4r2P8AWyUveqYalJ9+U8D/AFDjH3aWLrRj257/AInwHN+x5+0Z8cl8vxb4rk0u1kGyWG51QtGVPDfurf5W4z8rEA9Ca9c+A/8AwS78F/DO7i1HxBJN4s1aMhs3CCO1jIwfljGe/qTmvp85JoPI44rDFcW5hWh7KDVOPaC5f+Cd2C4DyuhUVarzVZLrN834EFnp8Wn26xwokaxqERUUKqqOgA7AUag0kNjM0MfmyqhZEB27zjgZPAzUxB/xp22vm+bW7Pr3FOPKtP66H5y3H7G/x8HxZ1Lxnp1vFp+t31zNOk66jBuQSEqQOeDsNdEfgv8AtZKP+RgvB7jV4q++DSAV9fPjXFzSU6VOVkkrxvoj8/p+G+Bg5OnWqx5m27Stqz88Nb/Yt+PPxp8RaLB44uWv9KtrxfMeXVI3a3ichZG2j72FycDriv0E0fTY9F0q3tYY1SG1jWKNFHChRgYq6RupB1rx82zyvmEYQrJRjDZRVlqe/kHC+FymU6lGUpSna7k7vQap5/CpGGVpoHOKdXjn0hleNvClr448I6po97H5tnqttJazIe6OpU4/A1+f3gj9jn9on4N/brHwpeDT7KednJttVjjV+uH2nuVwDX6LVGee3evbyriDEZdCdOlGMoytdSV1p1Pmc94WwuaVadetKUZQuk4uzs+h8EH4M/tYKPm8QXiqeuNWhP6Vi+E/2PPjxpPxq0nxxqFjBqGqWV7DdzySajCDcbcK4O3qGTI/Gv0Tx60gXBzXqx41xcYThClTXMrO0baP5nh/8Q6wUpwnUrVJcjTV5Xs0R225kUsu1sYYeh71PTR83anV8f1P0GKsrBRRRQMKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z',
          width: 300,
          height: 110,
          alignment:"center"
          //absolutePosition: { x: 94, y: 457 }
        },
        { text: 'Boucher de reserva', style: 'header' },
        { text: new Date().toTimeString(), alignment: 'right' },
 
        { text: this.offer.titulo, style: 'subheader' },
        { text: "Vendedor: " + this.selected_vendor.vendor_data.shop_name, style: 'subheader' },

        { text: "Usuario: "+ this.tokenSrv.GetPayLoad().usuario.user_name, style: 'subheader' },
        { text: "Influencer: "+ this.influencer_code, style: 'subheader' },

        { text: "Comision UN: ARS "+ this.offer.commission, style: 'subheader' },
        { text: "Cantidad: "+ this.quantity, style: 'subheader' },
        { text: "Total: ARS "+ this.offer.commission * this.quantity, style: 'subheader' },


        { text: "Codigo de reserva: "+ data.codigo_op , style: 'codigo', alignment: 'center' },

        {
          qr: this.qr_data,
          margin: [46, 130, 0, 0],
          fit: 75,
        },
 
 
  
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 10, 0, 0]
        },
        codigo: {
          fontSize: 25,
          bold: true,
          margin: [30, 25, 0, 0]
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },

      }
    }
    console.log(docDefinition);
    this.pdfObj = pdfMake.createPdf(docDefinition);
  }
 
  downloadPdf(data) {
    
    this.createPdf(data);
    
    if (this.platform.is('cordova')) {

      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.externalDataDirectory, 'qrOfertacerca.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.externalDataDirectory + 'qrOfertacerca.pdf', 'application/pdf');
        })
      });
    } else {

      // On a browser simply use download!
      this.pdfObj.download();
    }
  }



}
