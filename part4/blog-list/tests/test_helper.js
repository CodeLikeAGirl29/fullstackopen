const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
	{
		title: "Github",
		author: "n/a",
		url: "http://www.github.com",
		likes: 5,
	},
	{
		title: "Badges for Github",
		author: "Vedant Chainani",
		url: "https://dev.to/envoy_/150-badges-for-github-pnk?signin=true",
		likes: 312,
	},
	{
		title: "How to Install Linux Mint",
		author: "Nathan Robinson",
		url: "https://dev.to/nrobinson2000/how-to-install-linux-mint-on-the-razer-blade-15-wip-22gb",
		likes: 9,
	},
	{
		title: "300+ React Interview Questions",
		author: "Michael Sakhniuk",
		url: "https://dev.to/sakhnyuk/300-react-interview-questions-2ko4",
		likes: 721,
	},
];

const testUser = {
  username: 'lindseykdev',
  name: 'lindsey k',
  password: 'Postgres',
  token: ''
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, testUser, nonExistingId, blogsInDb, usersInDb
}