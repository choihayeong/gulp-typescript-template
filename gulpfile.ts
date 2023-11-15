import { dest, lastRun, parallel, series, src, watch } from "gulp";
import nodemon from "gulp-nodemon";
import ts from "gulp-typescript";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import imagemin from "gulp-imagemin";
import deleteAsync from "del";

const ejs = require("gulp-ejs");
const sass = gulpSass(dartSass);

const browserify = require("browserify");
const source = require("vinyl-source-stream");
const tsify = require("tsify");

const browserSync = require("browser-sync").create();

const tsProject = ts.createProject("tsconfig.json");
const tsConfig = tsProject.config;
const OUT_PATH = tsConfig.compilerOptions.outDir as string;
const TRANSPILE_PATH = tsConfig.include || "./src/**/*.ts";
const ASSETS_PATH = {
  HTML: {
    src: "./src/html/*",
    dest: "./build/html/",
  },
  SCSS: {
    src: "./src/assets/scss/style.scss",
    dest: "./build/assets/css/",
    watch: "./src/assets/scss/**/*.scss",
  },
  SCRIPT: {
    src: "./src/assets/scripts/common.ts",
    dest: "./assets/scripts/bundle.js",
    watch: "./src/assets/scripts/**/*.ts",
  },
  IMAGE: {
    src: "./src/assets/images/*",
    dest: "./build/assets/images/",
  }
}

const transpile = () => 
  src(TRANSPILE_PATH, {
    allowEmpty:  true,
    since: lastRun(transpile),
    sourcemaps: true,
  }).pipe(tsProject())
    .pipe(
      dest(OUT_PATH, {
        sourcemaps: ".",
      }),
    );

// browserify
const getBrowserScript = () => 
  browserify({
    basedir: ".",
    debug: true,
    entries: [ASSETS_PATH.SCRIPT.src],
    cache: {},
    packageCache: {},
  }).plugin(tsify)
  .bundle()
  .pipe(source(ASSETS_PATH.SCRIPT.dest))
  .pipe(dest("build"));

const html = () =>
  src(ASSETS_PATH.HTML.src)
    .pipe(dest(ASSETS_PATH.HTML.dest));

const gulpEJS = () =>
  src(ASSETS_PATH.HTML.src)
    .pipe(ejs())
    .pipe(dest(ASSETS_PATH.HTML.dest));

const style = () =>
  src(ASSETS_PATH.SCSS.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(dest(ASSETS_PATH.SCSS.dest));
    
// gulp-imagemin
const images = () => 
  src(ASSETS_PATH.IMAGE.src)
    .pipe(imagemin())
    .pipe(dest(ASSETS_PATH.IMAGE.dest));

const serverStart = () => {
  return new Promise<void>(resolve => {
    nodemon({
      // ext: "ts",
      script: "app.ts",
      watch: ["app"],
    });
    resolve();
  });
}

// browsersync
const BrowserSync = () => {
  return new Promise<void>(resolve => {
    browserSync.init({
      // server: {
      //   baseDir: "./"
      // },
      proxy: "http://localhost:3030"
    });
    resolve();
  });
}

// gulp : watch
const watching = () => {
  watch(TRANSPILE_PATH, transpile).on("change", browserSync.reload);
  watch(ASSETS_PATH.HTML.src + "*", gulpEJS).on("change", browserSync.reload);
  watch(ASSETS_PATH.SCSS.watch, style).on("change", browserSync.reload);
  watch(ASSETS_PATH.SCRIPT.watch, getBrowserScript).on("change", browserSync.reload);
}

// del (clean)
const clean = async() => await deleteAsync(["build"]);

const assets = parallel([html, gulpEJS, style, images, getBrowserScript]);
const liveServer = parallel([watching, gulpEJS, BrowserSync, serverStart]);

exports.default = series(transpile, parallel(liveServer, assets));
exports.build = series(clean, assets);
exports.clean = series(clean);
