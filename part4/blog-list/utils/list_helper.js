const _ = require("lodash");

const totalLikes = (blogs) => {
	const reducer = (sum, item) => sum + item.likes;
	return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
	const reducer = (fav, blog) => {
		return fav.likes < blog.likes ? blog : fav;
	};
	return blogs.length === 0 ? undefined : blogs.reduce(reducer, { likes: 0 });
};

const mostBlogs = (blogs) => {
	const authorWithMostBlogs = _.chain(blogs)
		.countBy("author")
		.transform(
			(result, value, key) => {
				if (result.blogs < value) {
					result.author = key;
					result.blogs = value;
				}
				return result;
			},
			{ author: "", blogs: 0 }
		)
		.value();

	return authorWithMostBlogs;
};

const mostLikes = (blogs) => {
	const authorWithMostLikes = _.chain(blogs)
		.groupBy("author")
		.mapValues((value) => {
			return _.sumBy(value, "likes");
		})
		.transform(
			(result, value, key) => {
				if (result.likes < value) {
					result.author = key;
					result.likes = value;
				}
				return result;
			},
			{ author: "", likes: 0 }
		)
		.value();
	return authorWithMostLikes;
};

module.exports = {
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
