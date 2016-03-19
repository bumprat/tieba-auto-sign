var gulp = require('gulp');
var g = require('gulp-load-plugins')();
/*
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
*/
var bower = require('bower');
var sh = require('shelljs');
var runSequence = require('run-sequence');
var chalk = require('chalk');
var wiredep = require('wiredep').stream;

var paths = {
  sass: './src/scss',
  css: './src/css',
  html: {
    main: './src/index.html',
    bowermain: './.tmp/index.html',
    views: ['src/templates/**/*.html']
  },
  temp: './.tmp',
  bower: './bower_components',
  www: './www',
  src: './src'
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src(paths.sass + '/**/*.scss')
    .pipe(g.sass())
    .on('error', g.sass.logError)
    .pipe(g.rename({ basename: 'ionic.customized' }))
    .pipe(gulp.dest(paths.temp + '/css'))
    /*
    .pipe(g.minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(g.rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./.tmp/css/'))
    */
    .on('end', done);
});

gulp.task('wiredep', function() {
  return gulp.src(paths.html.main)
    .pipe(wiredep({
      devDependencies: true,
      ignorePath: '..'
    }))
    .pipe(gulp.dest(paths.temp));
})

gulp.task('clean-www', function() {
  gulp.src(paths.www + '/**/*', { read: false })
    .pipe(g.clean())
    .on('end', function() {
      console.log(chalk.blue('www folder cleared') 
        + vinyl.paths);
    })
})

gulp.task('useref', function() {
  var jsFilter = g.filter('**/*.js', 
    { restore: true, dot: true });
  var cssFilter = g.filter('**/*.css', 
    { restore: true, dot: true });
  gulp.src(paths.html.bowermain)
    .pipe(g.useref({
      //searchPath: [paths.temp, paths.src]
    }))
    .pipe(g.debug())
    .pipe(jsFilter)
    .pipe(g.debug())
    .pipe(g.ngAnnotate())
    .pipe(g.uglify())
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe(g.debug())
    .pipe(g.minifyCss({ cache: true }))
    .pipe(cssFilter.restore)
    .pipe(gulp.dest(paths.www))
    .on('end', function() {
      console.log(chalk.blue('js css files are built'));
    });
})

gulp.task('copy', ['copy:font'], function() {
  gulp.src([paths.src + '/img/**',
    paths.src + '/templates/**/*.html'],
    { base: paths.src })
      .pipe(gulp.dest(paths.www));
})

gulp.task('copy:font', function() {
  gulp.src(paths.bower + '/ionic/fonts/**')
      .pipe(gulp.dest(paths.www + '/fonts/'));
})


gulp.task('build', function() {
  runSequence('sass', 'wiredep', 'clean-www', 'useref', 'copy');
})

gulp.task('watch', function() {
  gulp.watch(paths.sass 
    + '/**/*.scss', function(vinyl) {
      runSequence('sass');
      console.log(chalk.blue('sass file changed: ') 
        + vinyl.paths);
  });
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      g.gutil.log('bower', g.gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + g.gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', g.gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + g.gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
