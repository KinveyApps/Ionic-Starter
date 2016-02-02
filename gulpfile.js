/* eslint-disable */
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var rimraf = require('rimraf');

var paths = {
  src: ['./src/**/*.js'],
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['build', 'sass']);

gulp.task('clean', function(done) {
  rimraf('./www/js/', done);
});

function bundle() {
  return browserify('./src/app.js')
    .transform(babelify, { presets: ['es2015', 'stage-2'] })
    .bundle()
    .pipe(plumber())
    .on('error', function(err) { gutil.log('Error: ' + err.message); })
    .pipe(source('app.js'))
    .pipe(gulp.dest('./www/js/'));
}

gulp.task('build', ['clean'], function() {
  return bundle();
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('compile', ['build', 'sass']);

gulp.task('watch', function() {
  gulp.watch(paths.src, ['build']);
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
