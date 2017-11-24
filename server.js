var http = require('http'),
path     = require('path'),
os       = require('os'),
fs       = require('fs'),
config   = require('./config.json'),
s3Upload = require('./s3'),
Busboy   = require('busboy');

let cdnUrl = config.cloudFront;

http.createServer(function(req, res) {
    if (req.method === 'POST' && req.headers['x-access-token'] === config.accessToken) {
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            s3Upload(file, filename)
            .then(function(data) {
                let location = ''
                if (cdnUrl) {
                    location = data.Location.replace('https://'+config.bucketName+'.s3.ap-northeast-1.amazonaws.com', cdnUrl)                    
                } else {
                    location = data.Location
                }

                res.writeHead(200, {'Content-Type': 'application/json'})                ;

                if (req.headers['x-from'] === 'cli') {
                    res.end(location, 'utf-8')   
                } else {
                    let obj = {
                        location: location
                    };
                    
                    res.end(JSON.stringify(obj), 'utf-8');
                }
            })
            .catch(function(err) {
                console.error(err, err.stack)
            })
        });
        req.pipe(busboy);
    } else {
        res.statusCode = 401;
        res.end('not auth');
    }
}).listen(8000, function() {
    console.log('Listening for requests');
});