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
  	 let post={'postid':id,'body':"",'title':"",
  	 'created':new Date(),'modified':new Date()};
  	 localStorage.setItem(id.toString(),JSON.stringify(post));
  	 localStorage.setItem("maxid",this.maxid.toString());
  	 this.posts.push(post);
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
  	  	   let lastpost=JSON.parse(localStorage[post.postid.toString()]);
           if(lastpost.body!=post.body || lastpost.title!=post.title)
           {
           	   post.modified=new Date();
           }
           localStorage[post.postid.toString()]=JSON.stringify(post);
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


