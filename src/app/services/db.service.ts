import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserLogin } from '../clases/user';
import { Offer } from '../clases/offer';
import { Location } from '../clases/location';
import { PostLink } from '../clases/post-link';
import { Seller } from '../clases/seller';
import { Product } from '../clases/product';
import { RegisterPage } from '../register/register.page';
import { MapsAPILoader } from '@agm/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  selectedUser: User;
  users: User[];
  public is_seller:boolean=false;
  public user_id: string;
  public offer_id: string;
  public $products: Subject<Offer>
  public is_seller$;//new Subject<boolean>();
  public is_logged$=new Subject<boolean>();
  public is_logged: boolean = false;
  public user_data;

  readonly URL_SERVER = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/';

  readonly URL_SERVER_USER = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/users/';
  readonly URL_SERVER_USER_OF = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/users/addoffer/';
  readonly URL_SERVER_PROD = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/products/';
  readonly URL_SERVER_LOG = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/users/log';
  readonly URL_SERVER_SERV = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/services/postlink';
  readonly URL_SERVER_SERV_GET = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/services/getlink';

  constructor(private http: HttpClient) {
    this.is_seller=false;
    this.is_seller$= new BehaviorSubject(this.is_seller);
    this.selectedUser = new User();

   }

    addUser(user: User) {
      return this.http.post(this.URL_SERVER_USER, user,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    googleLogin(user: User) {
      let url = 'users/google';
      var LOG_URL = this.URL_SERVER.concat(url.toString());
      return this.http.post(LOG_URL, user,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    checkLogin(user_name: string, password: string) {
      var data = {
        "user_name": user_name,
        "password": password
      }
      return this.http.post(this.URL_SERVER_LOG, data);
    }

    getUser(user_id: string) {
      if(user_id != ''){
        this.user_id = user_id;
        var GET_USER_URL = this.URL_SERVER_USER.concat(this.user_id.toString());
        return this.http.get(GET_USER_URL);
      }
    }

    updateUser(user_id: string, offer_id){
      var data = {
        "id_user": user_id,
        "id_offer": offer_id
      }
      var UPDATE_USER_OFFER = this.URL_SERVER_USER_OF.concat(this.user_id.toString());
      return this.http.post(UPDATE_USER_OFFER, data,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    deleteUser(user_id:string){
      let url = 'users/'.concat(user_id);
      let USER_URL = this.URL_SERVER.concat(url);
      return this.http.delete(USER_URL);
    }

    //OFFER SERVICES


    createOffer(offer: Offer) {
      let url = 'offers/';
      let OFFER_URL = this.URL_SERVER.concat(url.toString());
      return this.http.post(OFFER_URL, offer,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    getOffer(offer_id: string) {
      if(offer_id != ''){
        this.offer_id = offer_id;
        var GET_OFFER_URL = this.URL_SERVER_PROD.concat(this.offer_id.toString());
        return this.http.get(GET_OFFER_URL);
      }
    }

    getAllOffers() {
      let url = 'offers/';
      let OFFER_URL = this.URL_SERVER.concat(url);
      return this.http.get(OFFER_URL);
    }

    getOffersByVendor(vendor_id: string){
      let url = 'offers/vendoroffers'
      let data = {"vendor_id": vendor_id}
      let OFFER_URL = this.URL_SERVER.concat(url);
      return this.http.post(OFFER_URL, data,
      {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    getOfferLocations(offer_id: string){
      let url = 'offers/getofferlocations'
      let data = {"offer_id": offer_id}
      let OFFER_URL = this.URL_SERVER.concat(url);
      return this.http.post(OFFER_URL, data,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    nearOffers(locality: string, sub_locality: string){
      let url = 'offers/nearoffers'
      let data = {
        "locality": locality,
        "sub_locality": sub_locality
      }
      let OFFER_URL = this.URL_SERVER.concat(url);
      return this.http.post(OFFER_URL, data,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    deleteOffer(offer_id:string){
      let url = 'offers/'.concat(offer_id);
      let OFFER_URL = this.URL_SERVER.concat(url);
      return this.http.delete(OFFER_URL);
    }

    //PRODUCTS SERVICES

     getAllProducts(){
      return this.http.get(this.URL_SERVER_PROD);
    }

    createProduct(product: Product, user_id: string) {
      let url = 'products/';
      let data = {"product_data": product, "user_id": user_id}
      let PROD_URL = this.URL_SERVER.concat(url.toString());
      return this.http.post(PROD_URL , data,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    deleteProduct(product_id:string){
      let url = 'products/'.concat(product_id);
      let PROD_URL = this.URL_SERVER.concat(url);
      return this.http.delete(PROD_URL);
    }

    //LINKS SERVICES

    postLink(link: PostLink) {
      return this.http.post(this.URL_SERVER_SERV, link,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    getLinks() {
      return this.http.get(this.URL_SERVER_SERV);
    }

    getLinkById(offer_id) {
      if(offer_id != ''){
        console.log(offer_id);
        let data= {"offer_id": offer_id}

        return this.http.post(this.URL_SERVER_SERV_GET, data,
          {headers: new HttpHeaders({"Content-Type": "application/json"})});
      }
      
    }

    //LOCATION SERVICES

    saveLocation(location_data: Location) {
      let url = 'services/locations/';
      var LOC_URL = this.URL_SERVER.concat(url.toString());
      return this.http.post(LOC_URL, location_data,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    getLocation(user_id: string) {
      let url = 'services/sendlocation/';
      let data = {"user_id": user_id}
      var LOC_URL = this.URL_SERVER.concat(url.toString());
      return this.http.post(LOC_URL, data,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    //OTHER

    getLogged$(): Observable<boolean> {
      this.is_logged$.next(this.is_logged);
      return this.is_logged$.asObservable();

    }

    getIsSeller$(): Observable<boolean> {
      this.is_seller$.next(this.is_seller);
      console.log("getSeller", this.is_seller)
      return this.is_seller$.asObservable();

    }

    setIsSeller$(data:boolean)
    {
      this.is_seller=data;
      this.is_seller$.next(this.is_seller);
      console.log("setseller", this.is_seller)
    }

    setLogged(data:boolean)
    {
      this.is_logged=data;
      this.is_logged$.next(this.is_logged);
    }



    //VENDORS SERVICES

    getProdOfVendor(vendor_id: string) {
      let url = 'products/prodvendor/';
      let data = {"user_id": vendor_id}
      var PROD_URL = this.URL_SERVER.concat(url.toString());
      return this.http.post(PROD_URL, data,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    addVendor(seller: Seller) {
      let url = 'vendors/';
      var VEND_URL = this.URL_SERVER.concat(url.toString());
      return this.http.post(VEND_URL , seller,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    getVendors(category: String) {
      let url = 'vendors/getbycategory';
      let data = {"category": category}
      var VEND_URL = this.URL_SERVER.concat(url.toString());
      return this.http.post(VEND_URL , data,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    checkIsVendor(user_id: string) {
      let url = 'vendors/checkisvendor'
      let data = {"user_id": user_id}
      var URL = this.URL_SERVER.concat(url.toString());
      return this.http.post(URL, data,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    deleteVendor(vendor_id: string){
      let url = 'vendors/'.concat(vendor_id);
      let VEND_URL = this.URL_SERVER.concat(url);
      return this.http.delete(VEND_URL);
    }

    /*

    editUser(user: User) {
      return this.http.put(this.URL_SERVER_USER + `/${this.user_id}`, user);
    }

  deleteUser(_id: String) {
    return this.http.delete(this.URL_SERVER + `/${_id}`);
  }
  
  */

}
