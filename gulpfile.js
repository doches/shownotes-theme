var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var less = require('gulp-less');
var rename = require("gulp-rename");
var es = require('event-stream');
var runSequence = require('run-sequence');
var wiredep = require('wiredep').stream;
var fileinclude = require('gulp-file-include');

// Compile less into CSS
gulp.task('less', function () {
  return gulp.src(['./src/**/*.less'])
    .pipe(less({
      paths: [ './src/less/*.less' ]
    }))
    .pipe(rename({dirname: "."}))
    .pipe(gulp.dest('./dist/'))
    .pipe(reload({stream: true}));
});

gulp.task("images", function () {
  return gulp.src(["./src/img/*"])
  .pipe(rename({dirname: "."}))
  .pipe(gulp.dest('./dist/'))
  .pipe(reload({stream: true}));
})

gulp.task("fonts", function () {
  return gulp.src(["./src/fonts/*/*.woff", "./src/fonts/*/*.woff2", "./src/fonts/*/*.ttf", "./src/fonts/*/*.eot", "./src/fonts/*/*.svg"])
  .pipe(rename({dirname: "fonts/"}))
  .pipe(gulp.dest('./dist/'))
  .pipe(reload({stream: true}));
})

gulp.task('dev', ['build', 'serve-dev']);

gulp.task("dist", function(callback) {
  runSequence("build", callback);
});

gulp.task("build", function(callback) {
  runSequence(["less", "images", "fonts"], callback);
});

// Watch all source files for changes
gulp.task('serve-dev', function() {
  gulp.watch(['src/**/*.less'], ['less']);
  gulp.watch(['src/**/*'], ["images"]);

    // Reload browser-sync on change
  browserSync.init({
    server: {
      baseDir: ["./dist", "./bower_components", "./examples"]
    }
  });

  gulp.watch(['./dist/**/*', "examples/**/*"]).on('change', function(e) {
    console.log(e.type + ": " + e.path);
    reload();
  });
});
