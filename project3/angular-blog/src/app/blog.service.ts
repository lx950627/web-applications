import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { decode} from 'jsonwebtoken';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject} from 'rxjs/Subject';
import { catchError, map, tap } from 'rxjs/operators';

 const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export class Post{
	postid: number;
	created: Date;
	modified: Date;
	title: string;
	body: string;
}

@Injectable()
export class BlogService {
  private posts:Post[];
  private maxid:number;
  subject=new Subject();

  constructor(private http: HttpClient,
              private route:Router) {
    //console.log("service constructor");
  	 this.posts=[];
  	 this.fetchPosts();
    }


  fetchPosts():void{
     this.maxid=1;
     let token=document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1");
     //console.log(token);
     let username=null;
     if(token)
     {
       username = decode(token).usr;
     }
     const url=`/api/${username}`;
     //const url=`http://localhost:3000/api/cs144`;
     this.http.get<Post[]>(url).subscribe(posts=>
       {
        //console.log(posts);
        posts.forEach(post=>{
           if(post.postid > this.maxid){
             this.maxid=post.postid;
           }
           this.posts.push(post);
        })
        this.subject.next();
        this.maxid++;
     },
     err=>{
         window.location.href="http://localhost:3000/login";
       });

  }

  getPosts():Post[]{
  	var sortFn=((a:Post,b:Post)=>{return a.postid-b.postid});
  	this.posts.sort(sortFn);
  	return this.posts;
  }

  newPost(): Post{
  	 let id=this.maxid;
  	 this.maxid++;
  	 let post={'postid':id,'body':"",'title':"",
  	 'created':new Date(),'modified':new Date()};
  	 this.posts.push(post);
     
     let token=document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1");
     //console.log(token);
     let username=null;
     if(token){
       username = decode(token).usr;
     }
     const url=`/api/${username}/${id}`;
     //const url=`http://localhost:3000/api/cs144/${post.postid}`;
     
     //console.log(post.postid);
     this.http.post(url,post,httpOptions).subscribe(
        data => {},
        error => {
           if(error.status==401)
           {
             alert("There was an error creating a new post at the server");
             this.posts.splice(-1,1);
             this.route.navigate(['/']);
           }

        }
     )
     
  	 return post;
  }



  getPost(id:number):Post{
    //console.log("GET Post:"+id);
  	for (var i=0 ; i<this.posts.length; i++) 
  	  { 
         //console.log(this.posts[i].postid)
         if(this.posts[i].postid == id)
  	  	{
           return this.posts[i];
  	  	}
  	  }
  	  return null;


  }

  updatePost(post:Post):void{
  	  for (var i=0 ; i<this.posts.length; i++) 
  	  { 
          if(this.posts[i].postid == post.postid)
  	  	{
           post.modified=new Date();
           this.posts.splice(i,1,post);

            let token=document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1");
          //console.log(token);
             let username=null;
           if(token){
              username = decode(token).usr;
            }
            const url=`/api/${username}/${post.postid}`;
           //url="http://localhost:3000/api/cs144/"+post.postid;
           this.http.put(url,post,httpOptions).subscribe( 
           data  => {},
           error => {
             alert("There was an error updating the post at the server");
              this.route.navigate(['/edit',post.postid]);
           })

           break;
  	  	}
  	  }


  }

  deletePost(postid:number):void
  {
  	for (var i=0 ; i<this.posts.length; i++) 
  	  { 
         if(this.posts[i].postid == postid)
  	  	{
           this.posts.splice(i,1);

           let token=document.cookie.replace(/(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/, "$1");
           //console.log(token);
             let username=null;
             if(token){
              username = decode(token).usr;
              }
           const url=`/api/${username}/${postid}`;
           //const url=`http://localhost:3000/api/cs144/${postid}`;
           this.http.delete(url,httpOptions).subscribe( 
           data  => {},
           error => {
             alert("There was an error deleting the post at the server");
              this.route.navigate(['/']);
           })
           break;
  	  	}
  	  }  
  	  
  }

}


