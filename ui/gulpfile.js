var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js');

gulp.task('jshint', function() {
  var reporter = jshint.reporter;

  return gulp.src(['app/scripts/**/*.js'])
    .pipe(jshint())
    .pipe(reporter('jshint-stylish'))
    .pipe(reporter('fail'));
});

gulp.task('lint', ['jshint']);

gulp.task('build', function(done) {
  webpack(webpackConfig, function(err, stats) {
    if (err) throw new gutil.PluginError('webpack', err);

    gutil.log('[build]', stats.toString());
    done();
  });
});

gulp.task('watch', ['build'], function() {
  gulp.watch([ 'app/scripts/**/*.js', 'app/styles/**/*.scss' ],  [ 'build' ]);
});

gulp.task('default', ['build']);
