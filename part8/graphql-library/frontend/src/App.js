import React, { useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";

const Notify = ({ errorMessage }) => {
	if (!errorMessage) {
		return null;
	}
	return <div style={{ color: "red" }}>{errorMessage}</div>;
};

const App = () => {
	const [page, setPage] = useState("authors");
	const [token, setToken] = useState(null);
	const [favouriteGenre, setFavouriteGenre] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const client = useApolloClient();

	useEffect(() => {
		const loggedUser = window.localStorage.getItem("library-user-token");
		if (loggedUser) {
			setToken(loggedUser.token);
			setFavouriteGenre(loggedUser.favoriteGenre);
			console.log(loggedUser.favoriteGenre);
		}
	}, []);

	const notify = (message) => {
		setErrorMessage(message);
		setTimeout(() => {
			setErrorMessage(null);
		}, 10000);
	};

	const logout = () => {
		setToken(null);
		localStorage.clear();
		client.resetStore();
	};

	return (
		<div>
			<div>
				<button onClick={() => setPage("authors")}>authors</button>
				<button onClick={() => setPage("books")}>books</button>
				{token !== null && (
					<button onClick={() => setPage("add")}>add book</button>
				)}
				<button onClick={() => setPage("recommended")}>recommended</button>
				<button onClick={() => setPage("login")}>login</button>
				{token !== null && <button onClick={() => logout()}>logout</button>}
			</div>

			<Authors show={page === "authors"} />

			<Books show={page === "books"} />

			{token !== null && <NewBook show={page === "add"} />}

			<Recommended show={page === "recommended"} />

			<div>
				<Notify errorMessage={errorMessage} />
				<LoginForm
					show={page === "login"}
					setToken={setToken}
					setError={notify}
				/>
			</div>
		</div>
	);
};

export default App;
