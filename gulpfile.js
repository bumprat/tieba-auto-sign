var gulp = require('gulp');
var g = require('gulp-load-plugins')();
/*
gulp-util
gulp-concat
gulp-sass
gulp-minify-css
gulp-rename
gulp-debug
gulp-ng-annotate
gulp-rimraf
gulp-uglify
gulp-until
gulp-html-src
gulp-assets
gulp-add-src
gulp-if
gulp-match
gulp-notify
gulp-base
*/
var bower = require('bower');
var sh = require('shelljs');
var runSequence = require('run-sequence');
var chalk = require('chalk');
var wiredep = require('wiredep').stream;
var del = require('del');

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

gulp.task('default', ['debug']);

gulp.task('sass', function(done) {
  gulp.src(paths.sass + '/ionic.app.scss')
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
      ignorePath: '../',
      fileTypes: {
        html: {
          replace: {
            js: '<script src="./{{filePath}}"></script>',
            css: '<link rel="stylesheet" href="./{{filePath}}" />'
          }
        }
      }
    }))
    .pipe(gulp.dest(paths.temp));
});

gulp.task('clean-www', function() {
  del(paths.www + '/*');
  console.log(chalk.blue('www folder cleared'));

//  return gulp.src(paths.www + '/**/*', { read: false })
//    .pipe(g.rimraf())
//    .pipe(g.wait(3000))
//    .on('end', function() {
//    });  
});

gulp.task('useref', function() {
  var jsFilter = g.filter('**/*.js', 
    { restore: true, dot: true });
  var cssFilter = g.filter('**/*.css', 
    { restore: true, dot: true });
  return gulp.src(paths.html.bowermain)
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
});

gulp.task('useref:nomod', function() {
  var jsFilter = g.filter('**/*.js', 
    { restore: true, dot: true });
  var cssFilter = g.filter('**/*.css', 
    { restore: true, dot: true });
  return gulp.src(paths.html.bowermain)
    .pipe(g.useref.assets({
      //searchPath: [paths.temp, paths.src]
      noconcat: true
    }))
    .pipe(g.addSrc(paths.html.bowermain))
    .pipe(jsFilter)
    .pipe(g.ngAnnotate())
    .pipe(jsFilter.restore)
    .pipe(g.if('../bower_components/**/*', g.base('.')))
    .pipe(g.if('../src/**/*', g.base('./src')))
    .pipe(gulp.dest(paths.www))
    .on('end', function() {
      console.log(chalk.blue('js css files are added'));
    });
});

gulp.task('copy', ['copy:font'], function() {
  return gulp.src([paths.src + '/img/**',
    paths.src + '/templates/**/*.html'],
    { base: paths.src })
      .pipe(gulp.dest(paths.www));
});

gulp.task('copy:font', function() {
  return gulp.src(paths.bower + '/ionic/fonts/**')
      .pipe(gulp.dest(paths.www + '/fonts/'));
});

gulp.task('build', function() {
  runSequence('clean-www', 'sass', 'wiredep', 'useref', 'copy');
});

gulp.task('debug', function() {
  runSequence('clean-www', 'sass', 'wiredep', 'useref:nomod', 'copy')
});

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
