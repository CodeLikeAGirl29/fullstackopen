import React from "react";

const Notification = ({ notification }) => {
	const styleSuccess = {
		color: "green",
		background: "lightgrey",
		fontSize: 20,
		borderStyle: "solid",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	};
	const styleError = {
		color: "red",
		background: "lightgrey",
		fontSize: 20,
		borderStyle: "solid",
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	};
	if (notification.message === null) {
		return null;
	} else if (notification.type === "success") {
		return <div style={styleSuccess}>{notification.message}</div>;
	}
	return <div style={styleError}>{notification.message}</div>;
};

export default Notification;
