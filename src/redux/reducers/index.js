import { combineReducers } from "redux";
import auth from "./authSlice";
import studies from "./studySlice"
import texts from "./textSlice"

export default combineReducers({
    auth,
    studies,
    texts,
});