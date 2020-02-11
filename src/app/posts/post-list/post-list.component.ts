import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
      this.isLoading = true;
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
      this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe((postData: { posts: Post[], postCount: number}) => {
          this.posts = postData.posts;
          this.isLoading = false;
          this.totalPosts = postData.postCount;
        });
      this.userIsAuthenticated = this.authService.getIsAuth();

      this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onDelete(postId: string) {
      this.isLoading = true;
      this.postsService.deletePost(postId).subscribe(() => {
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }



}
