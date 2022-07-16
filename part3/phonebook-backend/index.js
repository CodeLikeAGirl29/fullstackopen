require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Person = require("./models/person");
const app = express();
app.use(express.json());
const morgan = require("morgan");
app.use(express.static("build"));
app.use(cors());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
	Person.find({}).then((persons) => {
		response.json(persons);
	});
});

app.get("/api/persons/:id", (request, response, next) => {
	Person.findById(request.params.id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number,
	};

	Person.findByIdAndUpdate(request.params.id, person, {
		new: true,
		runValidators: true,
		context: "query",
	})
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
	console.log("inside post(/api/persons");
	const body = request.body;
	/*let badRequest = []

	if(!body.name)
		badRequest = badRequest.concat({error: 'name missing'})
	if(!body.number)
		badRequest = badRequest.concat({error: 'number missing'})

	if (badRequest.length)
		return response.status(400).json(badRequest)*/

	const person = new Person({
		name: body.name,
		number: body.number,
	});

	person
		.save()
		.then((savedPerson) => savedPerson.toJSON())
		.then((savedAndFormattedPerson) => {
			response.json(savedAndFormattedPerson);
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(() => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.get("/info", (request, response) => {
	Person.estimatedDocumentCount({}, (err, count) => {
		const msg = `Phonebook has info for ${count} people<br /><br />${new Date()}`;
		response.send(msg);
	});
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint); // load 2nd to last

const errorHandler = (error, request, response, next) => {
	console.error(error.message);
	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}
	next(error);
};
app.use(errorHandler); //load last

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
