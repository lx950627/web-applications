var express = require('express');
var jwt = require('jsonwebtoken');

module.exports = function(req,res,next){
    if(!req.cookies['jwt'] || !req.params.username)
    {
       res.status(401).redirect("/login?redirect=/edit/");
       res.end();
       return;
    }

    let secret='C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';
    jwt.verify(req.cookies['jwt'],secret,(err,decoded)=>{
        if(err || decoded.usr!=req.params.username){
          console.log(err);
          res.status(401).redirect("/login");
          res.end();
        }
        else{
          next();
        }
        
    })  
}