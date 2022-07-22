const mongoose = require("mongoose");
//check for duplicate db entries
const uniqueValidator = require("mongoose-unique-validator");
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

//connect to DB
const url = process.env.MONGO_DB_URL;
mongoose
	.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("Succesfully connected to MongoDB.");
	})
	.catch((error) => {
		console.log(`Error connecting to MongoDB: ${error.message}`);
	});
const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true,
		unique: true,
		uniqueCaseInsensitive: true,
	},
	number: {
		type: String,
		minlength: 8,
		required: true,
	},
});

personSchema.plugin(uniqueValidator);

//format object
personSchema.set("toJSON", {
	transform: (doc, returnedObj) => {
		returnedObj.id = returnedObj._id.toString();
		delete returnedObj._id;
		delete returnedObj.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
