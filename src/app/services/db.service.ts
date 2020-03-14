import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserLogin } from '../clases/user';
import { Offer } from '../clases/offer';
import { RegisterPage } from '../register/register.page';
import { MapsAPILoader } from '@agm/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  selectedUser: User;
  users: User[];

  public user_id: string;
  public offer_id: string;
  public $products: Subject<Offer>

  public is_logged: boolean = false;
  public user_data;

  readonly URL_SERVER_USER = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/users/';
  readonly URL_SERVER_PROD = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/products/';
  readonly URL_SERVER_LOG = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/users/log';

  constructor(private http: HttpClient) {
    this.selectedUser = new User();
   }

    addUser(user: User) {
      return this.http.post(this.URL_SERVER_USER, user,
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

    /*

    editUser(user: User) {
      return this.http.put(this.URL_SERVER_USER + `/${this.user_id}`, user);
    }

  deleteUser(_id: String) {
    return this.http.delete(this.URL_SERVER + `/${_id}`);
  }
  
  */

}
