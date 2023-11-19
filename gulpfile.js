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
		files: project_folder + "/files/",
		favicon: project_folder + "/",
	},
	src: {
		html: [source_folder + "/*.html", "!" + source_folder + "/**/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/*.{js,json}",
		img: source_folder + "/img/**/*.{jpg,jpeg,png,gif,ico,webp,svg}",
		fonts: source_folder + "/fonts/*.ttf",
		svg: source_folder + "/img/svg/*.svg",
		files: source_folder + "/files/**/*.*",
		favicon: source_folder + "/*.{ico,png,xml,webmanifest,svg}",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.{jpg,jpeg,png,gif,ico,webp,svg}",
		svg: source_folder + "/img/svg/*.svg",
		files: source_folder + "/files/**/*.*",
		favicon: source_folder + "/*.{ico,png,xml,webmanifest,svg}",
	},
	clean: "./" + project_folder + "/",
};

// gulpScss = require('gulp-sass')(require('sass')); sass 5.0.0

let { src, dest } = (gulp = require("gulp")),
	gulpScss = require("gulp-sass")(require("sass")),
	// gulpPlumber = require("gulp-plumber"),
	// gulpAutoprefixer = require("gulp-autoprefixer"),
	cleanCSS = require("gulp-clean-css"),
	gulpBabel = require("gulp-babel"),
	//gulpUglify = require("gulp-uglify"),
	uglify = require("gulp-uglify-es").default,
	delDist = require("del"),
	browserSync = require("browser-sync").create(),
	gulpRename = require("gulp-rename"),
	// cssBeauty = require("gulp-cssbeautify"),
	// groupMedia = require("gulp-group-css-media-queries"),
	gulpConcat = require("gulp-concat"),
	fileInclude = require("gulp-file-include"),
	ttf2woff = require("gulp-ttf2woff"),
	ttf2woff2 = require("gulp-ttf2woff2"),
	newer = require("gulp-newer"),
	postcss = require("gulp-postcss"),
	// sortMediaQueries = require("sort-css-media-queries"),
	fonter = require("gulp-fonter");
versionNumber = require("gulp-version-number");

function html() {
	return src(path.src.html)
		.pipe(fileInclude())
		.pipe(
			versionNumber({
				value: "%DT%",
				append: {
					key: "_v",
					cover: 0,
					to: ["css", "js"],
				},
				output: {
					file: "version.json",
				},
			})
		)
		.pipe(dest(path.build.html))
		.pipe(browserSync.stream());
}

function css() {
	return (
		src(path.src.css)
			// .pipe(gulpPlumber())
			.pipe(gulpScss().on("error", gulpScss.logError))
			// .pipe(groupMedia())
			// .pipe(
			// 	cssBeauty({
			// 		indent: "	",
			// 	})
			// )
			.pipe(postcss())
			// .pipe(
			// 	gulpAutoprefixer({
			// 		grid: true,
			// 		overrideBrowserslist: ["last 3 versions"],
			// 		cascade: true,
			// 	})
			// )
			.pipe(dest(path.build.css))
			.pipe(
				cleanCSS({
					compatibility: "ie8",
					level: {
						1: {
							specialComments: "all",
							replaceZeroUnits: false,
							keepZeroUnits: true,
						},
						2: {
							mergeMedia: true,
							removeDuplicateFontRules: true,
							removeDuplicateMediaBlocks: true,
							removeDuplicateRules: true,
							removeEmpty: true,
							removeUnusedAtRules: false,
						},
					},
				})
			)
			.pipe(
				gulpRename({
					extname: ".min.css",
				})
			)
			// .pipe(gulpPlumber.stop())
			.pipe(dest(path.build.css))
			.pipe(browserSync.stream())
	);
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
		//"node_modules/inputmask/dist/jquery.inputmask.js",
		// "node_modules/just-validate/dist/js/just-validate.js",
		//"node_modules/leaflet/dist/leaflet.js",
		//"node_modules/magnific-popup/dist/jquery.magnific-popup.js",
		//"node_modules/fotorama/fotorama.js",
		//'node_modules/slick-carousel/slick/slick.js',
		//'node_modules/chart.js/dist/Chart.bundle.js',
		//'node_modules/nouislider/distribute/nouislider.js',
		//"node_modules/wnumb/wNumb.js",
		//'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
		//'node_modules/select2/dist/js/select2.min.js',
		// 'node_modules/wowjs/dist/wow.min.js',
		//'node_modules/ion-rangeslider/js/ion.rangeSlider.min.js',
		//'node_modules/bootstrap/js/dist/modal.js',
		// 'node_modules/@popperjs/core/dist/umd/popper.min.js',
		// 'node_modules/bootstrap/dist/js/bootstrap.min.js',
		//'node_modules/typewriter-effect/dist/core.js',
		//'node_modules/dropzone/dist/dropzone-min.js',
		// 'node_modules/smooth-scroll/dist/smooth-scroll.js'
		// 'node_modules/gsap/dist/gsap.js',
		// 'node_modules/gsap/dist/ScrollTrigger.js',
		// 'node_modules/gsap/dist/ScrollToPlugin.js'
	])
		.pipe(gulpConcat("vendors.js"))
		.pipe(uglify())
		.pipe(dest(path.build.js))
		.pipe(browserSync.stream());
}

