import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserLogin } from '../clases/user';
import { Offer } from '../clases/offer';
import { Location } from '../clases/location';
import { PostLink } from '../clases/post-link'
import { RegisterPage } from '../register/register.page';
import { MapsAPILoader } from '@agm/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  selectedUser: User;
  users: User[];

  public user_id: string;
  public offer_id: string;
  public $products: Subject<Offer>
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


    createOffer(offer: Offer) {
      return this.http.post(this.URL_SERVER_PROD, offer,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    getOffer(offer_id: string) {
      if(offer_id != ''){
        this.offer_id = offer_id;
        var GET_OFFER_URL = this.URL_SERVER_PROD.concat(this.offer_id.toString());
        return this.http.get(GET_OFFER_URL);
      }
    }

     getAllProducts(){
      return this.http.get(this.URL_SERVER_PROD);
    }

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

    getLogged$(): Observable<boolean> {
      this.is_logged$.next(this.is_logged);
      return this.is_logged$.asObservable();

    }

    setLogged(data:boolean)
    {
      this.is_logged=data;
      this.is_logged$.next(this.is_logged);
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
