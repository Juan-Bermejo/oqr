import { User } from '../app/clases/user';
import { Location } from '../app/clases/location';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  mapBoxKey: 'pk.eyJ1IjoiYW1vcmVsbGkiLCJhIjoiY2s5a2JtbTNtMDloczNwcW5nbWRvdHBzZCJ9.jEm7Rp2mqcCPtyEnC4-VOw',
  mpKey: "TEST-0da93049-3fef-407b-a35a-b32b68086ea0",

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








export var categories = [
  {name: "Arte", icon:"md-color-palette"},
  {name: "Gym", icon:"md-fitness"},
  {name: "Negocios", icon:"md-analytics"},
  {name: "Bazar", icon:"md-gift"},
  {name: "Estetica", icon:"md-cut"},
  {name: "Salud", icon:"md-medical"},
  {name: "Tecnologia", icon:"md-desktop"},
  {name: "Pizzeria", icon:"md-pizza"},
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
  {name: "Almacen", icon:"md-cart"},
  {name: "Limpieza", icon:"none"},
  {name: "Higiene", icon:"none"},
  {name: "Perfumeria", icon:"none"},
  {name: "Zapateria", icon:"none"},
  {name: "Heladeria", icon:"md-ice-cream"},
  {name: "Frutas y verduras", icon:"md-nutrition"},
  {name: "Agro", icon:"none"},
  {name: "Veterinaria", icon:"none"},
  {name: "Mecanica", icon:"none"},
  {name: "Abogado", icon:"none"},
  {name: "Panaderia", icon:"none"},
  {name: "Restaurante", icon:"none"},
  {name: "Carniceria", icon:"none"},
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


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
