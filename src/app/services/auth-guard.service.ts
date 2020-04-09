import { Injectable } from '@angular/core';

import { Router, CanActivate } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from './token.service';
import { tokenGetter } from '../app.module';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  //info= this.auth.GetPayLoad();
 
 constructor(public auth: TokenService, public router: Router) {}
 
 

/*canActivate(): boolean {
   if (!this.auth.isAuthenticated()) {
     this.router.navigate(['login']);
     console.log(this.info);

     return false;
   }

 
   console.log(this.info);
   return true;
}*/

/*
canActivate(): boolean {
  if (!tokenGetter()) {
    console.log("no token")
    this.router.navigate(['login']);
    

    return false;
  }
  
  
  return true;
}*/

canActivate(): boolean {
  if (tokenGetter()) {
    console.log("no token")
    this.router.navigate(['home']);
    

    return false;
  }
  
  
  return true;
}
}



