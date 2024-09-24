import StudyAlignLib from "./study-align-lib";
import {authSlice} from "../redux/reducers/authSlice";

const STUDY_ALIGN_URL = process.env.REACT_APP_STUDY_ALIGN_URL || "http://localhost:8000";

let sal;

export function initApi(studyId) {
    if (!sal) {
        console.log("Init StudyAlign api...")
        sal = new StudyAlignLib(STUDY_ALIGN_URL, studyId);
    }
}

export async function apiWithAuth(apiMethod, args, dispatch) {
    try {
        const response = await apiMethod(args)
        console.log("apiWithAuth:", apiMethod, args)
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
        //dispatch(authSlice.actions.logout())
        return Promise.reject(err)
    }
}

// Users

export function userLoginApi(username, password) {
    return sal.userLogin(username, password);
}

export function userMeApi() {
    return sal.userMe();
}

export function userRefreshTokenApi() {
    return sal.userRefreshToken();
}

export function getUsersApi() {
    return sal.getUsers();
}

export function getUserApi(userId) {
    return sal.getUser(userId);
}

export function createUserApi(user) {
    return sal.createUser(user);
}

export function updateUserApi(args) {
    return sal.updateUser(args.userId, args.user);
}

export function deleteUserApi(userId) {
    return sal.deleteUser(userId);
}

export function getRolesApi() {
    return sal.getRoles();
}

// Studies

export function getStudiesApi() {
    return sal.getStudies();
}

export function getStudyApi(studyId) {
    return sal.getStudy(studyId);
}

export function getStudySetupInfoApi(studyId) {
    return sal.getStudySetupInfo(studyId)
}

export function createStudyApi(study) {
    return sal.createStudy(study);
}

export function updateStudyApi(args) {
    return sal.updateStudy(args.studyId, args.study);
}

export function deleteStudyApi(studyId) {
    return sal.deleteStudy(studyId);
}

export function generateProceduresApi(studyId) {
    return sal.generateProcedures(studyId);
}

export function addParticipantsApi(args) {
    return sal.addParticipants(args.studyId, args.amount);
}

export function exportStudySchemaApi(studyId) {
    return sal.exportStudySchema(studyId);
}

export function importStudySchemaApi(studySchema) {
    return sal.importStudySchema(studySchema);
}

export function duplicateStudyApi(studyId) {
    return sal.duplicateStudy(studyId);
}

// DEPRECATED
// export function populateSurveyParticipantsApi(studyId) {
//     return sal.populateSurveyParticipants(studyId);
// }

export function generateParticipantsApi(args) {
    return sal.generateParticipants(args.studyId, args.amount);
}

// Procedure Configs

export function getProcedureConfigMainApi(studyId) {
    return sal.getProcedureConfigMain(studyId);
}

export function getProcedureConfigApi(procedureConfigId) {
    return sal.getProcedureConfig(procedureConfigId);
}

export function getProcedureConfigOverviewApi(procedureConfigId) {
    return sal.getProcedureConfigOverview(procedureConfigId);
}

export function createProcedureConfigBlockApi(procedureConfigBlock) {
    return sal.createProcedureConfigBlock(procedureConfigBlock);
}

export function deleteProcedureConfigBlockApi(procedureConfigBlockId) {
    return sal.deleteProcedureConfigBlock(procedureConfigBlockId);
}

export function createSingleProcedureConfigStepApi(args) {
    return sal.createSingleProcedureConfigStep(args.procedureConfigId, args.procedureConfigStep);
}

export function createProcedureConfigStepsApi(args) {
    return sal.createProcedureConfigSteps(args.procedureConfigId, args.procedureConfigSteps);
}

export function updateProcedureConfigApi(args) {
    return sal.updateProcedureConfig(args.procedureConfigId, args.procedureConfigSteps);
}

// Participants

export function getParticipantApi(token) {
    return sal.getParticipant(token);
}

export function getParticipantByIdApi(participantId) {
    return sal.getParticipantById(participantId);
}

export function getParticipantsApi(studyId) {
    return sal.getParticipants(studyId);
}

export function endParticipantPauseApi(participantToken) {
    return sal.endParticipantPause(participantToken);
}

export function getParticipantsByProcedureApi(procedureId) {
    return sal.getParticipantsByProcedure(procedureId);
}

// Conditions

export function getConditionIdsApi(studyId) {
    return sal.getConditionIds(studyId);
}

export function getConditionsApi(studyId) {
    return sal.getConditions(studyId);
}

export function getConditionApi(conditionId) {
    return sal.getCondition(conditionId);
}

export function createConditionApi(condition) {
    return sal.createCondition(condition);
}

export function updateConditionApi(args) {
    return sal.updateCondition(args.conditionId, args.condition);
}

export function deleteConditionApi(conditionId) {
    return sal.deleteCondition(conditionId);
}

// Procedures

export function getProceduresApi(studyId) {
    return sal.getProcedures(studyId);
}

// Tasks

export function getTasksApi(studyId) {
    return sal.getTasks(studyId);
}

export function getTaskApi(taskId) {
    return sal.getTask(taskId);
}

export function createTaskApi(task) {
    return sal.createTask(task);
}

export function updateTaskApi(taskId, task) {
    return sal.updateTask(taskId, task);
}

export function deleteTaskApi(taskId) {
    return sal.deleteTask(taskId);
}


// Texts

export function getTextsApi(studyId) {
    return sal.getTexts(studyId);
}

export function getTextApi(textId) {
    return sal.getText(textId);
}

export function createTextApi(text) {
    return sal.createText(text);
}

export function updateTextApi(args) {
    return sal.updateText(args.textId, args.text);
}

export function deleteTextApi(textId) {
    return sal.deleteText(textId);
}

// Questionnaires

export function getQuestionnairesApi(studyId) {
    return sal.getQuestionnaires(studyId);
}

export function getQuestionnaireApi(questionnaireId) {
    return sal.getQuestionnaire(questionnaireId);
}

export function createQuestionnaireApi(questionnaire) {
    return sal.createQuestionnaire(questionnaire);
}

export function updateQuestionnaireApi(args) {
    return sal.updateQuestionnaire(args.questionnaireId, args.questionnaire);
}

export function deleteQuestionnaireApi(questionnaireId) {
    return sal.deleteQuestionnaire(questionnaireId);
}

// Pauses

export function getPausesApi(studyId) {
    return sal.getPauses(studyId);
}

export function getPauseApi(pauseId) {
    return sal.getPause(pauseId);
}

export function createPauseApi(pause) {
    return sal.createPause(pause);
}

export function updatePauseApi(args) {
    return sal.updatePause(args.pauseId, args.pause);
}

export function deletePauseApi(pauseId) {
    return sal.deletePause(pauseId);
}

// Other calls

export function getInteractions(args) {
    return sal.getInteractions(args.studyId, args.type, args.offset, args.limit);
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

export function refreshTokenApi() {
    return sal.refreshToken();
}

export function meApi() {
     return sal.me();
}

export function readAccessTokenApi() {
    return sal.readTokens("access_token")
}

export function getProcedureApi(procedureId) {
    return sal.getProcedure(procedureId);
}

export function checkSurveyResultsApi() {
    return sal.checkSurveyResult();
}


