const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
	{
		title: "Testing",
		author: "Lola",
		url: "some_url1",
		likes: 15,
	},
	{
		title: "Second",
		author: "Lola",
		url: "some_url2",
		likes: 5,
	},
];

const blogsInDb = async () => {
	const blogs = await Blog.find({});
	return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map((user) => user.toJSON());
};

module.exports = { initialBlogs, blogsInDb, usersInDb };
