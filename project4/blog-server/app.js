var express = require('express');
var app = express();
var path = require('path');


var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var commonmark =require('commonmark');
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var routes=require('./routes/index');
app.use('/', routes);

const MongoClient=require('mongodb').MongoClient;
const assert=require('assert');
const url='mongodb://localhost:27017';
const dbName='BlogServer';
let db;
MongoClient.connect(url,(err,client)=>{
      assert.equal(null,err);
      console.log("Connected successful to mongodb");
       db=client.db(dbName);
      //client.close();
});

app.get('/blog/:username/:postid',(req,res)=>{

  if(!req.params.postid.match(/[0-9]+/) || !req.params.username)
    {
      res.render('bad');
      res.status(400);
      res.end();
      return;

    }
  let query={'username':req.params.username,'postid':+req.params.postid};
  findPosts(db,query,(post)=>{
    if(!post || !post.length)
    {
      res.render('oneposterror',{'query':query});
      res.status(400);
      res.end();
      return;
    }
      post=post[0];
      var reader =new commonmark.Parser();
      var writer =new commonmark.HtmlRenderer();
      var parsed =reader.parse(post.body);
      post.body =writer.render(parsed);
      parsed =reader.parse(post.title);
      post.title =writer.render(parsed);
      post.username=req.params.username;
      post.postid =req.params.postid;
      res.render('onepost',{'post':post});
  })


});

app.get('/blog/:username?',(req,res)=>{ 
     let start=1;
     if(req.query && req.query.start)
     {
      start=req.query.start;
     }
     if(!req.params.username)
     {
      res.status(400);
      res.end();
      return;
     }

     displayPosts(db,req.params.username,start,(hasNext,posts)=>{
         console.log(hasNext);
         console.log(posts);
         if(!posts || !posts.length){
            res.send("Sorry, no matched post is found, or the user does not have any posts.");
            res.end();
            return;
         }
         posts.forEach((post)=>{
             var reader =new commonmark.Parser();
             var writer =new commonmark.HtmlRenderer();
             
             var parsed =reader.parse(post.body);
             post.body =writer.render(parsed);
             parsed =reader.parse(post.title);
             post.title =writer.render(parsed);
         });
         let start=posts[posts.length-1].postid+1;
         res.render("allposts",{'posts':posts,'start':start,'next':hasNext});
         res.end();
     })

    
});


app.get('/api/:username',(req,res)=>{
  let username=req.params.username;
  if(!username){
    res.status(400);
    res.end();
  }

  let query={'username':username};
  console.log(query);
   findPosts(db,query,(docs)=>{
       res.json(docs);
       res.status(200);
       res.end();
   })
});

app.get('/api/:username/:postid',(req,res)=>{
  let username=req.params.username;
  let id=req.params.postid;
  //let re=new RegExp()
  if(!id.match(/[0-9]+/) || !username)
  {
      res.status(400);
      res.end();
      return;
  }
  
  let query={'username':username,'postid':+id};
   findPosts(db,query,(docs)=>{
      if(docs.length==0)
      {
        res.status(404);
      }
      else
      {
        res.json(docs[0]);
        res.status(200);
      }
      res.end();
       
   })
});


app.post('/api/:username/:postid',(req,res)=>{
     
     if(!req.params.postid.match(/[0-9]+/) || !req.params.username || !req.body.title 
      || !req.body.body)
    {
      res.status(400);
      res.end();
      return;
    }
      let newpost={};
      newpost['username']=req.params.username;
      newpost['postid']=+req.params.postid;
      newpost['title']=req.body.title;
      newpost['body']=req.body.body;
      newpost['created']=new Date().getTime();
      newpost['modified']=new Date().getTime();

      let query={'username':req.params.username,'postid':+req.params.postid};
      findPosts(db,query,(docs)=>{
      if(docs.length>0)
      {
        res.status(400);
      }
      else
      {
          createPost(db,newpost,(r)=>{
           if(r.insertedCount==1){
            console.log("insert succeeds!");
            res.status(201);
           }
            else if(r.insertedCount==0){
          console.log("insert fails!");
            res.status(400);
          }
        })
      }
      res.end();
       
      })    
});

app.put('/api/:username/:postid',(req,res)=>{
  if(!req.params.postid.match(/[0-9]+/) || !req.params.username || !req.body.title 
      || !req.body.body)
    {
      res.status(400);
      res.end();
      return;
    }
      let username=req.params.username;
      let id=+req.params.postid;
      let title=req.body.title;
      let body=req.body.body;
      let query={'username':username,'postid':id};
      let change={'title':title,'body':body,'modified':new Date().getTime()};
      updatePost(db,query,change,(r)=>{
           if(r.modifiedCount==1){
            res.status(200);
           }
           else{
            res.status(400);
           }
           res.end();
      })
      
});

app.delete('/api/:username/:postid',(req,res)=>{
  if(!req.params.postid.match(/[0-9]+/) || !req.params.username)
    {
      res.status(400);
      res.end();
      return;
    }
      let username=req.params.username;
      let id=+req.params.postid;
      let query={'username':username,'postid':id};
      deletePost(db,query,(r)=>{
          if(r.deletedCount==1){
            console.log("Delete Succeeds!");
            res.status(204);
          }
          else{
            console.log(r);
            res.status(400);
          }
          res.end();
      })
      
});


const createPost = function(db,post,callback){
      db.collection("Posts").insertOne(post,(err,r)=>{
           assert.equal(null,err);
           callback(r);
      })
}


const updatePost = function(db,query,change,callback){
      console.log(query);
      db.collection("Posts").updateOne(query,{$set:change},(err,r)=>{
           assert.equal(null,err);
           callback(r);
      })
}

const deletePost = function(db,query,callback){
      console.log(query);
      db.collection("Posts").deleteOne(query,(err,r)=>{
           assert.equal(null,err);
           callback(r);
      })
}


const findPosts = function(db,query,callback) {
  // Get the documents collection
   //console.log(query);
   let projecter={"title":1,"body":1,"created":1,"modified":1,"_id":0};
   
   db.collection("Posts").find(query).project(projecter).sort([['postid',1]]).toArray((err,docs)=>{
      assert.equal(err,null);
      console.log(docs);
      callback(docs);

   });
};

const displayPosts = function(db,username,start,callback){
     let query={"username":username,"postid":{$gte:+start}};
     var cursor=db.collection("Posts").find(query).sort([['postid',1]]).limit(5);
     var cursornext=db.collection("Posts").find(query).sort([['postid',1]]).skip(5);

     cursornext.hasNext((err,p)=>{   
        cursor.toArray((err,docs)=>{
          assert.equal(err,null);
          //console.log(docs);
          callback(p,docs);
     });
        
     });
 
     
};


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); 





module.exports = app;
