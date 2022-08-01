require("dotenv").config();

const { ApolloServer, UserInputError, gql } = require("apollo-server");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "NEED_HERE_A_SECRET_KEY";

const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const url = process.env.MONGODB_URI;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose
	.connect(url, {
		useNewUrlParser: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});
mongoose.set("debug", true);

let authors = [
	{
		name: "Robert Martin",
		id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
		born: 1952,
	},
	{
		name: "Martin Fowler",
		id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
		born: 1963,
	},
	{
		name: "Fyodor Dostoevsky",
		id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
		born: 1821,
	},
	{
		name: "Joshua Kerievsky", // birthyear not known
		id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
	},
	{
		name: "Sandi Metz", // birthyear not known
		id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
	},
];

let books = [
	{
		title: "Water for Elephants",
		published: 2007,
		author: "Sara Gruen",
		id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
		genres: ["fiction", "historical fiction"],
	},
	{
		title: "The Body Keeps the Score",
		published: 2014,
		author: "Bessel van der Kolk",
		id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
		genres: ["nonfiction", "psychology", "self help"],
	},
	{
		title: "Never Split the Difference",
		published: 2016,
		author: "Chris Voss",
		id: "afa5de00-344d-11e9-a414-719c6709cf3e",
		genres: ["business", "psychology", "nonfiction"],
	},
	{
		title: "The 7 Habits of Highly Effective People",
		published: 2004,
		author: "Stephen R. Covey",
		id: "afa5de01-344d-11e9-a414-719c6709cf3e",
		genres: ["nonfiction", "business"],
	},
	{
		title:
			"Attached: The New Science of Adult Attachment & How It Can Help You Find--and Keep--Love",
		published: 2010,
		author: "Amir Levine",
		id: "afa5de02-344d-11e9-a414-719c6709cf3e",
		genres: ["psychology", "self help"],
	},
	{
		title: "Crime and punishment",
		published: 1866,
		author: "Fyodor Dostoevsky",
		id: "afa5de03-344d-11e9-a414-719c6709cf3e",
		genres: ["classic", "crime"],
	},
	{
		title: "The Demon ",
		published: 1872,
		author: "Fyodor Dostoevsky",
		id: "afa5de04-344d-11e9-a414-719c6709cf3e",
		genres: ["classic", "revolution"],
	},
];

const typeDefs = gql`
	type Subscription {
		bookAdded: Book!
	}

	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
	}

	type Token {
		value: String!
	}

	type Book {
		title: String!
		published: Int!
		author: Author!
		genres: [String!]!
		id: ID!
	}

	type Author {
		name: String!
		id: ID!
		born: Int
		bookCount: Int!
	}

	type Query {
		bookCount: Int!
		allBooks(author: String, genre: String): [Book!]!
		allAuthors: [Author!]!
		authorCount: Int!
		me: User
	}

	type Mutation {
		addBook(
			title: String!
			author: String
			published: Int!
			genres: [String!]
		): Book

		editAuthor(name: String!, setBornTo: Int!): Author

		createUser(username: String!, favoriteGenre: String!): User

		login(username: String!, password: String!): Token
	}
`;
const resolvers = {
	Query: {
		bookCount: () => Book.collection.countDocuments(),
		allBooks: async (root, args) => {
			const books = await Book.find({}).populate("author");
			return books;
		},
		allAuthors: async (root, args) => {
			const authors = await Author.find({});
			return authors;
		},
		authorCount: () => Author.collection.countDocuments(),
		me: (root, args, context) => {
			return context.currentUser;
		},
	},

	Mutation: {
		addBook: async (root, args, context) => {
			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new AuthenticationError("not authenticated");
			}

			let author = await Author.findOne({ name: args.author });

			if (!author) {
				author = new Author({ name: args.author, bookCount: 1 });
				try {
					await author.save();
				} catch (error) {
					throw new UserInputError(error.message, {
						invalidArgs: args,
					});
				}
			} else {
				author.bookCount += 1;
				await author.save();
			}

			let book = new Book({
				title: args.title,
				published: args.published,
				genres: args.genres,
				author: author,
			});

			try {
				await book.save();
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}
			pubsub.publish("BOOK_ADDED", { bookAdded: book });
			return book;
		},
		editAuthor: async (root, args, context) => {
			const author = await Author.findOne({ name: args.name });

			const currentUser = context.currentUser;

			if (!currentUser) {
				throw new AuthenticationError("not authenticated");
			}

			if (!author) {
				return null;
			}

			author.born = args.setBornTo;

			try {
				await author.save();
			} catch (error) {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			}

			return author;
		},
		createUser: (root, args) => {
			const user = new User({ username: args.username });

			return user.save().catch((error) => {
				throw new UserInputError(error.message, {
					invalidArgs: args,
				});
			});
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username });

			if (!user || args.password !== "secret") {
				throw new UserInputError("wrong credentials");
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return { value: jwt.sign(userForToken, JWT_SECRET) };
		},
	},

	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		const auth = req ? req.headers.authorization : null;
		if (auth && auth.toLowerCase().startsWith("bearer ")) {
			const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
			const currentUser = await User.findById(decodedToken.id);
			return { currentUser };
		}
	},
});

server.listen().then(({ url, subscriptionsUrl }) => {
	console.log(`Server ready at ${url}`);
	console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
