import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthStorage {
	constructor(namespace = "auth") {
		this.namespace = namespace;
	}

	async getAccessToken() {
		return await AsyncStorage.getItem(`${this.namespace}:accessToken`);
	}

	async setAccessToken(accessToken) {
		return await AsyncStorage.setItem(
			`${this.namespace}:accessToken`,
			accessToken
		);
	}

	async removeAccessToken() {
		return await AsyncStorage.removeItem(`${this.namespace}:accessToken`);
	}
}

export default AuthStorage;
