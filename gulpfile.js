const gulp          = require('gulp'),
      sass          = require('gulp-sass'),
      sourcemaps    = require('gulp-sourcemaps'),
      autoprefixer  = require('gulp-autoprefixer'),
      imagemin      = require('gulp-imagemin'),
      useref        = require('gulp-useref'),
      gulpif        = require('gulp-if'),
      uglify        = require('gulp-uglify'),
      babel         = require('gulp-babel'),
      uncss         = require('gulp-uncss'),
      cache         = require('gulp-cache'),
      del           = require('del'),
      runSequence   = require('run-sequence'),
      browserSync   = require('browser-sync').create();

gulp.task('css', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('uncss', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(uncss({
      html: ['dist/index.html']
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('useref', function(){
  return gulp.src('app/**/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', sourcemaps.init()))
    .pipe(gulpif('*.js', babel({presets: ["env"]})))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.js', sourcemaps.write('.')))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
});

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(jpg|jpeg|png|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function(){
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function(){
  return del.sync('dist');
});

gulp.task('clear:all', function(){
  return cache.clearAll();
});

gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
});

gulp.task('build', function(){
  runSequence('clean:dist', ['css', 'useref', 'images', 'fonts']);
});

gulp.task('watch', ['browserSync', 'css'], function(){
  gulp.watch('app/scss/**/*.scss', ['css']);
  gulp.watch('app/**/*.+(html|js)', ['copy']);
});
