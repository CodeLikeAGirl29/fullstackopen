import axios from "axios";
const baseUrl = "/api/persons";

const create = (newObject) => {
	const request = axios.post(baseUrl, newObject);
	return request.then((response) => response.data);
};

const getAll = () => {
	const request = axios.get(baseUrl);
	return request.then((response) => response.data);
};

const deleteObject = (id) => {
	const request = axios.delete(`${baseUrl}/${id}`);
	return request.then((response) => response.data);
};

const update = (object, id) => {
	const request = axios.put(`${baseUrl}/${id}`, object);
	return request.then((response) => response.data);
};
export default { create, getAll, deleteObject, update };
