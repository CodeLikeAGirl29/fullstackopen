import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import Form from "./components/Form";
import Layout from "./components/Layout";
import Notification from "./components/Notification";
import personService from "./services/phonebook.js";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("Enter number");
	const [filter, setFilter] = useState("");
	const [notification, setNotification] = useState({
		message: null,
		type: null,
	});

	useEffect(() => {
		personService.getAll().then((initialPersons) => {
			setPersons(initialPersons);
		});
	}, []);
	const personsToShow = persons.filter(
		(person) => person.name.toUpperCase().search(filter.toUpperCase()) !== -1
	);

	const handleFilterChange = (event) => {
		setFilter(event.target.value);
	};

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

	const addPerson = (event) => {
		event.preventDefault();
		let existingPersonIndex = persons.findIndex((e) => e.name === newName);
		if (existingPersonIndex !== -1) {
			const updatedPerson = {
				name: newName,
				number: newNumber,
				date: new Date(),
			};
			if (
				window.confirm(
					`${updatedPerson.name} is already added to the Phonebook. Replace the old number with a new one ?`
				)
			) {
				personService
					.update(updatedPerson, persons[existingPersonIndex].id)
					.then((returnedPerson) => {
						setPersons(
							persons.map((person) =>
								person.id !== persons[existingPersonIndex].id
									? person
									: returnedPerson
							)
						);
						setNotification({
							message: `Updated ${returnedPerson.name}`,
							type: "success",
						});
						setTimeout(() => {
							setNotification({ message: null, type: null });
						}, 5000);
					})
					.catch((error) => {
						setNotification({
							message: error.response.data.error,
							type: "error",
						});
						setTimeout(() => {
							setNotification({ message: null, type: null });
						}, 5000);
					});
				setNewName("");
				setNewNumber("");
			}
		} else if (persons.some((e) => e.number === newNumber)) {
			window.alert(`${newNumber} is already added to phonebook`);
		} else {
			const newPerson = {
				name: newName,
				number: newNumber,
				date: new Date(),
			};
			personService
				.create(newPerson)
				.then((returnedPerson) => {
					setPersons(persons.concat(returnedPerson));
					setNotification({
						message: `Added ${returnedPerson.name}`,
						type: "success",
					});
					setTimeout(() => {
						setNotification({ message: null, type: null });
					}, 5000);
				})
				.catch((error) => {
					setNotification({
						message: error.response.data.error,
						type: "error",
					});
					setTimeout(() => {
						setNotification({ message: null, type: null });
					}, 5000);
				});
			setNewName("");
			setNewNumber("");
		}
	};

	const deletePerson = (id) => {
		let personToDelete = persons.filter((person) => person.id === id);
		if (window.confirm("Delete " + personToDelete[0].name + " ?")) {
			personService.deleteObject(id).then(() => {
				setPersons(persons.filter((person) => person.id !== id));
			});
		}
	};

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification notification={notification} />
			<Search filter={filter} handleFilterChange={handleFilterChange} />
			<h2>Add a new entry</h2>
			<Form
				addPerson={addPerson}
				newName={newName}
				newNumber={newNumber}
				handleNameChange={handleNameChange}
				handleNumberChange={handleNumberChange}
			/>
			<Layout persons={personsToShow} deletePerson={deletePerson} />
		</div>
	);
};

export default App;
