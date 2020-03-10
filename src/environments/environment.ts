import { User } from '../app/clases/user';
import { Location } from '../app/clases/location';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {

    apiKey: "AIzaSyDp1Yj3P0CD3x-JuURp9jqLRi8k5XBHC3w",
    authDomain: "oqrdb-b0ade.firebaseapp.com",
    databaseURL: "https://oqrdb-b0ade.firebaseio.com",
    projectId: "oqrdb-b0ade",
    storageBucket: "oqrdb-b0ade.appspot.com",
    messagingSenderId: "175362284009",
    appId: "1:175362284009:web:5098a66554770747411378"
  
  }
  
};
var l1= new Location();
var l2= new Location();
var l3= new Location();

l1.latitude=-34.604669;
l1.longitude=-58.3979167;
l1.address="Av. Corrientes 2020"
l1.city="CABA";
l1.country="Argentina";

l2.latitude=-34.6082746;
l2.longitude=-58.4352118;
l2.address="Av. Díaz Vélez 4531"
l2.city="CABA";
l2.country="Argentina";

l3.address="Av. Boedo 25";
l3.city="CABA";
l3.latitude=-34.6113625;
l3.longitude=-58.4207372;
l2.country="Argentina";

export var user: User = new User();
user.name="nombre";
user.last_name="apellido";
user.locations= [l1, l2, l3];



export var offer_list = [
  {id:1, title: "Descuento del 50% en GYM.", category: "gym", cantidad:1, description:"consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ", views: 300, sellers:50, date: "2020-02-06", commission:10, total_commission: 500},
  {id:2, title: "Descuento del 50% en corte de pelo.", category: "hair", cantidad:1, description:"consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ", views: 150, sellers:50, date:"2020-02-03" , commission:10, total_commission: 400},
  {id:3, title: "1 Sesión gratis en SPA.", category: "yoga", cantidad:1, description:"consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ", views: 400, sellers:50, date:"2020-02-04" , commission:10, total_commission: 600},
  {id:4, title: "1 Asesoria contable gratis. ", category: "business", cantidad:1, description:"consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ", views: 100, sellers:50, date:"2020-02-10" , commission:10, total_commission: 300},
  {id:5, title: "2x1 en platos desechables. ", category: "bazar", cantidad:1, description:"consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. ", views: 200, sellers:50, date:"2020-02-05" , commission:10, total_commission: 350},
]

export var categories = [
  {name: "Arte", icon:"md-color-palette"},
  {name: "Gym", icon:"md-fitness"},
  {name: "Negocios", icon:"md-analytics"},
  {name: "Bazar", icon:"md-gift"},
  {name: "Estetica", icon:"md-cut"},
  {name: "Salud", icon:"md-medical"},
  {name: "Tecnologia", icon:"md-desktop"},
  {name: "Gastronomia", icon:"md-pizza"},
  {name: "Deportes", icon:"md-football"},
  {name: "Entretenimiento", icon:"logo-game-controller-b"},
  {name: "Educacion", icon:"md-school"},
  {name: "Libreria", icon:"md-book"},
  {name: "Automotor", icon:"md-car"},
  {name: "Indumentaria", icon:"md-shirt"},
  {name: "Jugueteria", icon:"md-rocket"},
  {name: "Hogar", icon:"md-home"},
  {name: "Farmacia", icon:"md-medkit"},
  {name: "Cuidado personal", icon:"md-bicycle"},
  {name: "Viajes", icon:"md-airplane"},
  {name: "Herramientas", icon:"md-construct"},
  {name: "Musica", icon:"md-musical-notes"},
  {name: "Mascotas", icon:"md-paw"},
  {name: "Jardineria", icon:"md-flower"},
  {name: "Otros", icon:"md-globe"}

]
export var kind_offer=[
"Gratis",
"Regalo"
]


export const roles ={

  vendedor: "vendedor",
  comprador: "comprador"
}

export var menu_opt_logged = [
  {
    "icon":"md-person",
    "name":"Mi cuenta",
    "redirectTo": "seller-panel",
    
  },
  {
    "icon":"md-megaphone",
    "name":"Panel influencer",
    "redirectTo": "influencer-panel",
  },
  {
    "icon":"md-card",
    "name":"Ofertas",
    "redirectTo": "offer-details",
    
  },
  {
    "icon":"md-cash",
    "name":"Quiero hacer una oferta",
    "redirectTo": "new-offer",

  },
  {
    "icon":"md-megaphone",
    "name":"Quiero promocionar una oferta",
    "redirectTo": "offer-details",
  },
  {
    "icon":"md-power",
    "name":"Cerrar sesion",
    "redirectTo": "login",
  },

]

