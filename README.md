# gulp-setting
gulp template for building a development environment and studying typescript

## package.json 파일
```json
  "devDependencies": {
    "@babel/core": "^7.17.10",
    "@babel/preset-env": "^7.17.10",
    "@babel/register": "^7.17.7",
    "@types/express": "^4.17.21",
    "@types/gulp": "^4.0.17",
    "@types/gulp-imagemin": "^8.0.5",
    "@types/gulp-nodemon": "^0.0.37",
    "@types/gulp-sass": "^5.0.4",
    "@types/sass": "^1.45.0",
    "babelify": "^10.0.0",
    "browser-sync": "^2.27.7",
    "browserify": "^17.0.0",
    "del": "^6.0.0",
    "express": "^4.18.2",
    "gulp": "^4.0.2",
    "gulp-autoprefixer": "^8.0.0",
    "gulp-bro": "^2.0.0",
    "gulp-csso": "^4.0.1",
    "gulp-ejs": "^5.1.0",
    "gulp-gh-pages": "^0.5.4",
    "gulp-imagemin": "^7.1.0",
    "gulp-nodemon": "^2.5.0",
    "gulp-sass": "^5.1.0",
    "gulp-typescript": "^6.0.0-alpha.1",
    "sass": "^1.51.0",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "tsify": "^5.0.4",
    "typescript": "^5.2.2",
    "uglifyify": "^5.0.2",
    "vinyl-source-stream": "^2.0.0"
  }
```
- ```"gulp-webserver": "^0.9.1",``` 삭제
- ```"gulp-imagemin": "^7.1.0",``` : gulp-imagemin은 7버전 사용

## gulpfile.ts 환경 세팅
- <a href="https://github.com/choihayeong/gulp-setting/wiki/Setting-gulpfile.ts">Wiki</a>
