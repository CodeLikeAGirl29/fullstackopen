import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Link } from "react-router-native";
import { useApolloClient } from "@apollo/client";
import Constants from "expo-constants";

import Text from "./Text";
import theme from "../themes";
import useAuthorizedUser from "../hooks/useAuthorizedUser";
import useAuthStorage from "../hooks/useAuthStorage";

const styles = StyleSheet.create({
	container: {
		paddingTop: Constants.statusBarHeight,
		backgroundColor: theme.colors.appBar,
		flexDirection: "row",
	},
	appBarTab: {
		padding: 20,
		backgroundColor: theme.colors.appBar,
	},
	whiteText: {
		color: "white",
	},
	row: {
		flexDirection: "row",
	},
});

const AppBarTab = ({ children, to, onPress }) => {
	return (
		<Link style={styles.appBarTab} to={to} onPress={onPress}>
			<Text style={styles.whiteText}>{children}</Text>
		</Link>
	);
};

const AppBar = () => {
	const { authorizedUser } = useAuthorizedUser();
	const authStorage = useAuthStorage();
	const apolloClient = useApolloClient();

	const signOut = async () => {
		await authStorage.removeAccessToken();
		await apolloClient.resetStore();
	};

	return (
		<View style={styles.container}>
			<ScrollView horizontal style={styles.row}>
				<AppBarTab to='/'>Repositories</AppBarTab>
				{authorizedUser && <AppBarTab to='/my-reviews'>My Reviews</AppBarTab>}
				{authorizedUser && (
					<AppBarTab to='/create-review'>Create a review</AppBarTab>
				)}
				{!authorizedUser && <AppBarTab to='/sign-in'>Sign In</AppBarTab>}
				{authorizedUser && <AppBarTab onPress={signOut}>Sign Out</AppBarTab>}
				{!authorizedUser && <AppBarTab to='/sign-up'>Sign up</AppBarTab>}
			</ScrollView>
		</View>
	);
};

export default AppBar;
