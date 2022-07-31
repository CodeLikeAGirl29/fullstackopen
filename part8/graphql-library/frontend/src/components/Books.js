import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

export const ALL_BOOKS = gql`
	query {
		allBooks {
			title
			published
			genres
			author {
				name
				born
			}
		}
	}
`;

const BOOK_DETAILS = gql`
	fragment BookDetails on Book {
		title
		published
		genres
		author {
			name
			born
		}
	}
`;

export const BOOK_ADDED = gql`
	subscription {
		bookAdded {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`;

const Books = (props) => {
	const result = useQuery(ALL_BOOKS);
	const [genre, setGenre] = useState(null);
	const [genres, setGenres] = useState([]);
	const [selectedGenre, setSelectedGenre] = useState([]);
	const [books, setBooks] = useState([]);
	const [filteredBooks, setFilteredBooks] = useState([]);

	useEffect(() => {
		if (result.data) {
			const allBooks = result.data.allBooks;
			setBooks(allBooks);
			let genres = ["All genres"];
			allBooks.forEach((element) => {
				element.genres.forEach((g) => {
					if (genres.indexOf(g) === -1) {
						genres.push(g);
					}
				});
			});
			setGenres(genres);
			setSelectedGenre("All genres");
		}
	}, [result]);

	useEffect(() => {
		if (selectedGenre === "All genres") {
			setFilteredBooks(books);
		} else {
			setFilteredBooks(
				books.filter((b) => b.genres.indexOf(selectedGenre) !== -1)
			);
		}
	}, [books, selectedGenre]);

	if (!props.show) {
		return null;
	}

	if (result.loading) {
		return <div>loading...</div>;
	}

	return (
		<div>
			<h2>books</h2>

			{selectedGenre !== "All genres" && <div>in genre {selectedGenre}</div>}

			{selectedGenre === "All genres" && <div>all genres</div>}

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
			<div>
				{genres.map((genre) => (
					<button key={genre} onClick={() => setSelectedGenre(genre)}>
						{genre}
					</button>
				))}
			</div>
		</div>
	);
};

export default Books;
