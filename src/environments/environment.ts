import { User } from '../app/clases/user';
import { Location } from '../app/clases/location';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};




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

export var firebaseConfig = {
  apiKey: "AIzaSyDk0aKqF6FwBq3bwtMb7UUEYrJzZQp4Puw",
  authDomain: "oqrapp.firebaseapp.com",
  databaseURL: "https://oqrapp.firebaseio.com",
  projectId: "oqrapp",
  storageBucket: "oqrapp.appspot.com",
  messagingSenderId: "993811503147",
  appId: "1:993811503147:web:2df9cd91a11accab75f26e"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
