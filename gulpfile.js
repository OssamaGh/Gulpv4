//Project Code used in the asset directories
const projectCode = "LRS";

//scss OR sass?
const projectType = "scss";

//Directory
const directory = "./MY-DIRECTORY/" + projectCode;

//Asset Directories
const buildDir = directory + '/bundles';
const cssDir = directory + '/css/';
const projectTypeDir = directory + '/scss/';
const jsDir = directory + '/js/';

//Initialization of packages
var gulp = require('gulp');
var concat = require('gulp-concat');
var scss = require('gulp-sass');
var debug = require('gulp-debug');
var cleanCSS = require('gulp-clean-css');
var minify = require("gulp-minify");
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');


function compile() {
    return gulp
        .src(projectTypeDir + 'app.scss')
        .pipe(sourcemaps.init())
        .pipe(debug())
        .pipe(scss())
        .pipe(sourcemaps.write("./maps"))
        .pipe(gulp.dest(cssDir));
}

function minifyCSS() {
    return gulp.src(cssDir + "app.css")
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(cssDir));
}

function deleteCustomCSS() {
    return gulp.src(cssDir + 'app.min.css', {
            force: true
        })
        .pipe(clean());
}

function watchScss() {
    return gulp.watch(projectTypeDir + '**/*.' + projectType)
        .on('change', function (path) {
            console.log(path);
            compile();
        })
        .on('unlink', function (path) {
            console.log(path);
        });
}


//Clean Functions
function removeJS() {
    return del([
        buildDir + '/*.js'
    ]);
}

function removeCSS() {
    return del([
        buildDir + '/*.css'
    ]);
}


//Build Functions
function packJS(done) {
    done();
    return gulp
        .src([
            jsDir + "app.min.js",
            jsDir + "vendor/jquery.flexslider.js"
        ])
        .pipe(concat("app.bundle.js"))
        .pipe(minify({
            ext: {
                min: ".js"
            },
            noSource: true
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(buildDir));
}

function packCSS(done) {
    done();
    return gulp
        .src([
            cssDir + "app.css",
            cssDir + "vendor/fontawesome.css",
            cssDir + "vendor/flexslider.css"
        ])
        .pipe(concat("app.bundle.css"))
        .pipe(cleanCSS({
            compatibility: "ie8"
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(buildDir));
}

function done(done) {
    return done();
}


gulp.task(projectType, compile);
gulp.task('minify-css', minifyCSS);
gulp.task('delete-minified-css', deleteCustomCSS);
gulp.task('watch', watchScss);

gulp.task('clean-js', removeJS);
gulp.task('clean-css', removeCSS);

gulp.task('pack-js', gulp.series(removeJS, packJS));
gulp.task('pack-css', gulp.series(removeCSS, packCSS));

gulp.task('build', gulp.series('scss', 'pack-css', 'pack-js', done));