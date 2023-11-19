module.exports = {
	plugins: [
		require("postcss-nested"),
		require("postcss-sort-media-queries")({
			sort: "desktop-first",
		}),
		require("autoprefixer"),
	],
};
