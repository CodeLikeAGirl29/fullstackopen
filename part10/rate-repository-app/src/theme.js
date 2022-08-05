import { Platform } from "react-native";

const colorPrimary = "#0366d6";

const theme = {
	colors: {
		primary: colorPrimary,
		appBar: "#2F90BF",
		error: "#d73a4a",
		background: "#CDCDCD",
	},
	text: {
		fontFamily: Platform.select({
			ios: "Arial",
			android: "Roboto",
			default: "System",
		}),
	},
	meta: {
		color: "gray",
		fontWeight: "normal",
	},
	button: {
		backgroundColor: colorPrimary,
		borderRadius: 5,
		padding: 20,
	},
	buttonText: {
		color: "white",
		textAlign: "center",
	},
};

export default theme;