function images() {
	return src(path.src.img).pipe(newer(path.build.img)).pipe(dest(path.build.img)).pipe(browserSync.stream());
}

function files() {
	return src(path.src.files).pipe(newer(path.build.files)).pipe(dest(path.build.files)).pipe(browserSync.stream());
}

// function favicon() {
// 	return src(path.src.favicon)
// 		.pipe(newer(path.build.favicon))
// 		.pipe(dest(path.build.favicon))
// 		.pipe(browserSync.stream());
// }

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

gulp.task("favicon", function () {
	return src(path.src.favicon).pipe(dest(path.build.favicon));
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
						fs.appendFile(source_folder + "/scss/fonts.scss", '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		});
	}
}

function newFontsStyle(params) {
	let fontsFile = source_folder + "/scss/_fonts.scss";

	fs.readdir(path.build.fonts, function (err, fontsFiles) {
		if (fontsFiles) {
			// перевіряємо чи є файл стилів для підключення шрифтів
			if (!fs.existsSync(fontsFile)) {
				// якщо немає, то створюємо його
				fs.writeFile(fontsFile, "", cb);
				let newFileOnly;
				for (var i = 0; i < fontsFiles.length; i++) {
					// записуємо підключення шрифтів у файл стилів
					let fontFileName = fontsFiles[i].split(".")[0];
					if (newFileOnly !== fontFileName) {
						let fontName = fontFileName.split("-")[0] ? fontFileName.split("-")[0] : fontFileName;
						let fontWeight = fontFileName.split("-")[1] ? fontFileName.split("-")[1] : fontFileName;
						if (fontWeight.toLowerCase() === "thin") {
							fontWeight = 100;
						} else if (fontWeight.toLowerCase() === "extralight") {
							fontWeight = 200;
						} else if (fontWeight.toLowerCase() === "light") {
							fontWeight = 300;
						} else if (fontWeight.toLowerCase() === "medium") {
							fontWeight = 500;
						} else if (fontWeight.toLowerCase() === "semibold") {
							fontWeight = 600;
						} else if (fontWeight.toLowerCase() === "bold") {
							fontWeight = 700;
						} else if (fontWeight.toLowerCase() === "extrabold" || fontWeight.toLowerCase() === "heavy") {
							fontWeight = 800;
						} else if (fontWeight.toLowerCase() === "black") {
							fontWeight = 900;
						} else {
							fontWeight = 400;
						}
						fs.appendFile(fontsFile, `@font-face {\n\tsrc: url("../fonts/${fontFileName}.woff2"), url("../fonts/${fontFileName}.woff");\n\tfont-family: "${fontName}";\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n\tfont-display: swap;\n}\r\n\n`, cb);
						newFileOnly = fontFileName;
					}
				}
			} else {
				console.log("Файл scss/_fonts.scss вже існує. Для оновлення необхідно його видалити!");
			}
		}
	});

	return gulp.src(`${path.src.css}`);
	function cb() {}
}

function cb() {}

function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
	gulp.watch([path.watch.files], files);
}

function cleanDist() {
	return delDist(path.clean);
}

let fontSeries = gulp.series(fonts, newFontsStyle);

let build = gulp.series(fontSeries, gulp.parallel(html, css, js, libs, images, files));

let watch = gulp.series(cleanDist, build, gulp.parallel(watchFiles, serverInit));

exports.fontsStyle = fontsStyle;
exports.newFontsStyle = newFontsStyle;
exports.libs = libs;
exports.fonts = fonts;
exports.images = images;
exports.files = files;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
// exports.watch = watch;
exports.default = watch;
