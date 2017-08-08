/**
 * Created by xiao on 2017/7/25.
 */

'use strict';

// 载入Gulp模块
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');

// 注册样式压缩任务
gulp.task('style', function() {
  gulp.src('public/dist/css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(cssnano())
    .pipe(gulp.dest('public/themes/lanmai/css'));
});

// 注册脚本合并压缩任务
gulp.task('script', function() {
  gulp.src('public/dist/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/themes/lanmai/js'));
});

gulp.task('serve', ['style', 'script'], function() {
  gulp.watch('public/dist/css/*.css', ['style']);
  gulp.watch('public/dist/js/*.js', ['script']);
});
