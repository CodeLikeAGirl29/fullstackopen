import { useEffect, useState } from "react";
import Search from "./components/Search";
import Notification from "./components/Notification";
import Form from "./components/Form";
import Persons from "./components/Person";
import personsService from "./services/persons";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [newName, setNewName] = useState("");
	const [newNumber, setNewNumber] = useState("");
	const [filter, setFilter] = useState("");
	const [successMessage, setSuccessMessage] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		personsService.getAll().then((response) => {
			setPersons(response.data);
		});
	}, []);

	const filteredPersons = persons.filter((person) =>
		person.name.toLowerCase().includes(filter.toLowerCase())
	);

	const handleNameChange = (event) => {
		setNewName(event.target.value);
	};

	const handleNumberChange = (event) => {
		setNewNumber(event.target.value);
	};

	const handleFilter = (event) => {
		setFilter(event.target.value);
	};

	const showSuccessMessage = (message) => {
		setSuccessMessage(message);
		setTimeout(() => {
			setSuccessMessage(null);
		}, 3000);
	};

	const updateUser = (id, newPerson) => {
		personsService
			.update(id, newPerson)
			.then((response) => {
				setPersons(
					persons.map((person) => (person.id !== id ? person : response.data))
				);
				setNewName("");
				setNewNumber("");
				showSuccessMessage(`Updated ${response.data.name}`);
			})
			.catch((error) => {
				setErrorMessage(error.response.data.error);
				setTimeout(() => {
					setErrorMessage(null);
				}, 3000);
			});
	};

	const addPerson = (event) => {
		event.preventDefault();
		if (newName.trim() === "" || newNumber.trim() === "") {
			return;
		}
		const personObject = {
			name: newName.trim(),
			number: newNumber.trim(),
		};

		const isPersonExist = persons.find(
			(person) => person.name === newName.trim()
		);

		if (isPersonExist) {
			if (
				window.confirm(
					`${newName} is already added to phonebook, replace old number with a new one?`
				)
			) {
				updateUser(isPersonExist.id, personObject);
			}
			return;
		}

		personsService
			.create(personObject)
			.then((response) => {
				setPersons([...persons, response.data]);
				setNewName("");
				setNewNumber("");
				showSuccessMessage(`Added ${response.data.name}`);
			})
			.catch((error) => {
				setErrorMessage(error.response.data.error);
				setTimeout(() => {
					setErrorMessage(null);
				}, 3000);
			});
	};

	const deletePerson = (removedPerson) => {
		personsService
			.remove(removedPerson.id)
			.then(() => {
				setPersons(persons.filter((person) => person.id !== removedPerson.id));
			})
			.catch(() => {
				setPersons(persons.filter((person) => person.id !== removedPerson.id));
				setErrorMessage(
					`Information of ${removedPerson.name} has already been removed from server`
				);
				setTimeout(() => {
					setErrorMessage(null);
				}, 3000);
			});
	};

	return (
		<div>
			<h2>My Phonebook</h2>
			<Notification message={successMessage} variant='success' />
			<Notification message={errorMessage} variant='error' />
			<Search filter={filter} handleFilter={handleFilter} />

			<h3>Add a new</h3>
			<Form
				addPerson={addPerson}
				newName={newName}
				handleNameChange={handleNameChange}
				newNumber={newNumber}
				handleNumberChange={handleNumberChange}
			/>

			<h3>Numbers</h3>
			<Person persons={filteredPersons} deletePerson={deletePerson} />
		</div>
	);
};

export default App;
