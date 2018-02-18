import { Component, OnInit } from '@angular/core';
import { Parser, HtmlRenderer} from 'commonmark';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Post, BlogService } from '../blog.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  body:string;
  title:string;
  post:Post;
  constructor(private blogService:BlogService,
  	          private activatedRoute: ActivatedRoute,
  	          private route:Router) { }

  ngOnInit() {
  	this.activatedRoute.params.subscribe(() => this.displayContent());
  	}
  

  displayContent():void{
  	  const id = +this.activatedRoute.snapshot.paramMap.get('id');
  	  this.post=this.blogService.getPost(id);
  	 // console.log(this.post);
      if(this.post)
      {
       let reader=new Parser();
       let writer=new HtmlRenderer();
       this.body=writer.render(reader.parse(this.post.body));
       this.title=writer.render(reader.parse(this.post.title));
      }
  	  
  }


}
