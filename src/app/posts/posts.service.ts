import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();


  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((postData) => {
      this.posts = postData.posts; // automatically converts json to objects
      this.postUpdated.next([...this.posts]);
    });
    // return [...this.posts];  spread operator
  }

  addPosts(title1: string, content1: string) {
    const post: Post = { id: null, title: title1, content: content1 };
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((responseData) => {
          console.log(responseData.message);
          this.posts.push(post);
          this.postUpdated.next([...this.posts]);
      });

  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }
}
