var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var commonmark =require('commonmark');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const assert=require('assert');
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
let routes=require('./routes/index');
let dbService=require('./routes/dbService.js');
let auth=require('./routes/auth.js');
/*app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});*/
dbService.connectMongoDB();
app.use("/",routes);
app.use('/edit',auth,routes);

app.get('/blog/:username/:postid',(req,res)=>{
  if(!req.params.postid.match(/[0-9]+/) || !req.params.username)
    {
      res.render('bad');
      res.status(400);
      res.end();
      return;

    }
  let query={'username':req.params.username,'postid':+req.params.postid};
  dbService.findPosts(query,(post)=>{
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

     dbService.displayPosts(req.params.username,start,(hasNext,posts)=>{
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


app.get('/api/:username',auth,(req,res)=>{
  let username=req.params.username;
  if(!username){
    res.render('bad');
    res.status(400);
    res.end();
  }

  let query={'username':username};
  dbService.findPosts(query,(docs)=>{
       res.json(docs);
       res.status(200);
       res.end();
   })
});

app.get('/api/:username/:postid',auth,(req,res)=>{
  let username=req.params.username;
  let id=req.params.postid;
  if(!id.match(/[0-9]+/) || !username)
  {
      res.render('bad');
      res.status(400);
      res.end();
      return;
  }
  
  let query={'username':username,'postid':+id};
   dbService.findPosts(query,(docs)=>{
      if(docs.length==0)
      {
        res.render('oneposterror',{'query':query});
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

app.post('/api/:username/:postid',auth,(req,res)=>{
     
     if(!req.params.postid.match(/[0-9]+/) || !req.params.username || req.body.title==undefined 
      || req.body.body==undefined)
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

      dbService.createPost(newpost,(r)=>{
           if(!r){
              console.log("Duplicate!");
              res.status(400);
           }
           else if(r.insertedCount==1){
            console.log("insert succeeds!");
            res.status(201);
           }
            else if(r.insertedCount==0){
            console.log("insert fails!");
            res.status(400);
          }
           res.end();
        });
        
});

app.put('/api/:username/:postid',auth,(req,res)=>{
  if(!req.params.postid.match(/[0-9]+/) || !req.params.username || req.body.title==undefined
      || req.body.body==undefined)
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
      dbService.updatePost(query,change,(r)=>{
           if(r.modifiedCount==1){
            res.status(200);
           }
           else{
            res.status(400);
           }
           res.end();
      });
      
});

app.delete('/api/:username/:postid',auth,(req,res)=>{
  if(!req.params.postid.match(/[0-9]+/) || !req.params.username)
    {
      res.status(400);
      res.end();
      return;
    }
      let username=req.params.username;
      let id=+req.params.postid;
      let query={'username':username,'postid':id};
      dbService.deletePost(query,(r)=>{
          if(r.deletedCount==1){
            res.status(204);
          }
          else{
            console.log(r);
            res.status(400);
          }
          res.end();
      })
      
});

app.get('/login?',(req,res)=>{
      if(!req.query || !req.query.username || !req.query.password){
        res.render('login',{'re':req.query.redirect});
        res.end();
        return ;
      }
      dbService.retrievePassword(req.query.username,(docs)=>{
           if(!docs || !docs.length)
           {
             res.render('unregis');
             res.end();
             return;
           }
           
           bcrypt.compare(req.query.password,docs[0].password).then(match=>{
                 let redirect=req.query.redirect;
                  if(!redirect)
                  {
                       redirect="/edit";
                  }

                 if(match)
                 {
                  let secret='C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';
                  jwt.sign({'usr':req.query.username}, secret, { expiresIn: '2h' },(err,token)=>{
                          res.cookie('jwt',token);
                          res.redirect(redirect);
                  }); 
                   
                 }
                 else{
                    res.render('login',{'re':redirect});
                    res.end();
                    return ;
                 }           
           });
      });   
});

app.use(function(req, res) {
    res.render("invalid");
    res.end();
});

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
