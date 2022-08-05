import { useApolloClient, useMutation } from "@apollo/client";

import { AUTHORIZE } from "../graphql/mutations";
import useAuthStorage from "./useAuthStorage";

const useSignIn = () => {
	const authStorage = useAuthStorage();
	const apolloClient = useApolloClient();

	const [mutate, result] = useMutation(AUTHORIZE);

	const signIn = async ({ username, password }) => {
		const { data } = await mutate({ variables: { username, password } });
		await authStorage.setAccessToken(data.authorize.accessToken);
		apolloClient.resetStore();
	};

	return [signIn, result];
};

export default useSignIn;
