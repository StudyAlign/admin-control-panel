import { combineReducers } from "redux";
import auth from "./authSlice";
import studies from './studySlice'

export default combineReducers({
    auth,
    studies
});