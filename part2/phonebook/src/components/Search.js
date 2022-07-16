import React from "react";
const Search = ({ filter, handleFilterChange }) => {
	return (
		<div class='ui left icon input'>
			<label>
				{" "}
				Filter results:
				<input
					type='text'
					value={filter}
					onChange={handleFilterChange}
					placeholder='Search'
				/>
				<i class='circular search link icon'></i>
			</label>
		</div>
	);
};
export default Search;
