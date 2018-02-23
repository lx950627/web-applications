var async = require('async');
var MongoClient = require('mongodb').MongoClient;
 
// Note: A production application should not expose database credentials in plain text.
// For strategies on handling credentials, visit 12factor: https://12factor.net/config.
//var PROD_URI = "mongodb://<dbuser>:<dbpassword>@<host1>:<port1>,<host2>:<port2>/<dbname>?replicaSet=<replicaSetName>";
var Blog_URI="mongodb://localhost:27017/BlogServer";
 
var databases = {
  blogServer: async.apply(MongoClient.connect, Blog_URI)
};
 
module.exports = function (cb) {
  async.parallel(databases, cb);
};