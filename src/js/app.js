// new WOW({
// 	animateClass: "animate__animated",
// }).init();

// smooth scroll init
//var scroll = new SmoothScroll('[data-scroll]', {
//	speed: 500,
//	speedAsDuration: true
//});

// паралакс зображень при скролі
function parallaxImages() {
	let w_p = $(window).scrollTop() - 50;
	let w_h = $(window).height();
	if ($(".parallax-image").length) {
		$(".parallax-image").each(function () {
			let p_p = $(this).offset().top;
			let p_h = $(this).outerHeight();
			let y_bg_pos =
				(-(w_p + w_h / 2) + (p_p + 300 / 2)) * (300 / (w_h * 6)) + 50 + "%";
			$(this).animate(
				{ "background-position-x": "50%", "background-position-y": y_bg_pos },
				0
			);
		});
	}
}

// паралакс елементів при наприклад при ховері
function parallax() {
	let amountMovedX = (e.clientX * -0.3) / 8;
	let amountMovedY = (e.clientY * -0.3) / 8;
	$(this).css(
		"transform",
		"translate(" + amountMovedX + "px," + amountMovedY + "px)"
	);
}

// умови повинен у сладері встановлена опція watchSlidesProgress: true,
// доддає для всих слайдів які не мають клас swiper-slide-visible клас swiper-slide-invisible
// додати у налаштуваннях слайдера так
// on: {
//			"init slideChange": addInvisibleSlidesClass,
//		},

const addInvisibleSlidesClass = function () {
	let idx = this.activeIndex;
	let s = this.slides;

	s.forEach((el) => {
		if (!el.classList.contains("swiper-slide-visible")) {
			el.classList.add("swiper-slide-invisible");
		} else {
			el.classList.remove("swiper-slide-invisible");
		}
	});
};

// умови повинен у сладері встановлена опція watchSlidesProgress: true,
// дана функція - додає клас swiper-slide-invisible для 1-го слайду перед і після видимого слайда який містить клас swiper-slide-visible

let addInvisibleSlidesClass2 = function () {
	let t = this.slides.filter(function (el) {
			return !el.classList.contains("swiper-slide-visible");
		}),
		i = this.activeIndex,
		n = this.slides.filter(function (el) {
			return el.classList.contains("swiper-slide-invisible");
		});

	n.forEach(function (el) {
		el.classList.remove("swiper-slide-invisible");
	});
	let r = t[i - 1],
		s = t[i];
	null == r || r.classList.add("swiper-slide-invisible"),
		null == s || s.classList.add("swiper-slide-invisible");
};


$(document).ready(function () {
	// ===================================================
	// faq accordeon
	$(".block__title--faq").click(function () {
		$(".block__faq-content").not($(this).next()).slideUp();
		$(".block__faq-item").not($(this).parent()).removeClass("active");
		$(this).parent().toggleClass("active");
		$(this).next().slideToggle();
	});
});

$(document).scroll(function () {});

$(window).on("load", function () {
	$('.preloader').remove();

})
