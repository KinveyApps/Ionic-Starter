/*eslint-disable */

'use strict';

var prompt = require('prompt');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var configFile = path.join(__dirname, 'src/modules/config.js');

console.log(chalk.cyan('This utility will walk you through setting up the Kinvey Ionic Starter App.'));
console.log(chalk.cyan('Please refer to http://devcenter.kinvey.com/phonegap for more information. Defaults are shown next to the question.'))
console.log(chalk.cyan('Press ^C at any time to quite.'));
console.log('');

// Customize the prompt
prompt.message = '';
prompt.delimiter = '';

// Start the prompt
prompt.start();

// Get appKey, appSecret, and redirectUri
prompt.get({
  properties: {
    appKey: {
      description: 'What is your app key?',
      required: true
    },
    appSecret: {
      description: 'What is your app secret?',
      required: true
    },
    apiHostname: {
      description: 'What is the API hostname?',
      default: 'https://baas.kinvey.com'
    }
  }
}, function(err, result) {
  if (err) {
    console.log(chalk.red(err));
    return;
  }

  var configFileData = '' +
    'const module = angular.module(\'config\', []);\n' +
    'module.constant(\'KinveyConfig\', {\n' +
    '  appKey: \'' + result.appKey + '\',\n' +
    '  appSecret: \'' + result.appSecret + '\',\n' +
    '  apiHostName: \'' + result.apiHostname + '\'\n' +
    '});\n';

  // Write config file
  fs.writeFile(configFile, configFileData, function(err) {
    if (err) {
      console.log(chalk.red(err));
      return;
    }

    var setup = spawn('./setup.sh');

    setup.stdout.on('data', function(data) {
      console.log(data.toString());
    });

    setup.stderr.on('data', function(data) {
      console.log(chalk.red(data));
    });

    setup.on('close', function(code) {
      console.log('Done. Start the application by running `ionic run ios --device` or `ionic run android --device`.');
    });
  });
});
