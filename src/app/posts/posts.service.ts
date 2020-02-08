import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();


  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<{message: string, posts: any}>(
      'http://localhost:3000/api/posts'
    )
    .pipe(map((postData) => {
        return postData.posts.map(post => { // .map() can be add to any array and every iteration will be converted
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
    }))
    .subscribe((transformedPosts) => { // this will be the result of map operation
      this.posts = transformedPosts; // automatically converts json to objects
      this.postUpdated.next([...this.posts]);
    });
    // return [...this.posts];  spread operator
  }

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{ message: string, post: Post }>(
      'http://localhost:3000/api/posts',
      postData
      )
      .subscribe((responseData) => {
          const post: Post = {
            id: responseData.post.id,
            title: responseData.post.title,
            content: responseData.post.content,
            imagePath: responseData.post.imagePath
         };
          this.posts.push(post);
          this.postUpdated.next([...this.posts]);
          this.router.navigate(['/']);
      });

  }

  deletePost(postId: string) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId); // filter allows us to only return the subset of array
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
    });


  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string}>(
      'http://localhost:3000/api/posts/' + id
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
            imagePath: image
        };
      }

      this.http.put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe((response) => {
        // console.log(response);
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {
          id: id,
          content: content,
          title: title,
          imagePath: 'response.imagePath'
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
      });
  }

}
