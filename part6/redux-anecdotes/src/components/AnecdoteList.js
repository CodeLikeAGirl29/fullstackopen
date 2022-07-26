import React from "react";
import { connect } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/NotificationReducer";

const AnecdoteList = (props) => {
	const vote = (anecdote) => {
		console.log("vote", anecdote);
		props.voteAnecdote(anecdote);
		props.setNotification(`you voted for ${anecdote.content}`, 5);
	};

	return (
		<div>
			<br />
			{props.visibleAnecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => vote(anecdote)}>vote</button>
					</div>
				</div>
			))}
		</div>
	);
};
const anecdotesToShow = ({ anecdotes, filter }) => {
	return anecdotes
		.sort((a, b) => b.votes - a.votes)
		.filter((a) => a.content.toLowerCase().includes(filter));
};

const mapStateToProps = (state) => {
	console.log("mapstatetoprops", state);
	return {
		visibleAnecdotes: anecdotesToShow(state),
	};
};

const mapDispatchToProps = {
	voteAnecdote,
	setNotification,
};

const ConnectedAnecdoteList = connect(
	mapStateToProps,
	mapDispatchToProps
)(AnecdoteList);
export default ConnectedAnecdoteList;
