'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
// var webserver = require('gulp-webserver');
 
// gulp.task('webserver', function() {
//   gulp.src('app')
//     .pipe(webserver({
//       livereload: true,
//       directoryListing: true,
//       //open: true,
//       open: 'index.html',
//       fallback: 'app/index.html'
//     }));
// });

// gulp.task('connect', function() {
//   connect.server({
//     root: 'app',
//     port: 8080, 
//     //open: { browser: 'chrome' }
//   });
// });
 
// gulp.task('default', ['connect']);

//WITH LIVE RELOAD
gulp.task('connect', function() {
  connect.server({
    root: 'app',
    port: 8080, 
    livereload: true
  });
});
 
gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});
 
gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
});
 
gulp.task('default', ['connect', 'watch']);