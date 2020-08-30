import { Component, OnInit, ViewChild } from '@angular/core';
import { kind_offer, categories } from '../../environments/environment';
import { IonSlides, IonSlide, ModalController, NavController, PopoverController, AlertController } from '@ionic/angular';
import { User } from '../clases/user';
import { Location } from '../clases/location';
import { CountriesService } from '../services/countries.service';
import { NavParamsService } from '../services/nav-params.service';
import { AddLocationPage } from '../modals/add-location/add-location.page';
import { ModalCategoriesPage } from '../modals/modal-categories/modal-categories.page';
import { ModalSimplePage } from '../modals/modal-simple/modal-simple.page';
import { PopOverProductsComponent } from '../componentes/pop-over-products/pop-over-products.component';
import { Offer } from '../clases/offer';
import { DbService } from '../services/db.service';
import { of, Subscription } from 'rxjs';
import { Seller } from '../clases/seller';
import { ZBar, ZBarOptions } from '@ionic-native/zbar/ngx';
import { Product } from '../clases/product';
import { SelectRelatedProductsPage } from '../modals/select-related-products/select-related-products.page';
import { Token } from '@angular/compiler';
import { TokenService } from '../services/token.service';
import { AsociateOfferModalComponent } from '../componentes/asociate-offer-modal/asociate-offer-modal.component';
import { MensajeComponent } from '../componentes/mensaje/mensaje.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  offerImg: File = null;
  // @ViewChild('slider',{ read: true, static: false }) private slider: IonSlides;
  @ViewChild('slides', { static: true }) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  time_type;
  time_value;
  user_id: string;
  user_data: User;
  check_time_discount: boolean;
  categories = categories
  prod_subcribe: Subscription;
  type_offer: string;
  spinner: boolean = false;
  seller: Seller;
  user: User;
  index: number = 0;
  id: number;
  product: any;
  price: number;
  stock: number;
  currency_commission: string;
  commission: number;
  category: string;
  sellers: User;
  locations: Location[];
  is_active: boolean;
  kind: string;
  description: string;
  cuantity: number;
  prod_currency;
  budget: number;
  region: Array<string>;
  countries;
  currencies;
  products: any[];
  brand: string;
  barcode: number;
  offer_exist: boolean = true;
  percentage: number;
  o_prueba: Offer;
  searchText: string;
  product_list: Array<Product>;
  aux_product_list: Array<Product>;
  labels: string[];
  label:string;



  constructor(private countrySrv: CountriesService,
    private modalController: ModalController,
    public navCtrl: NavController,
    private ParamSrv: NavParamsService,
    private alertCtrl: AlertController,
    private zbar: ZBar,
    private dbService: DbService,
    private router: Router,
    private token: TokenService) {
    this.prod_subcribe = new Subscription()
    this.product = {
      "product_ref": ""
    }
    this.labels = new Array<string>();
    this.products = new Array<Product>();
    this.aux_product_list = new Array<Product>();


    this.user = token.GetPayLoad().usuario;
    this.kind = "Producto";
    this.countrySrv.getCountries().subscribe((c) => {
      this.countries = c;
      console.log(c);
    })
    console.log(this.user)

    this.dbService.checkIsVendor(this.user._id).subscribe((data: any) => {
      if (data) {
        this.seller = data.vendor_data;
        this.currency_commission = this.seller.currency;
        this.prod_currency = this.seller.currency;
        console.log(this.seller)
      }

    })
  }

  removeLabel(index)
  {
    console.log(index);
    console.log(this.labels[index]);
    this.labels.splice(index,1);
  }

  addLabel()
  {
    
    if( this.labels.findIndex(l=> l == this.label) == -1 )
    {
      this.labels.push(this.label);
      this.label ="";
    }

  }


  addNote(p) {
    this.product = p;
    this.searchText = p.name;
    this.aux_product_list = new Array<Product>();
    console.log(this.product);
  }

  filter(input) {
    if (this.prod_subcribe.closed == false) {
      console.log(this.prod_subcribe.closed)
      this.prod_subcribe.unsubscribe();
      console.log("abierto y cierra");
    }

    this.spinner = true;
    let key = this.searchText//input.detail.value
    //let key = input.detail.value
    console.log(key)
    if (key != undefined && key != "" && key != null && key != this.product.name) {
      this.prod_subcribe = this.dbService.getFilterProducts(key, this.kind).subscribe((data: any) => {
        console.log(this.prod_subcribe.closed)
        this.aux_product_list = data;
        console.log(data);

        this.spinner = false
      })

    }
    if (key == undefined || key == "" || key == null || key == this.product.name || this.searchText == this.product.name) {
      this.spinner = false;
      this.aux_product_list = new Array<any>();
    }


  }
  removeFocus() {
    this.searchText = "";
    console.log("removeFocus");

  }


  next() {

    this.slides.getActiveIndex().then((index) => {


      switch (index) {
        case 0:
          console.log(this.type_offer)
          this.type_offer != undefined
            ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
          break;

        case 1:
          if (this.type_offer == 'Precio') {
            this.category != undefined &&
              this.kind != undefined &&
              this.offerImg != null &&
              this.product != undefined /*&&
          this.description != undefined*/
              ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
          }
          if (this.type_offer == 'Descuento') {
            this.category != undefined &&
              this.offerImg != null &&
              this.products != undefined /*&&
          this.description != undefined*/
              ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
          }
          if (this.type_offer == 'Gratis') {
            this.category != undefined &&
              this.offerImg != null &&
              this.kind != undefined &&
              this.product != undefined &&
              this.description != undefined
              ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
          }




          break;

        case 2:

          if (this.type_offer == 'Precio') {
            this.stock != undefined &&
              this.price != undefined &&
              this.prod_currency != undefined &&
              this.commission != undefined &&
              this.currency_commission != undefined
              ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true);
          }

          if (this.type_offer != 'Precio') {
            this.stock != undefined &&
              this.commission != undefined &&
              this.currency_commission != undefined
              ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true);
          }


          break;

        case 3:

          break;

        case 4:
          //this.description != "" ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
          break;

        case 5:
          // this.commission >= 0 ? this.slides.lockSwipeToNext(false) : this.slides.lockSwipeToNext(true)
          break;

        case 6:
          // this.locations[0] != null ? this.lockUnlockSwipe() : this.slides.lockSwipeToNext(true)
          break;

      }

    })
  }

  lockUnlockSwipe() {

    this.slides.lockSwipeToNext(false).then(() => {
      this.slides.slideNext().then(() => {
        this.slides.lockSwipeToNext(true);
      })
    })

  }


  setIndex() {
    this.slides.getActiveIndex().then((i) => {
      this.index = i;
      console.log(this.index)
    })
  }


  back() {
    this.slides.slidePrev()
  }




  async ModalCategories() {
    this.ParamSrv.param =
      {
        "seller": this.seller

      }
    const modal = await this.modalController.create({
      component: ModalCategoriesPage,

      cssClass: "modal"

    });
    modal.present();
    modal.onDidDismiss().then((data) => {

      this.category = data.data.result.category;
      this.ParamSrv.param = {};

    })
  }

  async ModalRelatedProducts() {
    this.ParamSrv.param =
      {
        "category": this.category,
        "type_offer": this.type_offer
      }
    const modal = await this.modalController.create({
      component: SelectRelatedProductsPage,

      cssClass: "modal"

    });
    modal.present();
    modal.onDidDismiss().then((data) => {
      console.log(data.data)

      if (this.type_offer == "Descuento") {
        this.products = data.data.result.products
      }
      else {
        this.products[0] = data.data.result.product;
        this.product = data.data.result.product;
      }

      console.log(this.products)


    })
  }


  fileUpl(files: FileList) {
    this.offerImg = files.item(0);

  }


  saveOffer() {
    this.spinner = true;

    setTimeout(() => {


      let offer = new Offer()
      this.check_time_discount ? offer.time_discount = Date.now() : offer.time_discount = 0;

      if (this.type_offer == 'Precio') {

        offer.titulo = this.product.product_ref.name + " a " + this.prod_currency + this.price;

        offer.category = this.category;
        offer.kind = this.kind;
        offer.currency_commission = this.currency_commission;
        offer.commission = this.commission;
        offer.price = this.price;
        offer.price_currency = this.prod_currency;
        offer.description = this.description;
        offer.offer_name = this.type_offer;
        offer.products = this.products;
        offer.products[0].product_ref.name = this.products[0].product_ref.name.toLowerCase();
        offer.stock = this.stock;
        offer.views = 0;
        offer.offer_name = "Precio"
        offer.is_active = false;

      }
      if (this.type_offer == 'Descuento') {
        offer.titulo = "% " + this.percentage + " en " + this.category;

        offer.category = this.category;
        offer.currency_commission = this.currency_commission;
        offer.commission = this.commission;
        offer.percentage = this.percentage;
        offer.description = this.description;
        offer.offer_name = this.type_offer;

        // offer.sellers.push(this.seller._id);
        offer.stock = this.stock;

        offer.views = 0;
        offer.offer_name = "Descuento";
        // offer.sellers_cuantity= offer.sellers.length;
        offer.is_active = false;
        offer.products = this.products
        /*for(let i=0; i< this.products.length; i++)
        {
          offer.products_id.push(this.products[i]._id);
        }*/
        console.log(" productos: ", offer.products);
      }
      if (this.type_offer == 'Gratis') {

        offer.titulo = this.product.product_ref.name + " Gratis";
        offer.category = this.category;
        offer.currency_commission = this.currency_commission;
        offer.commission = this.commission;
        offer.description = this.description;
        offer.offer_name = this.type_offer;
        offer.products = this.products;
        offer.products[0].product_ref.name = this.products[0].product_ref.name.toLowerCase();

        //offer.sellers.push(this.seller._id);
        offer.stock = this.stock;
        // offer.products.push(this.product);
        offer.views = 0;
        // offer.sellers_cuantity= offer.sellers.length;
        offer.is_active = false;


      }

      this.saveOfferDB(offer);


    }, 1000);
  }



  saveOfferDB(offer) {
    let fd = new FormData();
    fd.append("vendor_id", JSON.stringify(this.seller._id));
    fd.append("location", JSON.stringify(this.seller.location));
    fd.append("offer", JSON.stringify(offer));
    fd.append("image", this.offerImg);
    console.log(this.seller.location);



    this.dbService.createOffer(fd)
      .toPromise().then(async (data: any) => {
        console.log(data);
        if (data.ok && !data.data) {

          const obj = {
            mensaje: "Creaste la oferta existosamente!",
            url: "my-offers",

          }

          this.ParamSrv.SetParam = obj;

          const mejsModal = await this.modalController.create({
            component: MensajeComponent,
          })

          return await mejsModal.present().then(() => {
            this.slides.slideTo(0);
          });


        }

        if (data.ok && data.data) {
          fd.delete("image");
          fd.append("vendor_stock", offer.stock);
          fd.append("offer_id", data.data._id);

          this.router.navigateByUrl("asociate-offer/" + data.data._id).then(() => {
            this.slides.slideTo(0);
          })

        }
        this.spinner = false;
      })
      .catch((err: any) => {
        this.spinner = false;
      })


  }

  ngOnInit() {
    this.slides.lockSwipeToNext(true);
    /* setTimeout(() => {
       this.slider.lockSwipes(true);
   }, 500);   
    */
  }

  async readBarcode() {
    let options: ZBarOptions = {
      flash: 'off',
      drawSight: false,
      text_instructions: "Coloque el codigo en el lector.",
      text_title: "Lector de codigo de barras."

    }

    this.zbar.scan(options)
      .then(result => {
        console.log(result); // Scanned code
        this.barcode = result;

        this.dbService.checkProductByCode(result.toString()).subscribe((data: any) => {
          if (data.product == "not exist") {
            const toast = document.createElement('ion-toast');
            toast.message = 'No se encontro ningun producto.';
            toast.duration = 2000;
            toast.position = "top";
            document.body.appendChild(toast);
            return toast.present();
          }
          else {
            this.product = data.product;
            this.searchText = this.product.name;
          }
        })
      })
      .catch(error => {
        console.log(error); // Error message
      });
  }

  async validatePercentage(event) {
    var msj: string;

    if (this.percentage != undefined) {
      if (this.percentage < 1) {
        msj = "El porcentaje no puede ser menor a 1";
        const alert = await this.alertCtrl.create(
          {
            header: "Advertencia!",
            message: msj,
            buttons: [
              {
                text: 'Ok',
                role: 'cancel',
                cssClass: 'parimary',

                handler: () => {

                }
              }
            ]
          }
        );

        alert.present().then(() => {
          this.percentage = 1;
        })

      }
      if (this.percentage > 100) {

        msj = "El porcentaje no puede ser mayor a 100";
        const alert = await this.alertCtrl.create(
          {
            header: "Advertencia!",
            message: msj,
            buttons: [
              {
                text: 'Ok',
                role: 'cancel',
                cssClass: 'parimary',

                handler: () => {

                }
              }
            ]
          }
        );

        alert.present().then(() => {
          this.percentage = 100;
        });

      }

    }

  }




}
