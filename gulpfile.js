let project_folder = "dist";
let source_folder = "src";

let fs = require("fs");

let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/**/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/*.{js,json}",
		img: source_folder + "/img/**/*.{jpg,jpeg,png,gif,ico,webp,svg}",
		fonts: source_folder + "/fonts/*.ttf",
		svg: source_folder + "/img/svg/*.svg",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,jpeg,png,gif,ico,webp,svg}",
		svg: source_folder + "/img/svg/*.svg",
	},
	clean: "./" + project_folder + "/",
};

// gulpScss = require('gulp-sass')(require('sass')); sass 5.0.0

let { src, dest } = (gulp = require("gulp")),
	gulpScss = require('gulp-sass')(require('sass')),
	gulpPlumber = require("gulp-plumber"),
	gulpAutoprefixer = require("gulp-autoprefixer"),
	cleanCss = require("gulp-clean-css"),
	gulpBabel = require("gulp-babel"),
	//gulpUglify = require("gulp-uglify"),
	uglify = require("gulp-uglify-es").default,
	delDist = require("del"),
	browserSync = require("browser-sync").create(),
	gulpRename = require("gulp-rename"),
	cssBeauty = require("gulp-cssbeautify"),
	groupMedia = require("gulp-group-css-media-queries"),
	gulpConcat = require("gulp-concat"),
	fileInclude = require("gulp-file-include"),
	ttf2woff = require("gulp-ttf2woff"),
	ttf2woff2 = require("gulp-ttf2woff2");

function html() {
	return src(path.src.html)
		.pipe(fileInclude())
		.pipe(dest(path.build.html))
		.pipe(browserSync.stream());
}

function css() {
	return src(path.src.css)
		.pipe(gulpPlumber())
		.pipe(gulpScss())
		.pipe(groupMedia())
		.pipe(
			cssBeauty({
				indent: "	",
			})
		)
		.pipe(
			gulpAutoprefixer({
				overrideBrowserslist: ["last 5 versions"],
				cascade: false,
			})
		)
		.pipe(dest(path.build.css))
		.pipe(cleanCss({ level: 2 }))
		.pipe(
			gulpRename({
				extname: ".min.css",
			})
		)
		.pipe(gulpPlumber.stop())
		.pipe(dest(path.build.css))
		.pipe(browserSync.stream());
}

function js() {
	return src(path.src.js)
		.pipe(fileInclude())
		.pipe(
			gulpBabel({
				presets: ["@babel/env"],
			})
		)
		.pipe(dest(path.build.js))
		.pipe(
			gulpRename({
				extname: ".min.js",
			})
		)
		.pipe(uglify())
		.pipe(dest(path.build.js))
		.pipe(browserSync.stream());
}

function libs() {
	return src([
			"node_modules/jquery/dist/jquery.js",
			"node_modules/swiper/swiper-bundle.js",
			//"node_modules/jquery-validation/dist/jquery.validate.js",
			//"node_modules/jquery-validation/dist/additional-methods.js",
			"node_modules/inputmask/dist/jquery.inputmask.js",
			// "node_modules/just-validate/dist/js/just-validate.js",
			"node_modules/leaflet/dist/leaflet.js",
			//"node_modules/magnific-popup/dist/jquery.magnific-popup.js",
			//"node_modules/fotorama/fotorama.js",
			//'node_modules/slick-carousel/slick/slick.js',
			//'node_modules/chart.js/dist/Chart.bundle.js',
			//'node_modules/nouislider/distribute/nouislider.js',
			//"node_modules/wnumb/wNumb.js",
			//'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
			//'node_modules/select2/dist/js/select2.min.js',
			//'node_modules/wowjs/dist/wow.min.js',
			//'node_modules/ion-rangeslider/js/ion.rangeSlider.min.js',
			//'node_modules/bootstrap/js/dist/modal.js'
			// 'node_modules/popper.js/dist/umd/popper.js',
			//'node_modules/bootstrap/dist/js/bootstrap.min.js',
			//'node_modules/typewriter-effect/dist/core.js',
		])
		.pipe(gulpConcat("vendors.js"))
		.pipe(uglify())
		.pipe(dest(path.build.js))
		.pipe(browserSync.stream());
}

function images() {
	return src(path.src.img)
		.pipe(dest(path.build.img))
		.pipe(browserSync.stream());
}

function serverInit() {
	browserSync.init({
		server: {
			baseDir: "./" + project_folder + "/",
		},
		port: 3000,
		notify: false,
	});
}

function fonts() {
	src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
	return src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
}

gulp.task("otf2ttf", function () {
	return src([source_folder + "/fonts/*.otf"])
		.pipe(
			fonter({
				formats: ["ttf"],
			})
		)
		.pipe(dest(source_folder + "/fonts/"));
});

function fontsStyle(params) {
	let file_content = fs.readFileSync(source_folder + "/scss/fonts.scss");
	if (file_content == "") {
		fs.writeFile(source_folder + "/scss/fonts.scss", "", cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split(".");
					fontname = fontname[0];

					if (c_fontname != fontname) {
						fs.appendFile(
							source_folder + "/scss/fonts.scss",
							'@include font("' +
								fontname +
								'", "' +
								fontname +
								'", "400", "normal");\r\n',
							cb
						);
					}
					c_fontname = fontname;
				}
			}
		});
	}
}

function cb() {}

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

function cleanDist() {
	return delDist(path.clean);
}


let build = gulp.series(cleanDist, gulp.parallel(html, css, js, libs, images, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, serverInit);

exports.fontsStyle = fontsStyle;
exports.libs = libs;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;

