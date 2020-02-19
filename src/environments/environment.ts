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

export var offer_list = [
  {id:1, title: "Descuento del 50% en GYM.", category: "gym", cantidad:1, description:"fgdgfdg"},
  {id:2, title: "Descuento del 50% en corte de pelo.", category: "hair", cantidad:1, description:"fgdgfdg"},
  {id:3, title: "1 Sesión gratis en SPA.", category: "yoga", cantidad:1, description:"fgdgfdg"},
  {id:4, title: "1 Asesoria contable gratis. ", category: "business", cantidad:1, description:"fgdgfdg"},
  {id:5, title: "2x1 en platos desechables. ", category: "bazar", cantidad:1, description:"fgdgfdg"},
]

export var categories = {
  gym: "gym",
  negocios: "negocios",
  bazar: "bazar",
  estetica: "estetica",
  salud: "salud",
  tecnologia: "tecnologia",
  gastronomia: "gastronomia",
  deportes :"deportes",
  entretenimiento: "entretenimiento",
  educacion: "educacion",
  automotor: "automotor"
}

export const roles ={

  vendedor: "vendedor",
  comprador: "comprador"
}

export var menu_opt = [
  {
    "icon":"md-person",
    "name":"Mi cuenta",
    "redirectTo": "seller-panel",
    
  },
  {
    "icon":"md-card",
    "name":"Ofertas",
    "redirectTo": "offer-details",
    
  },
  {
    "icon":"md-cash",
    "name":"Quiero hacer una oferta",
    "redirectTo": "offer-details",

  },
  {
    "icon":"md-megaphone",
    "name":"Quiero promocionar una oferta",
    "redirectTo": "offer-details",
  },
  {
    "icon":"md-power",
    "name":"Cerrar sesion",
    "redirectTo": "offer-details",
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
