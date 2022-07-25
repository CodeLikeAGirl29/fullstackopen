const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		minlength: 3,
		required: true,
	},
	name: String,
	passwordHash: String,
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
		},
	],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
		// password has should not be sent
		delete returnedObject.passwordHash;
	},
});

const User = mongoose.model("User", userSchema);

module.exports = User;
