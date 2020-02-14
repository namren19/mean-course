import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL =  environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[], postCount: number}>();


  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPosts: number}>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map((postData) => {
        return { posts: postData.posts.map(post => { // .map() can be add to any array and every iteration will be converted
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creator: post.creator
          };
        }), maxPosts: postData.maxPosts };
    }))
    .subscribe((transformedPostData) => { // this will be the result of map operation
      console.log(transformedPostData);
      this.posts = transformedPostData.posts; // automatically converts json to objects
      this.postUpdated.next({ posts: [...this.posts], postCount: transformedPostData.maxPosts});
    });
    // return [...this.posts];  spread operator
  }

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{ message: string, post: Post }>(
      BACKEND_URL,
      postData
      )
      .subscribe((responseData) => {
          this.router.navigate(['/']);
      });

  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);



  }

  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>(
      BACKEND_URL + id
      );
    // return {...this.posts.find(p => p.id === id)};
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
      let postData: Post | FormData;
      if (typeof(image) === 'object') {
          postData  = new FormData();
          postData.append('id', id);
          postData.append('title', title);
          postData.append('content', content);
          postData.append('image', image, title);

      } else {
          postData = {
            id: id,
            content: content,
            title: title,
            imagePath: image,
            creator: null
        };
      }

      this.http.put(BACKEND_URL+ id, postData)
      .subscribe((response) => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
      });
  }

}
