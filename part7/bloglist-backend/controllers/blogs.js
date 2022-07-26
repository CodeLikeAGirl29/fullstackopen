const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();

const Blog = require("../models/blog.js");
const Comment = require("../models/comment.js");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({})
		.populate("user", { username: 1, name: 1 })
		.populate("comments", { title: 1, date: 1 });
	response.json(blogs);
});

blogsRouter.get("/:id", async (request, response) => {
	const blog = await Blog.findById(request.params.id);
	if (blog) response.json(blog.toJSON());
	else response.status(404).end();
});

blogsRouter.post("/", async (request, response) => {
	if (!request.user) {
		return response.status(401).json({ error: "token missing or invalid" });
	}
	const user = request.user;
	const blog = new Blog({
		...request.body,
		user: user._id,
	});
	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
	const blog = request.body;
	const blogToUpdate = await Blog.findById(request.params.id);
	if (!blogToUpdate) {
		response.status(404).end();
	} else {
		const data = {
			title: blog.title,
			url: blog.url,
			likes: blog.likes,
			author: blog.author,
			user: blog.user.id,
		};
		const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, data, {
			new: true,
		});
		response.json(updatedBlog);
	}
});

blogsRouter.delete("/:id", async (request, response) => {
	const blogToDelete = await Blog.findById(request.params.id);
	if (!blogToDelete) {
		response.status(404).end();
	} else {
		await Blog.findByIdAndRemove(request.params.id);
		response.status(204).end();
	}
});

blogsRouter.post("/:id/comments", async (request, response) => {
	if (!request.user) {
		return response.status(401).json({ error: "token missing or invalid" });
	}
	const blogToUpdate = await Blog.findById(request.params.id);
	const comment = new Comment({
		...request.body,
		date: new Date(),
		blog: blogToUpdate._id,
	});

	const savedComment = await comment.save();
	blogToUpdate.comments = blogToUpdate.comments.concat(savedComment._id);
	await blogToUpdate.save();

	if (!blogToUpdate) {
		response.status(404).end();
	} else {
		// const updatedBlog = await Blog.findById(request.params.id);
		response.status(201).json(savedComment);
	}
});

module.exports = blogsRouter;
