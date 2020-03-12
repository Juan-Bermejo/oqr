import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { PostLink } from '../clases/post-link';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {


  private posts$ = new Subject<PostLink[]>();
  private posts:PostLink[];

  constructor(private http: HttpClient) {
   
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
