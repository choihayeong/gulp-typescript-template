import { dest, lastRun, parallel, series, src, watch } from "gulp";
import nodemon from "gulp-nodemon";
import ts from "gulp-typescript";
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import imagemin from 'gulp-imagemin';
import deleteAsync from 'del';

const ejs = require("gulp-ejs");
const sass = gulpSass(dartSass);
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
    dest: "./build/assets/scripts/",
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

const scripts = () => 
  src(ASSETS_PATH.SCRIPT.src, {
    allowEmpty:  true,
    since: lastRun(scripts),
    sourcemaps: true,
  }).pipe(tsProject())
    .pipe(
      dest(ASSETS_PATH.SCRIPT.dest, {
        sourcemaps: ".",
      }),
    );
    
// const images = () => 
//   src(ASSETS_PATH.IMAGE.src)
//     .pipe(imagemin())
//     .pipe(dest(ASSETS_PATH.IMAGE.dest));

// gulp에 내장된 watch
const watching = () => {
  const watcher = watch(TRANSPILE_PATH, transpile);
  watch(ASSETS_PATH.HTML.src + "*", gulpEJS);
  watch(ASSETS_PATH.SCSS.watch, style);

  /* watcher.on("change", (path) => {
    // 파일 변경 이벤트
    console.log(`File ${path} was changed`);
  });

  watcher.on("add", (path) => {
    // 파일 추가 이벤트
    console.log(`File ${path} was added`);
  });

  watcher.on("unlink", (path) => {
    // 파일 삭제 이벤트
    console.log(`File ${path} was removed`);
  }); */
}

const clean = async() => await deleteAsync(["build"]);

const start = () => {
  nodemon({
    delay: 500,
    ext: "ts",
    script: OUT_PATH,
    watch: ["src"],
  });
}

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

// nodemon을 이용한 watch
/* const start = () => {
  const nodemonStream = nodemon({
    delay: 500,
    ext: "ts",
    script: OUT_PATH,
    watch: ["src"],
  });

  nodemonStream.on("restart", () => {
    console.log("Restart event nodemon");

    transpile();
  })
} */

// export default series(transpile, parallel(watching, html, gulpEJS, start));
exports.default = series(transpile, parallel(watching, html, gulpEJS, style, scripts, serverStart, BrowserSync));
exports.clean = series(clean);
