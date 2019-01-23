const gulp = require('gulp');
const sass = require('gulp-sass');
const connect = require('gulp-connect');
const babel = require('gulp-babel');


gulp.task('html', function () {
  return gulp.src('./dev/*.html')
    .pipe(gulp.dest('./public'))
    .pipe(connect.reload());
});

gulp.task('html:watch', function (resolve) {
  
  return new Promise(function(resolve) {
    gulp.watch('./dev/index.html', gulp.series('html'));
    resolve();
  });
});

gulp.task('sass', function () {
  return gulp.src('./dev/scss/style.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public'))
    .pipe(connect.reload());
});

gulp.task('sass:watch', function (resolve) {
  return new Promise(function() {
    gulp.watch('./dev/scss/style.scss', gulp.series('sass'));
    resolve();
  });
});

gulp.task('js', function() {
  return gulp.src('dev/index.js')
		.pipe(babel())
    .pipe(gulp.dest('./public'))
    .pipe(connect.reload());
}
);

gulp.task('js:watch', function (resolve) {
  return new Promise(function() {
    gulp.watch('./dev/index.js', gulp.series('js'));
    resolve();
  });
});

gulp.task('connectServer', function() {
  return new Promise(function(resolve) {
    connect.server({
      root: './public/',
      livereload: true
    });
    resolve();
  });
});


gulp.task('dev', gulp.parallel( 'html:watch', 'sass:watch', 'js:watch', 'connectServer' ));
