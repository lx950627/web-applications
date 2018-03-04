import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post, BlogService } from '../blog.service';
import { FormsModule,NgForm} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HostListener } from '@angular/core';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit{
  post:Post;
  @ViewChild('myForm') myForm:NgForm;

  constructor(private blogService:BlogService,
  	          private activatedRoute: ActivatedRoute,
  	          private route:Router) { 
  }

  ngOnInit() {
  	this.activatedRoute.params.subscribe(() => 
  	  {
  	  if(this.post && this.myForm.dirty){
        this.blogService.updatePost(this.post);
      }
  	  this.get();
  	  });

    this.blogService.subject.subscribe(()=>{
         this.get();
    })
  }

  @HostListener('window:unload')
    unloadHandler(event) {
      if(this.post) {this.blogService.updatePost(this.post);}
   }

  get():void{
  	let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!id.match(/[0-9]+/))
    {
       this.route.navigate(['/']);
    }
    let postid=+id;
    console.log(postid);

  	this.post=this.blogService.getPost(postid);
    console.log(this.post)
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
  	 if(this.post && this.myForm.dirty) {
       this.blogService.updatePost(this.post);
     }
  	 this.route.navigate(['/preview',this.post.postid]);
  }

}
