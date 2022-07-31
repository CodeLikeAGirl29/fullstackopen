import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { ALL_BOOKS } from "./Books";

export const USER = gql`
	query {
		me {
			favoriteGenre
		}
	}
`;

const Recommended = (props) => {
	const resultUser = useQuery(USER);
	const resultBooks = useQuery(ALL_BOOKS);

	const [selectedGenre, setSelectedGenre] = useState(null);
	const [books, setBooks] = useState([]);
	const [filteredBooks, setFilteredBooks] = useState([]);

	useEffect(() => {
		if (resultBooks.data) {
			const allBooks = resultBooks.data.allBooks;
			setBooks(allBooks);
		}
	}, [resultBooks]);

	useEffect(() => {
		if (resultUser.data) {
			setSelectedGenre(resultUser.data.me.favoriteGenre);
		}
	}, [resultUser]);

	useEffect(() => {
		setFilteredBooks(
			books.filter((b) => b.genres.indexOf(selectedGenre) !== -1)
		);
	}, [books, selectedGenre]);

	if (!props.show) {
		return null;
	}

	if (resultBooks.loading) {
		return <div>loading...</div>;
	}

	return (
		<div>
			<h2>recommendations</h2>

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{filteredBooks.map((a) => (
						<tr key={a.title}>
							<td>{a.title}</td>
							<td>{a.author.name}</td>
							<td>{a.published}</td>
							<td>{a.genres}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Recommended;
