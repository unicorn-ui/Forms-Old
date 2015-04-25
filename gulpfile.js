var gulp            = require('gulp');
var exec            = require('child_process').exec;
var sass            = require('gulp-sass');
var watch           = require('gulp-watch');
var autoprefixer    = require('gulp-autoprefixer');
var mainBowerFiles  = require('main-bower-files');
var usemin          = require('gulp-usemin');
var minifyCSS       = require('gulp-minify-css');
var concat          = require('gulp-concat');
var webpack         = require('gulp-webpack');
var uglify          = require('gulp-uglify');
var rev             = require('gulp-rev');
var imageResize     = require('gulp-image-resize');
var connect         = require('gulp-connect');
var Q               = require('q');
var del             = require('del');
var rename          = require("gulp-rename");
var openPage        = require("gulp-open");
var bower           = require("bower");
var flatten         = require('gulp-flatten');


/**
*  CLEAN
*
*  Delete files and directories
*/

gulp.task('clean:css', function() {
  return Q.promise(function(resolve, error) {
    del(['css'], resolve);
  });
});


/**
*  MOVE JS FILES
*
*/
gulp.task('moveJSLibs', [], function(){
  var stream = gulp.src([
        'vendor/js/**/*.js'
      ])
      .pipe(flatten())
      .pipe(uglify())
      .pipe(gulp.dest('js'));

  return stream;
});

gulp.task('moveCSSLibs', ['clean:css'], function(){
  var stream = gulp.src([
      'vendor/css/**/*.css'
    ])
    .pipe(concat('vendor.min.css'))
    .pipe(minifyCSS({ noAdvanced: true }))
    .pipe(gulp.dest('css'));

  return stream;
});

/**
*  CSS PREPROCESSING
*
*  Sass, vender prefix, minify, move
*/
gulp.task('css', ['moveCSSLibs'], function() {
  var stream = gulp.src('scss/**/*.scss')
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(minifyCSS({ noAdvanced: true }))
      .pipe(gulp.dest('css'))
      .pipe(connect.reload());

  return stream;
});

/**
*  CONNECT SERVER
*
*  Loads the server locally and reloads when
*  connect.reload() is called.
*/

gulp.task('connect', function () {
  connect.server({
    //https://github.com/AveVlad/gulp-connect/issues/54
    root: [__dirname],
    port: 8000,
    livereload: true
  });
});


/**
*  WATCH
*
*  Watches files for compilation
*/

gulp.task('watch', function() {
  gulp.watch('scss/**/*.scss', ['css']);
});


/**
*  BUILD TASKS
*
*  Local and production build tasks
*/

gulp.task('default', ['moveJSLibs', 'connect', 'watch'], function() {
  var stream = gulp.src("./index.html")
      .pipe(openPage("", {
        app: "Google Chrome",
        url: "http://localhost:8000"
      }));
  return stream;
});


