var AWS  = require('aws-sdk')
var fs   = require('fs');
var mime = require('mime-types')
var path = require('path')
var config = require('./config.json')

AWS.config.loadFromPath(path.resolve(__dirname, 'config.json'));

function s3Upload(file, filename) {
    return new Promise(function(resolve, reject) {
        var s3 = new AWS.S3();
        var d = new Date();    
        
        const opts = {
            ACL: 'public-read',
            Body: file,
            Bucket: config.bucketName,
            Key: d.getFullYear() + '/' + (d.getMonth() + 1 ) + '/' + (d.getDate()) + '/' + d.getTime() +'-'+ filename,
            ContentType: mime.contentType(filename)
        };
        
        // putObject
        s3.upload(opts, function(err, data) {
            if (err) {
                return reject(err)
            } else {
                return resolve(data)
            }
        })
    
    })
}

module.exports = s3Upload;