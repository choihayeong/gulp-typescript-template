const gulp = require("gulp"),
    del = require("del"),
    ws = require("gulp-webserver"),
    ejs = require("gulp-ejs"),
    imagemin = require("gulp-imagemin"),
    sass = require("gulp-sass")(require("sass")),
    autoprefixer = require("gulp-autoprefixer"),
    minCSS = require("gulp-csso"),
    bro = require("gulp-bro"),
    babelify = require("babelify"),
    ghPages = require("gulp-gh-pages");

const ROUTES = {
    HTML: {
        src: "./src/html/*",
        dest: "./build/",
        watch: "./src/html/**/*.html"
    },
    IMAGE: {
        src: "./src/assets/images/*",
        dest: "./build/assets/images/",
    },
    SCSS: {
        src: "./src/assets/scss/style.scss",
        dest: "./build/assets/css/",
        watch: "./src/assets/scss/**/*.scss",
    },
    SCRIPT: {
        src: "./src/assets/scripts/common.js",
        dest: "./build/assets/scripts/",
        watch: "./src/assets/scripts/**/*.js",
    }
};

const html = () => 
    gulp.src(ROUTES.HTML.src)
        .pipe(gulp.dest(ROUTES.HTML.dest));

const gulpEJS = () => 
    gulp.src(ROUTES.HTML.src)
        .pipe(ejs())
        .pipe(gulp.dest(ROUTES.HTML.dest));

const clean = () =>
    del(["build", ".publish"]);

const webserver = () =>
    gulp.src(ROUTES.HTML.dest)
        .pipe(ws({path: "/", livereload: true, open: true}));


// If you want to use imagemin version 8,
/* async function main() {
    const imagemin = (await import('imagemin')).default;
    const files = await imagemin([PATH.image], {
        destination: PATH_DEST.image,
        plugins: [imagemin]
    });
}
    
main(); */


const image = () => 
    gulp.src(ROUTES.IMAGE.src)
        .pipe(imagemin())
        .pipe(gulp.dest(ROUTES.IMAGE.dest));

const style = () => 
    gulp.src(ROUTES.SCSS.src)
        .pipe(sass().on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["last 2 versions"]
        }))
        .pipe(minCSS())
        .pipe(gulp.dest(ROUTES.SCSS.dest));

const script = () => 
    gulp.src(ROUTES.SCRIPT.src)
        .pipe(bro({
            transform: [
                babelify.configure({ presets: ["@babel/preset-env"] }),
                ["uglifyify", { global: true } ]
            ]
        }))
        .pipe(gulp.dest(ROUTES.SCRIPT.dest));

const gh = () => 
    gulp.src("build/**/*")
        .pipe(ghPages());

const watch = () => {
    gulp.watch(ROUTES.HTML.src + "*", gulpEJS);
    gulp.watch(ROUTES.IMAGE.src, image);
    gulp.watch(ROUTES.SCSS.watch, style);
    gulp.watch(ROUTES.SCRIPT.watch, script);
}

const prepare = gulp.series([clean]);
const assets = gulp.parallel([html, image, style, script, gulpEJS]);
const live = gulp.parallel([webserver, watch, gulpEJS]);

module.exports = {
    "build": gulp.series([prepare, assets]),
    "dev": gulp.series([prepare, assets, live]),
    "deploy": gulp.series([prepare, assets, gh, clean]),
    "clean": gulp.series([prepare]),
}