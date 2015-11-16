'use strict';

var prompt = require('prompt');
var chalk = require('chalk');
var fs = require('fs');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var async = require('async');
var inquirer = require('inquirer');
var path = require('path');
var spawn = require('child_process').spawn;
var bower = require('bower');
var configFile = path.join(__dirname, 'src/modules/config.js');

console.log(chalk.cyan('This utility will walk you through setting up the Kinvey Ionic Starter App.'));
console.log(chalk.cyan('Please refer to http://devcenter.kinvey.com/phonegap for more information. Defaults are shown next to the question.'));
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
      required: true,
    },
    appSecret: {
      description: 'What is your app secret?',
      required: true,
    },
    apiHostname: {
      description: 'What is the API hostname?',
      default: 'https://baas.kinvey.com',
    },
  },
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

    async.parallel([
      function(callback) {
        console.log('Removing plugins directory...\n');
        rimraf(__dirname + '/plugins', callback);
      },
      function(callback) {
        console.log('Removing platforms directory...\n');
        rimraf(__dirname + '/platforms', callback);
      },
    ], function(err, results) {
      if (err) {
        console.log(chalk.red(err));
        return;
      }

      async.parallel([
        function(callback) {
          console.log('Creating plugins directory...\n');
          mkdirp(__dirname + '/plugins', callback);
        },
        function(callback) {
          console.log('Creating platforms directory...\n');
          mkdirp(__dirname + '/platforms', callback);
        },
      ], function(err, results) {
        if (err) {
          console.log(chalk.red(err));
          return;
        }

        async.parallel([
          function(callback) {
            console.log('Installing Bower components...\n');
            bower.commands.install(null, { save: true }, { interactive: true })
            .on('prompt', function(prompts, callback) {
              inquirer.prompt(prompts, callback);
            })
            .on('end', function(installed) {
              callback(null, installed);
            })
            .on('error', function(err) {
              callback(err);
            });
          },
          function(callback) {
            console.log('Setting up Ionic...\n');
            var setup = spawn('./node_modules/.bin/ionic', ['state', 'reset']);

            setup.stdout.on('data', function(data) {
              console.log(data.toString());
            });

            setup.stderr.on('data', function(data) {
              callback(data);
            });

            setup.on('close', function(code) {
              callback();
            });
          },
        ], function(err, results) {
          if (err) {
            console.log(chalk.red(err));
            return;
          }

          console.log('Project is all setup. Start project but executing npm start.');
        });
      });
    });
  });
});