export var menu_opt = [
  {
    "icon":"key",
    "name":"Iniciar sesion",
    "redirectTo": "login",
  },
  {
    "icon":"finger-print",
    "name":"Registrarse",
    "redirectTo": "register",
  },
]

export const slideOpts = {
  slidesPerView: 3,
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  on: {
    beforeInit() {
      const swiper = this;

      swiper.classNames.push(`${swiper.params.containerModifierClass}coverflow`);
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`);

      swiper.params.watchSlidesProgress = true;
      swiper.originalParams.watchSlidesProgress = true;
    },
    setTranslate() {
      const swiper = this;
      const {
        width: swiperWidth, height: swiperHeight, slides, $wrapperEl, slidesSizesGrid, $
      } = swiper;
      const params = swiper.params.coverflowEffect;
      const isHorizontal = swiper.isHorizontal();
      const transform$$1 = swiper.translate;
      const center = isHorizontal ? -transform$$1 + (swiperWidth / 2) : -transform$$1 + (swiperHeight / 2);
      const rotate = isHorizontal ? params.rotate : -params.rotate;
      const translate = params.depth;
      // Each slide offset from center
      for (let i = 0, length = slides.length; i < length; i += 1) {
        const $slideEl = slides.eq(i);
        const slideSize = slidesSizesGrid[i];
        const slideOffset = $slideEl[0].swiperSlideOffset;
        const offsetMultiplier = ((center - slideOffset - (slideSize / 2)) / slideSize) * params.modifier;

         let rotateY = isHorizontal ? rotate * offsetMultiplier : 0;
        let rotateX = isHorizontal ? 0 : rotate * offsetMultiplier;
        // var rotateZ = 0
        let translateZ = -translate * Math.abs(offsetMultiplier);

         let translateY = isHorizontal ? 0 : params.stretch * (offsetMultiplier);
        let translateX = isHorizontal ? params.stretch * (offsetMultiplier) : 0;

         // Fix for ultra small values
        if (Math.abs(translateX) < 0.001) translateX = 0;
        if (Math.abs(translateY) < 0.001) translateY = 0;
        if (Math.abs(translateZ) < 0.001) translateZ = 0;
        if (Math.abs(rotateY) < 0.001) rotateY = 0;
        if (Math.abs(rotateX) < 0.001) rotateX = 0;

         const slideTransform = `translate3d(${translateX}px,${translateY}px,${translateZ}px)  rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

         $slideEl.transform(slideTransform);
        $slideEl[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;
        if (params.slideShadows) {
          // Set shadows
          let $shadowBeforeEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-left') : $slideEl.find('.swiper-slide-shadow-top');
          let $shadowAfterEl = isHorizontal ? $slideEl.find('.swiper-slide-shadow-right') : $slideEl.find('.swiper-slide-shadow-bottom');
          if ($shadowBeforeEl.length === 0) {
            $shadowBeforeEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'left' : 'top'}"></div>`);
            $slideEl.append($shadowBeforeEl);
          }
          if ($shadowAfterEl.length === 0) {
            $shadowAfterEl = swiper.$(`<div class="swiper-slide-shadow-${isHorizontal ? 'right' : 'bottom'}"></div>`);
            $slideEl.append($shadowAfterEl);
          }
          if ($shadowBeforeEl.length) $shadowBeforeEl[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0;
          if ($shadowAfterEl.length) $shadowAfterEl[0].style.opacity = (-offsetMultiplier) > 0 ? -offsetMultiplier : 0;
        }
      }

       // Set correct perspective for IE10
      if (swiper.support.pointerEvents || swiper.support.prefixedPointerEvents) {
        const ws = $wrapperEl[0].style;
        ws.perspectiveOrigin = `${center}px 50%`;
      }
    },
    setTransition(duration) {
      const swiper = this;
      swiper.slides
        .transition(duration)
        .find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left')
        .transition(duration);
    }
  }
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
