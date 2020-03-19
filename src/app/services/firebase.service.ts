import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from '../clases/user';
import { Offer } from '../clases/offer';
import { Location } from '../clases/location';
import { PostLink } from '../clases/post-link';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  public user:User;
  public observable: Observable<any>;

  constructor(
    public db: AngularFirestore,
    public storage: AngularFireStorage) {

    this.getUser().subscribe((data:User)=>{
      this.user=data;
    })
  
   }



getUsers()
{
  return this.db.collection("users").valueChanges();
}

getUser()
{

  return this.db
  .collection("users").doc("BQYghCZRSWjWh8nwCysl").valueChanges();

  //return this.db.collection<User>("users", ref => ref.where("name", "==", "ricardo")).valueChanges();
}

getOffer(offerId)
{

  return this.db
  .collection<Offer>("offers").doc(offerId).valueChanges();

  //return this.db.collection<User>("users", ref => ref.where("name", "==", "ricardo")).valueChanges();
}

getOffers()
{
  return this.db.collection<Offer>("offers").valueChanges();
}

setUser(user:User)
{
  
  let id = this.db.createId();
    
  user._id = id;

  return this.db.collection<User>("users").doc(id).set(JSON.parse(JSON.stringify(user)));
}

setPostLink(post:PostLink)
{
  
    let id = this.db.createId();
    
    post.id = id;

    return this.db.collection<PostLink>("post_link").doc(id).set(JSON.parse(JSON.stringify(post)));
  }

  getOfferPostsLink(offer_id)
  {
    return this.db.collection<PostLink>("post_link", ref => ref.where("offer_id", "==", offer_id)).valueChanges();
  }

/*updateUser(user:User)
{
  return this.db.collection<User>("users").doc(user.id).set(JSON.parse(JSON.stringify(user)));
 
}*/

updateOffer(offer:Offer)
{
  return this.db.doc(offer._id).update(JSON.parse(JSON.stringify(offer)));
}


setOffer(offer:Offer)
{
  let id = this.db.createId();
    
  offer._id = id;

  return this.db.collection<Offer>("offers").doc(id).set(JSON.parse(JSON.stringify(offer)));
}


getLocationUser(user_id)
{
  return this.db.collection<Location>("locations", ref => ref.where("user_id", "==", user_id)).valueChanges();
}

/*setLocation(location:Location)
{
  let id = this.db.createId();
    
  location.id = id;
  this.user.locations.push(location);

  return this.db.collection<Location>("locations").doc(id).set(JSON.parse(JSON.stringify(location)))
  .then(()=>{
    this.updateUser(this.user);
    console.log("se guardo la locacion");
  })
  .catch(()=>{
    console.log("No se pudo guardar la locacion");
  })
}*/


}


