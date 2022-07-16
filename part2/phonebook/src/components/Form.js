import React from "react";

const Form = ({
	addPerson,
	newName,
	newNumber,
	handleNameChange,
	handleNumberChange,
}) => {
	return (
		<form onSubmit={addPerson}>
			<div class='grid-container'>
				<div class='grid-x grid-padding-x'>
					<div class='medium-6 cell'>
						<label>
							Name:
							<input
								type='text'
								value={newName}
								onChange={handleNameChange}
								placeholder='Name'
							/>
						</label>
					</div>
					<div class='medium-6 cell'>
						<label>
							Number:
							<input
								type='number'
								value={newNumber}
								onChange={handleNumberChange}
								placeholder='Number'
							/>
						</label>
					</div>
				</div>
			</div>
			<button class='hollow button primary' type='submit'>
				Add
			</button>
		</form>
	);
};

export default Form;
