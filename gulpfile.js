var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cssnano = require('gulp-cssnano');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

// Задача с названием 'default' запускается автоматически по команде 'gulp' в консоле.
// Эта конструкция работает синхронно, сначала выполняется задача 'clean' и только после 
// ее завершнения запускается 'dev'.
gulp.task('default', ['clean'], function() {
	gulp.run('dev');
});

// Задача 'dev' представляется собой сборку в режиме разработки.
// Запускает build - сборку, watcher - слежку за файлами и browser-sync.
gulp.task('dev', ['build', 'watch', 'browser-sync']);

// Задача 'build' представляет собой сборку в режиме продакшен.
// Собирает проект.
gulp.task('build', ['html', 'styles', 'libs', 'assets']);

// Задача 'watch' следит за всеми нашими файлами в проекте и при изменении тех или иных 
// перезапустает соответсвующую задачу.
gulp.task('watch', function() {
	gulp.watch('src/scss/**/*.scss', ['styles']); //стили
    gulp.watch(['src/index.html'], ['html']); // html
    gulp.watch('./src/assets/**/*.*', ['assets']); // локальные файлы(картинки, шрифты)
    gulp.watch('src/**/*.*').on('change', browserSync.reload); // перезапуск browserSynс
});

// Задача 'styles' выполняет сборку стилей.
gulp.task('styles', function() {
	return gulp.src([ 'bower-components/bootstrap/dist/css/bootstrap.css',
					  'src/scss/**/**/*.scss'
					])
		.pipe(plumber({ // plumber - плагин для отловли ошибок.
			errorHandler: notify.onError(function(err) { // nofity - представление ошибок в удобном виде.
				return {
					title: 'Styles',
					message: err.message
				}
			})
		}))
		.pipe(sourcemaps.init()) //История изменения стилей, которая помогает при отладке в devTools.
			.pipe(sass()) //Компиляция sass.
			.pipe(concat('main.css')) //Соедbние всех файлом стилей в один и задание ему названия 'main.css'.
			.pipe(cssnano()) //Минификация стилей
		.pipe(sourcemaps.write())
		.pipe(rename('build.css')) //Переименование
		.pipe(gulp.dest('build/css'));
});

//Задача для удаление папки build.
gulp.task('clean', function() {
	return gulp.src('build/')
		.pipe(clean());
})

gulp.task('html', function() {
	gulp.src('src/*.html')
		.pipe(gulp.dest('build/'));
});

gulp.task('libs', function() {
	gulp.src([
			  'bower-components/jquery/dist/jquery.min.js', 
			  'bower-components/bootstrap/dist/js/bootstrap.min.js'
			  ])
		.pipe(gulp.dest('build/libs'));
});

//Задача для запуска сервера.
gulp.task('browser-sync', function() {
	return browserSync.init({
		server: {
			baseDir: './build/'
		}
	});
});

//Перемещение локальных файлов в папку build
gulp.task('assets', function() {
	return gulp.src('./src/assets/**/*.*')
		.pipe(gulp.dest('./build/assets'));
});