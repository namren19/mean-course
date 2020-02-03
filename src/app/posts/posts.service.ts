import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  getPosts() {
    return [...this.posts]; // spread operator
  }

  addPosts(title1: string, content1: string) {
    const post: Post = {title: title1, content: content1 };
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }
}
