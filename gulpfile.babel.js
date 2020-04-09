const gulp = require('gulp');
const less = require('gulp-less');

const lessStyle = () => {
    return gulp
        .src(['./es/**/*.less', './lib/**/*.less'])
        .pipe(less())
        .pipe(gulp.dest('./es'))
        .pipe(gulp.dest('./lib'))
};

const copyLess = () => {
    return gulp
        .src('./src/**/*.less')
        .pipe(gulp.dest('./es'))
        .pipe(gulp.dest('./lib'))
};

exports.css = gulp.series(copyLess, lessStyle);
