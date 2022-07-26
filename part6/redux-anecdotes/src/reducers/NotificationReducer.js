const notificationAtStart = null;
/*
export const votedMessage = (content) => {
  return {
    type: 'MESSAGE',
    message: `you voted for ${content}`
  }
}

export const setNull = () => {
  return {
    type: 'MESSAGE',
    message: null
  }
}

export const createdMessage = (content) => {
  return {
    type: 'MESSAGE',
    message: `you created anecdote: ${content}`
  }
}
*/
export const setNotification = (message, timeout) => {
	console.log("message", message);
	console.log("timeout", timeout);
	return async (dispatch) => {
		dispatch({
			type: "MESSAGE",
			message: message,
		});
		const time = timeout * 1000;
		setTimeout(
			() =>
				dispatch({
					type: "MESSAGE",
					message: null,
				}),
			time
		);
	};
};

const notificationReducer = (state = notificationAtStart, action) => {
	switch (action.type) {
		case "MESSAGE":
			return action.message;
		default:
			return state;
	}
};

export default notificationReducer;
