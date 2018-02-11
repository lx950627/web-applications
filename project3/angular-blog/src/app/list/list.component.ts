import { Component, OnInit } from '@angular/core';
import { Post, BlogService } from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {
  posts:Post[];
  constructor(private blogService: BlogService,
  	          private activatedRoute: ActivatedRoute,
  	          private route:Router
  	 ) {}

   getPosts():void {
  	this.posts=this.blogService.getPosts();
  }

   addPost():void{
   	 let newpost=this.blogService.newPost();
   	 let id=newpost.postid;
   	 this.route.navigate(["/edit",id]);
   }

    ngOnInit() { 
      this.activatedRoute.params.subscribe(() => this.getPosts());
      this.getPosts();
   }
}
