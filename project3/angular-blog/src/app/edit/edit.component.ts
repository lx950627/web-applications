import { Component, OnInit } from '@angular/core';
import { Post, BlogService } from '../blog.service';
import { FormsModule,NgForm} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  post:Post;
  constructor(private blogService:BlogService,
  	          private activatedRoute: ActivatedRoute,
  	          private route:Router) { 
  }

  ngOnInit() {
  	this.activatedRoute.params.subscribe(() => 
  	  {
  	  if(this.post) {this.blogService.updatePost(this.post);}
  	  this.get();
  	  });
  }

  get():void{
  	const id = +this.activatedRoute.snapshot.paramMap.get('id');
  	this.post=this.blogService.getPost(id);
  	//console.log(this.post);
  }

  save(b:NgForm):void{
     b.form.markAsPristine();
     this.blogService.updatePost(this.post);
  }

  delete():void{
  	this.blogService.deletePost(this.post.postid);
  	this.route.navigate(['/']);
  }

  preview():void{
  	 if(this.post) {this.blogService.updatePost(this.post);}
  	 this.route.navigate(['/preview',this.post.postid]);
  }

}
