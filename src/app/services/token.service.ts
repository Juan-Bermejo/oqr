import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(public jwtHelper: JwtHelperService) { }

  public isAuthenticated(): boolean {
    const token = sessionStorage.getItem('token');
    if(token)
    {
      return !this.jwtHelper.isTokenExpired(token);
    }

    
  }

  public GetPayLoad():any {
    if(localStorage.getItem('token'))
    {
      return this.jwtHelper.decodeToken(localStorage.getItem('token'));
    }
    else{
      return false;
    }
   
  }

}
