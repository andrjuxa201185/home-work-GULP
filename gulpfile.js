const gulp = require('gulp');
const uglify = require("gulp-uglify");
const minify = require('gulp-minify-css');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const shell = require('gulp-shell');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const watch = require('gulp-watch');
const runSequence = require('run-sequence');

const path = {
    src: {
        js: ["app/js/libs/*.js", "app/js/*.js"],
        css: ["app/css/*.css", "app/style/*.css"],
        html: "app/*.html",
        images: "app/images/**/*"
    },
    dist: {
        js: "dist/js/",
        css: "dist/css/",
        html: "dist/",
        images: 'dist/images/'
    }
}

gulp.task('js', function(){
    return gulp.src(path.src.js)
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest(path.dist.js))
    .pipe(reload({stream: true}))
})

gulp.task("css", function(){
    return gulp.src(path.src.css)
    .pipe(minify())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(path.dist.css))
    .pipe(reload({stream: true}))
})

gulp.task('html', function(){
    return gulp.src(path.src.html)
    .pipe(gulp.dest(path.dist.html))
    .pipe(reload({stream: true}))
})

gulp.task('images', function(){
    return gulp.src(path.src.images)
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ], {
        verbose: true
    }))
    .pipe(gulp.dest(path.dist.images))
})

gulp.task('clean', function(){
    return gulp.src("dist").pipe(clean());
})

gulp.task('build', shell.task([
    'gulp clean',
    'gulp images',
    'gulp html',
    'gulp css',
    'gulp js'
]))

gulp.task('browser-sync', function(){
    browserSync({
        startPath: '/',
        server: {
            baseDir: 'dist'
        },
        notify: false
    })
})

gulp.task('watch',function(){
    gulp.watch('app/index.html', ['html']);
    gulp.watch(path.src.css, ['css']);
    gulp.watch([path.src.js], ['js']);
})

gulp.task('server', function(){
    runSequence('build', 'browser-sync', 'watch');
})

gulp.task('default', ['server'])
