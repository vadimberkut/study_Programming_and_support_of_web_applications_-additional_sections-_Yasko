'use strict';




var gulp = require('gulp');  // Base gulp package
var babelify = require('babelify'); // Used to convert ES6 & JSX to ES5
var browserify = require('browserify'); // Providers "require" support, CommonJS
var notify = require('gulp-notify'); // Provides notification to both the console and Growel
var rename = require('gulp-rename'); // Rename sources
var sourcemaps = require('gulp-sourcemaps'); // Provide external sourcemap files
var livereload = require('gulp-livereload'); // Livereload support for the browser
var gutil = require('gulp-util'); // Provides gulp utilities, including logging and beep
var chalk = require('chalk'); // Allows for coloring for logging
var source = require('vinyl-source-stream'); // Vinyl stream support
var buffer = require('vinyl-buffer'); // Vinyl stream support
var watchify = require('watchify'); // Watchify for source changes
var merge = require('utils-merge'); // Object merge tool
var duration = require('gulp-duration'); // Time aspects of your gulp process

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

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
 
gulp.task('watch_', function () {
  gulp.watch(['./app/*.html'], ['html']);
});
 
gulp.task('server', ['connect', 'watch_']);


// Configuration for Gulp
var config = {
  js: {
    src: './app/js/main.js',
    watch: './app/**/*.+(js|jsx)',
    outputDir: './app',
    outputFile: 'bundle.js'
  }
};

// Error reporting function
function mapError(err) {
  if (err.fileName) {
    // Regular error
    gutil.log(chalk.red(err.name)
        + ': ' + chalk.yellow(err.fileName.replace(__dirname + '/src/js/', ''))
        + ': ' + 'Line ' + chalk.magenta(err.lineNumber)
        + ' & ' + 'Column ' + chalk.magenta(err.columnNumber || err.column)
        + ': ' + chalk.blue(err.description));
  } else {
    // Browserify error..
    gutil.log(chalk.red(err.name)
        + ': '
        + chalk.yellow(err.message));
  }
}

// Completes the final file outputs
function bundle(bundler) {
  var bundleTimer = duration('Javascript bundle time');

  bundler
      .bundle()
      .on('error', mapError) // Map error reporting
      //.pipe(source('main.jsx')) // Set source name
      .pipe(source(config.js.src)) // Set source name
      .pipe(buffer()) // Convert to gulp pipeline
      .pipe(rename(config.js.outputFile)) // Rename the output file
      .pipe(sourcemaps.init({loadMaps: true})) // Extract the inline sourcemaps
      .pipe(sourcemaps.write('./app/map')) // Set folder for sourcemaps to output to
      .pipe(gulp.dest(config.js.outputDir)) // Set the output folder
      .pipe(notify({
        message: 'Generated file: <%= file.relative %>',
      })) // Output the file being created
      .pipe(bundleTimer) // Output time timing of the file creation
      .pipe(livereload()); // Reload the view in the browser
}

////SASS
//gulp.task('sass', function(){
//  return gulp.src('app/styles/sass/**/*.+(scss|sass)')
//      .pipe(sass())
//      .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
//      .pipe(gulp.dest('app/styles/css'));
//});

// Watch Task (Gulp task for build)
gulp.task('watch', function() {
  livereload.listen(); // Start livereload server

  //SCRIPTS
  var args = merge(watchify.args, { debug: true }); // Merge in default watchify args with browserify arguments

  var bundler = browserify(config.js.src, args) // Browserify
      .plugin(watchify, {ignoreWatch: ['**/node_modules/**', '**/bower_components/**']}) // Watchify to watch source file changes
      .transform(babelify, {presets: ['es2015', 'react']}); // Babel tranforms

  bundle(bundler); // Run the bundle the first time (required for Watchify to kick in)

  bundler.on('update', function() {
    bundle(bundler); // Re-run bundle on source updates
  });

  ////STYLES
  //gulp.watch('app/styles/sass/**/*.+(scss|sass)', ['sass']).on('change', livereload.changed);
});

// Default Task
gulp.task('default', ['watch']);