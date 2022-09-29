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
    ghPages = require("gulp-gh-pages"),
    nodemon = require('gulp-nodemon'),
	browserSync = require('browser-sync').create();

const ROUTES = {
    HTML: {
        src: "./src/html/*",
        dest: "./build/html/",
        watch: "./src/html/**/*.html"
    },
    IMAGE: {
        src: "./src/assets/images/*",
        dest: "./build/assets/images/",
    },
    FONT: {
        src: "./src/assets/font/*",
        dest: "./build/assets/font/",
    },
    LIB: {
        src: "./src/assets/lib/*",
        dest: "./build/assets/lib/",
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

/* const webserver = () =>
    gulp.src(ROUTES.HTML.dest)
        .pipe(ws({path: "/", livereload: true, open: true})); */


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

const library = () => 
    gulp.src(ROUTES.LIB.src + '/*')
        .pipe(gulp.dest(ROUTES.LIB.dest));

const fonts = () => 
    gulp.src(ROUTES.FONT.src)
        .pipe(gulp.dest(ROUTES.FONT.dest));

const script = () => 
    gulp.src(ROUTES.SCRIPT.src)
        .pipe(bro({
            transform: [
                babelify.configure({ presets: ["@babel/preset-env"] }),
                ["uglifyify", { global: true } ]
            ]
        }))
        .pipe(gulp.dest(ROUTES.SCRIPT.dest));

const BrowserSync = () => {
    return new Promise(resolve => {
		browserSync.init({proxy: 'http://localhost:8005', port: 8006});
		resolve();
	});
}

const serverStart = () => {
    return new Promise(resolve => {
		nodemon({script: 'app.js', watch: 'app'});
		resolve();
	});
}

const gh = () => 
    gulp.src("build/**/*")
        .pipe(ghPages());

const watch = () => {
    gulp.watch(ROUTES.HTML.src + "*", gulpEJS);
    gulp.watch(ROUTES.FONT.src, fonts);
    gulp.watch(ROUTES.LIB.src, library);
    gulp.watch(ROUTES.SCSS.watch, style);
    gulp.watch(ROUTES.SCRIPT.watch, script);
}

const prepare = gulp.series([clean]);
const assets = gulp.parallel([html, image, style, library, fonts, script, gulpEJS]);
const live = gulp.parallel([watch, gulpEJS, BrowserSync, serverStart]);

module.exports = {
    "build": gulp.series([prepare, assets]),
    "dev": gulp.series([prepare, assets, live]),
    "deploy": gulp.series([prepare, assets, gh, clean]),
    "clean": gulp.series([prepare]),
}