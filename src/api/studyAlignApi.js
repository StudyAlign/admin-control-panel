import studyAlignLib from "./study-align-lib";
import {authSlice} from "../redux/reducers/authSlice";

const STUDY_ALIGN_URL = process.env.REACT_APP_STUDY_ALIGN_URL || "http://localhost:8000";

console.log(process.env)

let sal;

export function initApi(studyId) {
    if (!sal) {
        console.log("Init StudyAlign api...")
        sal = new studyAlignLib(STUDY_ALIGN_URL, studyId);
    }
}

export async function apiWithAuth(apiMethod, args, dispatch) {
    try {
        const response = await apiMethod(args)
        return Promise.resolve(response)
    } catch (err) {
        if (err.status === 401 || err.status === 403) { //unauthorized or forbidden
            try {
                console.log("Refreshing access token...")
                const tokenResponse = await userRefreshTokenApi()
                updateAccessTokenApi(tokenResponse.body);
                const response = await apiMethod(args)
                return Promise.resolve(response)
            } catch (err) {
                console.log("refreshing failed, logout")
                dispatch(authSlice.actions.logout())
                return Promise.reject(err)
            }
        }
        dispatch(authSlice.actions.logout())
        return Promise.reject(err)
    }
}

export function userLoginApi(username, password) {
    return sal.userLogin(username, password);
}

export function userMeApi() {
    return sal.userMe();
}
export function getParticipantApi(token) {
    return sal.getParticipant(token);
}

export function participateApi(token) {
    return sal.participate(token);
}

export function storeTokensApi(tokens) {
    return sal.storeTokens(tokens);
}

export function deleteTokensApi() {
    return sal.deleteTokens();
}

export function updateAccessTokenApi(response) {
    return sal.updateAccessToken(response)
}

export function readTokensApi(tokenType) {
    if (tokenType) {
        return sal.readTokens(tokenType);
    }
    return sal.readTokens();
}

export function userRefreshTokenApi() {
    return sal.userRefreshToken();
}

export function refreshTokenApi() {
    return sal.refreshToken();
}

export function meApi() {
     return sal.me();
}

export function getStudyApi() {
    return sal.getStudy();
}

export function readAccessTokenApi() {
    return sal.readTokens("access_token")
}

export function getProcedureApi(procedureId) {
    return sal.getProcedure(procedureId);
}

export function startProcedureApi() {
    return sal.startProcedure();
}

export function nextProcedureApi() {
    return sal.nextProcedure();
}

export function endProcedureApi() {
    return sal.endProcedure();
}

export function currentProcedureStepApi() {
    return sal.currentProcedureStep();
}

export function checkSurveyResultsApi() {
    return sal.checkSurveyResult();
}

export function startNavigatorApi() {
    return sal.startNavigator();
}

export function getNavigatorApi() {
    return sal.getNavigator();
}

export function closeNavigatorApi() {
    return sal.closeNavigator();
}

export function reconnectNavigatorApi() {
    return sal.reconnectNavigator();
}

