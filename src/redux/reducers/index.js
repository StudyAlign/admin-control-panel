import { combineReducers } from "redux";
import auth from "./authSlice";
import studies from "./studySlice"
import texts from "./textSlice"
import conditions from "./conditionSlice"
import questionnaires from "./questionnaireSlice"
import pauses from "./pauseSlice"
import blocks from "./blockSlice"
import interactions from "./interactionSlice"
import users from "./userSlice"


export default combineReducers({
    auth,
    studies,
    texts,
    conditions,
    questionnaires,
    pauses,
    blocks,
    interactions,
    users
});