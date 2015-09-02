'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var jshintStylish = require('jshint-stylish');
var minifyCSS = require('gulp-minify-css');
var map = require('vinyl-map');
var template = require('gulp-template');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');

var templateSettings = {
    evaluate: /\/\*\:([\s\S]+?)\:\*\//g,
    interpolate: /\/\*\:=([\s\S]+?)\:\*\//g
};

gulp.task('dev', ['watch', 'build']);

gulp.task('watch', function () {

    gulp.watch([
        'src/**/*',
        '.jshintrc'
    ], [
        'build'
    ]);

});

gulp.task('build', ['clean'], function (done) {
    runSequence('lint', 'colrizr.js', 'minify', done);
});

gulp.task('clean', function (done) {
    (require('rimraf'))('./dist', done);
});

gulp.task('lint', function () {

    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(jshintStylish))
        .pipe(jshint.reporter('fail'));

});

gulp.task('colrizr.js', function (done) {

    var templateData = {};

    gulp.src('src/colrizr.css')
        .pipe(minifyCSS({
            cache: false,
            keepSpecialComments: 0,
            keepBreaks: false,
            compatibility: 'ie7'
        }))
        .pipe(map(function (contents, filename) {
            templateData.css = contents.toString().trim().replace(/\\/g, '\\\\').replace(/'/g, "\\'");
        }))
        .on('end', function () {

            gulp.src('src/colrizr.js')
                .pipe(template(templateData, templateSettings))
                .pipe(gulp.dest('dist/'))
                .on('end', done);

        });

});

gulp.task('minify', function () {

    return gulp.src('dist/*.js')
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest('dist'));

});


gulp.task('default', ['watch', 'build']);