#!/usr/bin/env node

var config = require('./config.json')
var exec = require('child_process').exec

/**
 * Module dependencies.
 */

var program = require('commander');

program
   .command('upload <file>')
   .description('upload file')
   .action(function(file) {
        var cmd = 'curl -H "x-from: cli" -H "x-access-token: '+config.accessToken+'" -F "file=@'+file+'" '+config.EC2Public+':8000'

       exec(cmd, function(err, stdout, stderr) {
           if (err) {
               console.error(`error: ${stderr}`)
               return;
           }
           console.log(`${stdout}`)
       })
   })


program.parse(process.argv)