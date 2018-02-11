import { Injectable } from '@angular/core';

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
  constructor() {
  	 this.posts=[];
  	 this.fetchPosts();
    }

  fetchPosts():void{
     for(let key in localStorage){
     	if(key==="maxid") continue;
     	let item=localStorage.getItem(key);
     	if(item){
     	 this.posts.push(JSON.parse(item));
     	}
     }
     this.maxid=localStorage["maxid"]? +localStorage["maxid"]:1;
     //console.log(this.maxid);
  }

  getPosts():Post[]{
  	var sortFn=((a:Post,b:Post)=>{return a.postid-b.postid});
  	this.posts.sort(sortFn);
  	return this.posts;
  }

  newPost(): Post{
  	 let id=this.maxid;
  	 this.maxid++;
  	 let post={'postid':id,'body':"this is body",'title':"this is title "+id.toString(),
  	 'created':new Date(),'modified':new Date()};
  	 let postsaved={'postid':id,'body':"this is body",'title':"this is title "+id.toString(),
  	 'created':new Date().toLocaleString(),'modified':new Date().toLocaleString()};
  	 localStorage.setItem(id.toString(),JSON.stringify(postsaved));
  	 localStorage.setItem("maxid",this.maxid.toString());
  	 let postretrived=localStorage.getItem(id.toString());
  	 this.posts.push(JSON.parse(postretrived));
  	 return post;
  }

  getPost(id:number):Post{
  	for (var i=0 ; i<this.posts.length; i++) 
  	  { 
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
           let spost=JSON.stringify(post);
           let p=JSON.parse(spost);
           p.modified=new Date().toLocaleString();
           //console.log(post);
           localStorage[post.postid.toString()]=JSON.stringify(p);
           this.posts.splice(i,1,post);
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
           localStorage.removeItem(postid.toString());
           this.posts.splice(i,1);
           break;
  	  	}
  	  }  
  	  
  }

}


