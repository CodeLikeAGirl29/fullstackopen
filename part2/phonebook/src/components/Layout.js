import React from "react";

const Layout = ({ persons, deletePerson }) => {
	return (
		<div>
			<h2>📱 Phone Numbers:</h2>
			{persons.map((person) => (
				<div key={person.name}>
					{person.name} {person.number}
					<button
						onClick={() => {
							deletePerson(person.id);
						}}
					>
						Delete
					</button>
				</div>
			))}
		</div>
	);
};

export default Layout;
