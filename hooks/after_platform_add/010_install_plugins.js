#!/usr/bin/env node
/*eslint-disable */

/**
 * Install all plugins listed in package.json
 * https://raw.githubusercontent.com/diegonetto/generator-ionic/master/templates/hooks/after_platform_add/install_plugins.js
 */
var exec = require('child_process').exec;
var packageJSON = require('../../package.json');

packageJSON.cordovaPlugins = packageJSON.cordovaPlugins || [];
packageJSON.cordovaPlugins.forEach(function (plugin) {
  exec('ionic plugin add ' + plugin, function (error, stdout) {
    console.log(stdout);
  });
});
