const gulp            = require('gulp');
const rename          = require('gulp-rename');
const uglify          = require('gulp-uglify');
const sass            = require('gulp-sass');
const autoprefixer    = require('gulp-autoprefixer');
const plumber         = require('gulp-plumber');
const sourcemaps      = require('gulp-sourcemaps');
const colors          = require('ansi-colors');
const wait            = require('gulp-wait');
const notify          = require("gulp-notify");
const babel           = require("gulp-babel");
const concat          = require("gulp-concat");
const browserify      = require('browserify');
const babelify        = require('babelify');
const watchify        = require('watchify');
const buffer          = require('vinyl-buffer');
const source          = require('vinyl-source-stream');

function showError(err) {

    notify.onError({
        title: "Gulp error in " + err.plugin,
        message:  err.message
    })(err);

    console.log(colors.red(err.toString())  );
    this.emit('end');
}

function compile(watch) {
    var bundler = watchify(browserify('./src/js/app.js', {debug: true}).transform(babelify, {
        // Use all of the ES2015 spec
        presets: ["@babel/env"],
        sourceMaps: true
    }));

    function rebundle() {
        return bundler
            .bundle()
            .on('error', function (err) {
                console.error(err);
                this.emit('end');
            })
            .pipe(source('src/js/app.js'))
            .pipe(buffer())
            .pipe(rename('app.min.js'))
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('./dist/js'));
    }

    if (watch) {
        bundler.on('update', function () {
            console.log('-> bundling...');
            rebundle();
        });

        rebundle();
    } else {
        rebundle().pipe(exit());
    }
}

gulp.task('sass', function () {
    console.log('compiling css');
    return gulp.src('./src/sass/main.scss')
        .pipe(wait(500))
        .pipe(plumber({
            errorHandler : showError
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle : 'compressed'
        }))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'));
});

function watch() {
    return compile(true);
}

gulp.task('build', function () {
    return compile();
});
gulp.task('watch', function () {
    return watch();
});

gulp.task('watch', function () {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
    return watch();
    // gulp.watch('./js/*.js', ['js']);
});

gulp.task('default', function () {
    console.log(colors.bold(colors.yellow('----- rozpoczyam pracę ------')));
    gulp.start(['watch']);
});
