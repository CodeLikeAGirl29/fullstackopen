const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./test_helper");

const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(helper.initialBlogs);
});

describe("when there is initially some blogs are saved", () => {
	test("blogs are returned as json", async () => {
		await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("all blogs are returned", async () => {
		const response = await api.get("/api/blogs");

		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test("a specific blog is in the returned blogs", async () => {
		const response = await api.get("/api/blogs");
		const titles = response.body.map((r) => r.title);
		expect(titles).toContain("Testing");
	});
});

describe("viewing a specific blog", () => {
	test("blogs are defined by id", async () => {
		const response = await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
		expect(response.body[0].id).toBeDefined();
	});

	test("get a blog by id", async () => {
		const blogs = await helper.blogsInDb();
		const resultBlog = await api
			.get(`/api/blogs/${blogs[0].id}`)
			.expect(200)
			.expect("Content-Type", /application\/json/);
		expect(resultBlog.body).toEqual(JSON.parse(JSON.stringify(blogs[0])));
	});
});

describe("addition of a new blog", () => {
	test("a valid blog can be added", async () => {
		const newBlog = {
			title: "async/await simplifies making async calls",
			author: "NewUser",
			url: "some_url3",
			likes: 0,
		};

		await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const response = await api.get("/api/blogs");

		const titles = response.body.map((r) => r.title);

		expect(response.body).toHaveLength(helper.initialBlogs.length + 1);
		expect(titles).toContain("async/await simplifies making async calls");
	});

	test("a blog without a title and a url cannot be added", async () => {
		const newBlog = {
			author: "NewUser",
			likes: 0,
		};

		await api.post("/api/blogs").send(newBlog).expect(400);

		const response = await api.get("/api/blogs");

		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test("a blog without a like will have default like of 0", async () => {
		const newBlog = {
			title: "Test tile",
			author: "NewUser",
			url: "some_url3",
		};

		const response = await api.post("/api/blogs").send(newBlog).expect(201);

		expect(response.body["likes"]).toBe(0);
	});
});

describe("deletion of a blog", () => {
	test("a blog can be deleted", async () => {
		const blogs = await helper.blogsInDb();
		await api.delete(`/api/blogs/${blogs[0].id}`).expect(204);

		const response = await api.get("/api/blogs");
		const ids = response.body.map((r) => r.id);
		expect(ids).not.toContain(blogs[0].id);
		expect(response.body).toHaveLength(helper.initialBlogs.length - 1);
	});
});

describe("updating a blog", () => {
	test("blog's like number can be updated", async () => {
		const blogs = await helper.blogsInDb();
		const editedBlog = { ...blogs[0], likes: 99 };
		await api.put(`/api/blogs/${blogs[0].id}`).send(editedBlog).expect(200);

		const response = await api.get("/api/blogs");
		const allLikes = response.body.map((r) => r.likes);
		expect(allLikes).toContain(editedBlog.likes);
		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});
});

afterAll(() => {
	mongoose.connection.close();
});
