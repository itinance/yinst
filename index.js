#!/usr/bin/env node
var co = require('co');
var cli = require('commander');
var fs = require('fs');
var shell = require('shelljs');

function * exec(cmd, verbose) {
    if(verbose) console.log("\nCMD " + cmd);
    var ret = shell.exec(cmd).output;
    
    if(ret !== 0 && ret !== undefined) {
        console.log("ERROR: there is an error occured: ", ret);
        process.exit();
    }
    return ret;
}

cli.arguments('<file>')
  .option('-a, --android', 'Compile for android')
  // .option('-i, --ios', 'Compile for iOS')
  .option('-v, --verbose', 'Be more verbose')
  .action(function(file) {
      verbose = cli.verbose
      
      co(function *() {
        var cmd = 'yarn add ' + file;
        yield exec(cmd, verbose);
        
        cmd = 'react-native link ' + file;
        yield exec(cmd, verbose);

        if(cli.android) {
            cmd = 'cd android && ./gradlew assembleDebug';
            yield exec(cmd, verbose);
            yield exec('pwd')
        }
    })
  })
  .parse(process.argv);

