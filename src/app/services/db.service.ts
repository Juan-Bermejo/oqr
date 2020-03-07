import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserLogin } from '../models/users';
import { RegisterPage } from '../register/register.page';
import { MapsAPILoader } from '@agm/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  selectedUser: User;
  users: User[];

  public id: string;
  public is_logged: boolean = false;

  readonly URL_SERVER = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/users/';
  readonly URL_SERVER_LOG = 'http://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/users/log';

  constructor(private http: HttpClient) {
    this.selectedUser = new User();
   }

    addUser(user: User) {
      return this.http.post(this.URL_SERVER, user,
        {headers: new HttpHeaders({"Content-Type": "application/json"})});
    }

    checkLogin(email,password) {
      var data = {
        "email": email,
        "password": password
      }
      return this.http.post(this.URL_SERVER_LOG, data);
    }

    getUser(user_id: string) {
      if(user_id != ''){
        this.id = user_id;
        var GET_USER_URL = this.URL_SERVER.concat(this.id.toString());
        return this.http.get(GET_USER_URL);
      }
    }
  /*

  editUser(user: User) {
    return this.http.put(this.URL_SERVER + `/${user._id}`, user);
  }

  deleteUser(_id: String) {
    return this.http.delete(this.URL_SERVER + `/${_id}`);
  }
  
  */

}
