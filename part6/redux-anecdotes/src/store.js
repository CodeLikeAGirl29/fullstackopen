import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import anecdoteReducer from "./reducers/anecdoteReducer";
import NotificationReducer from "./reducers/NotificationReducer";
import filterReducer from "./reducers/filterReducer";

const reducer = combineReducers({
	anecdotes: anecdoteReducer,
	notification: NotificationReducer,
	filter: filterReducer,
});
const store = createStore(reducer, applyMiddleware(thunk));

export default store;
