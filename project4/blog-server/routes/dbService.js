const assert=require('assert');
const MongoClient=require('mongodb').MongoClient;
const url='mongodb://localhost:27017';
const dbName='BlogServer';

let db;

module.exports.connectMongoDB= function(){
      MongoClient.connect(url,(err,client)=>{
      assert.equal(null,err);
      console.log("Connected successful to mongodb");
      db=client.db(dbName);
   });
}

module.exports.createPost = function(post,callback){
      db.collection("Posts").insertOne(post,(err,r)=>{
           callback(r);
      })
}


module.exports.updatePost = function(query,change,callback){
      db.collection("Posts").updateOne(query,{$set:change},(err,r)=>{
           assert.equal(null,err);
           callback(r);
      })
}

module.exports.deletePost = function(query,callback){
      db.collection("Posts").deleteOne(query,(err,r)=>{
           assert.equal(null,err);
           callback(r);
      })
}

module.exports.findPosts = function(query,callback) {
   let projecter={"postid":1,"title":1,"body":1,"created":1,"modified":1,"_id":0};
   db.collection("Posts").find(query).project(projecter).sort([['postid',1]]).toArray((err,docs)=>{
      assert.equal(err,null);
      callback(docs);

   });
};

module.exports.displayPosts = function(username,start,callback){
     let query={"username":username,"postid":{$gte:+start}};
     var cursor=db.collection("Posts").find(query).sort([['postid',1]]).limit(5);
     var cursornext=db.collection("Posts").find(query).sort([['postid',1]]).skip(5);

     cursornext.hasNext((err,p)=>{   
        cursor.toArray((err,docs)=>{
          assert.equal(err,null);
          callback(p,docs);
     });
        
     });  
};

module.exports.retrievePassword =function(username,callback){
     let query={'username':username};
     let projecter={"password":1,"_id":0};
     db.collection("Users").find(query).project(projecter).toArray((err,docs)=>{
          assert.equal(err,null);
          callback(docs);
     })
};