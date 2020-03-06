import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/users';
import { RegisterPage } from '../register/register.page';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  selectedUser: User;
  users: User[];
  readonly URL_SERVER = 'https://cors-anywhere.herokuapp.com/http://31.220.61.6:3000/app/users';

  constructor(private http: HttpClient) {
    this.selectedUser = new User();
   }

   addUser(user: User) {
    return this.http.post(this.URL_SERVER, user,
      {headers: new HttpHeaders({"Content-Type": "application/json"})});
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
