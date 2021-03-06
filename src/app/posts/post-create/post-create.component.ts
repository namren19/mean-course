import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType1 } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['post-create.component.css']

})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  isLoading = false;
  post: Post;
  form: FormGroup;
  imgPreview: string;
  private mode = 'create';
  private postId: string;
  private authStatusSub: Subscription;

  constructor(public postsService: PostsService,
              private authService: AuthService,
              public route: ActivatedRoute) {}
  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
          this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, { validators: [Validators.required],
        asyncValidators: [mimeType1]
      })
    });
    this.route.paramMap
    .subscribe((paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postsService.getPost(this.postId)
          .subscribe(postData => {
            // console.log(postData);
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath,
              creator: postData.creator
            };
              // console.log(this.post);
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.imagePath
            });
          });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPosts(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );

    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
        );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file}); // target single control
    this.form.get('image').updateValueAndValidity();  // informs angular that we updated the value in form control
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    console.log(file);
    console.log(this.form);
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
