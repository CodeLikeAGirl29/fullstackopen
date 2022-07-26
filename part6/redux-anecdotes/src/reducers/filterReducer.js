export const filterCreator = (content) => {
	return {
		type: "FILTER",
		content: content,
	};
};

const filterReducer = (state = "", action) => {
	switch (action.type) {
		case "FILTER":
			console.log(action.content);
			return action.content;
		default:
			return state;
	}
};

export default filterReducer;
