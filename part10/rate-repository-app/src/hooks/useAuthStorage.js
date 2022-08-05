import { useContext } from "react";

import AuthStorageContext from "../context/AuthStorageContext";

const useAuthStorage = () => {
	return useContext(AuthStorageContext);
};

export default useAuthStorage;
