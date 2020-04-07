import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { PostLink } from '../clases/post-link';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {


  private posts$ = new Subject<PostLink[]>();
  private posts:PostLink[];

  constructor(private http: HttpClient) {
   
   }

   pagarMobbex(data:any)
   {
  
    return this.http.post("https://api.mobbex.com/p/checkout",
  data, {headers: new HttpHeaders({
    "x-api-key":"zJ8LFTBX6Ba8D611e9io13fDZAwj0QmKO1Hn1yIj",
    "x-access-token": "d31f0721-2f85-44e7-bcc6-15e19d1a53cc",
    "Content-Type": "application/json"
  })} )
   }

   getposts$(): Observable<PostLink[]> {
    this.posts=JSON.parse(localStorage.getItem("post"));
    this.posts$.next(this.posts);
    console.log(this.posts);
    return this.posts$.asObservable();
  }


  addPost(p: PostLink) {

    this.posts.push(p);

    this.posts$.next(this.posts);
  }

  getTikTok(url: string)
  {

    return this.http.get("https://www.tiktok.com/oembed?url="+ url);

  }

}
