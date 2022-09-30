import { combineReducers } from "redux";
import auth from "./authSlice";
import studies from "./studySlice"
import texts from "./textSlice"
import conditions from "./conditionSlice"
import questionnaires from "./questionnaireSlice"
import pauses from "./pauseSlice"


export default combineReducers({
    auth,
    studies,
    texts,
    conditions,
    questionnaires,
    pauses
});