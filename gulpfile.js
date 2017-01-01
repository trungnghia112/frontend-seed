const path = {
  base: './',
  html: './',
  temp: './.tmp',
  dist: './dist',
  coreThirdParty: './third_party',
  bower: 'bower_components',
  npm: 'node_modules'
};

const coreScripts = [
  path.bower + '/jquery/dist/jquery.min.js',
  path.bower + '/bootstrap-sass/assets/javascripts/bootstrap.min.js'
];

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync');
const del = require('del');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

//*** SASS compiler task
gulp.task('styles', () => {
  return gulp.src(path.base + '/scss/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write('.'))
    //.pipe(gulp.dest(path.temp + '/css'))
    .pipe(gulp.dest(path.base + '/css'))
    .pipe(reload({stream: true}));
});

//*** SCRIPTS compiler task
gulp.task('scripts', () => {
  return gulp.src(path.base + '/js/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(path.temp + '/js'))
    .pipe(reload({stream: true}));
});

//*** CORE SCRIPTS compiler task
gulp.task('coreScripts', () => {
  return gulp.src(coreScripts)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat('core.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(path.temp + '/third_party'))
    .pipe(reload({stream: true}));
});

//*** LINT compiler task
function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}
//*** Finding common mistakes in scripts
gulp.task('lint', () => {
  return lint(path.base + '/js/**/*.js', {
    fix: true
  })
    .pipe(gulp.dest(path.base + '/js'));
});

//*** CSS minify task
gulp.task('minify:css', ['styles'], () => {
  //return gulp.src([path.temp + '/css/*.css', '!' + path.temp + '/css/*.min.css'])
  return gulp.src([path.base + '/css/*.css', '!' + path.base + '/css/*.min.css'])
    .pipe($.cssnano({safe: true, autoprefixer: false}))
    .pipe($.rename('app.min.css'))
    .pipe(gulp.dest(path.dist));
});

//*** JS minify task
gulp.task('minify:js', ['scripts'], () => {
  return gulp.src([path.temp + '/js/*.js', '!' + path.temp + '/js/*.min.js'])
    .pipe($.uglify())
    .pipe($.rename('app.min.js'))
    .pipe(gulp.dest(path.dist));
});

//*** CORE JS minify task
gulp.task('minify:corejs', ['coreScripts'], () => {
  return gulp.src([path.temp + '/third_party/*.js', '!' + path.temp + '/third_party/*.min.js'])
    .pipe($.uglify())
    .pipe($.rename('core.min.js'))
    .pipe(gulp.dest(path.dist));
});

//*** IMAGES minify task
gulp.task('minify:images', () => {
  return gulp.src(path.base + '/images_temp/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest(path.base + '/images'));
});


//*** CSS & JS & CORE JS & IMAGES minify task
gulp.task('minify', ['minify:css', 'minify:js', 'minify:corejs', 'minify:images'], () => {
  return gulp.src(path.dist + '/**/*').pipe($.size({title: 'dist', gzip: false}));
});

//*** CLEAN compiler task
gulp.task('clean', del.bind(null, [path.temp, path.dist], {force: true}));

//*** WATCH compiler task
gulp.task("watch", () => {
  gulp.watch([
    path.html + '/*.html',
    path.dist + '/**/*',
    path.base + '/fonts/**/*',
    path.base + '/images/**/*'
  ]).on('change', reload);

  gulp.watch(path.base + '/scss/**/*.scss', ['minify:css']);
  gulp.watch(path.base + '/third_party/**/*.js', ['minify:corejs']);
  gulp.watch(path.base + '/js/**/*.js', ['minify:js']);
  gulp.watch(path.base + '/images_temp/**/*', ['minify:images']);
});

//*** SERVE compiler task
gulp.task('serve', ['minify', 'watch'], () => {
  browserSync({
    notify: true,
    port: 9000,
    server: {
      baseDir: [path.html, path.base]
    }
  });
});

//*** SERVE compiler task
gulp.task('serveLite', ['watch'], () => {
  browserSync({
    notify: true,
    port: 9000,
    server: {
      baseDir: [path.html, path.base]
    }
  });
});

//*** BUILD compiler task
gulp.task('build', ['lint', 'minify'], () => {
  return gulp.src(path.dist + '/**/*').pipe($.size({title: 'build', gzip: true}));
});

//*** DEFAULT compiler task
gulp.task('default', ['clean'], () => {
  gulp.start('build');
});



