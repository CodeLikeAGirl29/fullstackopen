import React from "react";
import { connect } from "react-redux";
import { filterCreator } from "../reducers/filterReducer";

const Filter = (props) => {
	const handleChange = (event) => {
		// input-kentän arvo muuttujassa event.target.value
		const content = event.target.value;
		props.filterCreator(content);
	};
	const style = {
		marginBottom: 10,
	};

	return (
		<div style={style}>
			filter <input onChange={handleChange} />
		</div>
	);
};

const mapStateToProps = (state) => {
	console.log("mapstatetoprops", state);
	return {
		anecdotes: state.anecdotes,
		filter: state.filter,
	};
};

const mapDispatchToProps = {
	filterCreator,
};

const ConnectedFilter = connect(mapStateToProps, mapDispatchToProps)(Filter);
export default ConnectedFilter;
