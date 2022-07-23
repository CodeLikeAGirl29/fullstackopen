const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log(
		"Please provide the password as an argument: node mongo.js <password>"
	);
	process.exit(1);
}

const password = process.argv[2];

// const url = `mongodb+srv://notes-app-full:${password}@cluster1.lvvbt.mongodb.net/?retryWrites=true&w=majority`;
const url = `mongodb+srv://fullstack:${password}@cluster0.wj3aj.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Person = mongoose.model("Person", personSchema);

const displayAllPersons = () => {
	Person.find({}).then((result) => {
		result.forEach((person) => {
			console.log(`${person.name} ${person.number}`);
		});
		mongoose.connection.close();
	});
};

const createNewPerson = (name, number) => {
	const person = new Person({
		name,
		number,
	});
	person.save().then((result) => {
		console.log(`added ${name} number ${number} to phonebook`);
		mongoose.connection.close();
	});
};

if (process.argv.length === 3) {
	displayAllPersons();
} else {
	createNewPerson(process.argv[3], process.argv[4]);
}
