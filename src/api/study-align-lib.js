import { DragInteraction, GenericInteraction, KeyboardInteraction, MouseInteraction, TouchInteraction } from "./interactions";
class StudyAlignLib {
    constructor(url = "http://localhost:8080", studyId) {
        // Interaction Lists (Web Events only), needed for bulk saving
        this.mouseInteractionList = [];
        this.dragInteractionList = [];
        this.keyboardInteractionList = [];
        this.touchInteractionList = [];
        this.genericInteractionList = [];
        this.apiVersion = "v1";
        this.url = url;
        this.studyId = studyId;
        this.apiUrl = this.url + "/api/" + this.apiVersion;
    }
    getTimestamp() {
        return Date.now;
    }
    getTimestampWithOffset() {
        const date = new Date();
        date.setMinutes(date.getMinutes() + (-1 * date.getTimezoneOffset()));
        return date.getTime();
    }
    setHeaders(options, refresh = false) {
        const access_token = !refresh ? this.readTokens("access_token") : this.readTokens("refresh_token");
        options.headers["Authorization"] = "Bearer " + access_token;
        options.headers["Content-type"] = "application/json";
    }
    setLoggerHeaders(options) {
        if (this.loggerKey) {
            options.headers["Studyalign-Logger-Key"] = this.loggerKey;
        }
        options.headers["Content-type"] = "application/json";
    }
    request(options) {
        const encodeParams = (data) => {
            return Object.keys(data).map((key) => {
                return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }).join('&');
        };
        return new Promise((resolve, reject) => {
            let url = this.apiUrl + "/" + options.path;
            let xhr = new XMLHttpRequest();
            if (options.asQuery) {
                let params = options.params;
                let encodedParams = "";
                if (params && typeof params === 'object') {
                    encodedParams = encodeParams(params);
                }
                url = url + "?" + encodedParams;
            }
            xhr.open(options.method, url);
            // For Exports
            if (options.responseType) {
                xhr.responseType = options.responseType;
            }
            if (options.onload) {
                xhr.onload = options.onload;
            }
            else {
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        let body;
                        if (options.responseType === "blob") {
                            body = xhr.response;
                        }
                        else {
                            body = xhr.response ? JSON.parse(xhr.response) : "";
                        }
                        resolve({
                            status: xhr.status,
                            body: body
                        });
                    }
                    else {
                        reject({
                            status: xhr.status,
                            statusText: xhr.statusText,
                            requestBody: options.body
                        });
                    }
                };
            }
            if (options.onprogress) {
                xhr.onprogress = options.onprogress;
            }
            if (options.onerror) {
                xhr.onerror = options.onerror;
            }
            else {
                xhr.onerror = () => {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText,
                        requestBody: options.body
                    });
                };
            }
            if (options.headers) {
                Object.keys(options.headers).forEach((key) => {
                    xhr.setRequestHeader(key, options.headers[key]);
                });
            }
            if (options.method === "GET" || options.method === "DELETE") {
                let params = options.params;
                let encodedParams = "";
                if (params && typeof params === 'object') {
                    encodedParams = encodeParams(params);
                }
                xhr.send(encodedParams);
            }
            if (options.method === "POST" || options.method === "PATCH") {
                if (options.asQuery) {
                    xhr.send();
                }
                else {
                    xhr.send(options.formData ? encodeParams(options.body) : JSON.stringify(options.body));
                }
            }
        });
    }
    basicCreate(path, data) {
        let options = {
            method: "POST",
            path: path,
            headers: {}
        };
        this.setHeaders(options);
        if (data) {
            options.body = data;
        }
        return this.request(options);
    }
    basicRead(path) {
        const options = {
            method: "GET",
            path: path,
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    basicUpdate(path, data) {
        let options = {
            method: "PATCH",
            path: path,
            headers: {}
        };
        this.setHeaders(options);
        options.body = data;
        return this.request(options);
    }
    basicDelete(path) {
        let options = {
            method: "DELETE",
            path: path,
            headers: {}
        };
        this.setHeaders(options);
        const yo = this.request(options);
        console.log(yo);
        return yo;
    }
    // Admin related functions
    userLogin(username, password) {
        const options = {
            method: "POST",
            path: "users/login",
            headers: {},
            body: { username: username, password: password },
            formData: true
        };
        options.headers["Content-type"] = "application/x-www-form-urlencoded";
        return this.request(options);
    }
    userMe() {
        return this.basicRead("users/me");
    }
    userRefreshToken() {
        const options = {
            method: "GET",
            path: "users/refresh",
            headers: {}
        };
        this.setHeaders(options, true);
        return this.request(options);
    }
    getUsersCount() {
        return this.basicRead("users/count");
    }
    getUsers(offset = 0, limit = 100, orderBy = "id", direction = "asc", search = "") {
        const options = {
            method: "GET",
            path: "users",
            headers: {},
            params: { offset: offset, limit: limit, order_by: orderBy, direction: direction, search: search },
            asQuery: true
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getUser(userId) {
        return this.basicRead("users/" + userId);
    }
    createUser(user) {
        return this.basicCreate("users", user);
    }
    updateUser(userId, user) {
        return this.basicUpdate("users/" + userId, user);
    }
    deleteUser(userId) {
        return this.basicDelete("users/" + userId);
    }
    getRoles() {
        return this.basicRead("users/roles");
    }
    // ---- MAINLY FOR USE IN ADMIN FRONTEND ---- //
    // Studies
    getStudies() {
        return this.basicRead("studies");
    }
    createStudy(study) {
        return this.basicCreate("studies", study);
    }
    updateStudy(studyId, study) {
        return this.basicUpdate("studies/" + studyId, study);
    }
    deleteStudy(studyId) {
        return this.basicDelete("studies/" + studyId);
    }
    generateProcedures(studyId) {
        const options = {
            method: "POST",
            path: "studies/" + studyId + "/procedures",
            headers: {},
            body: {},
            formData: true,
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getProcedureConfigMain(studyId) {
        return this.basicRead("studies/" + studyId + "/procedure-config");
    }
    getParticipants(studyId, offset = 0, limit = 100, orderBy = "id", direction = "asc") {
        const options = {
            method: "GET",
            path: "studies/" + studyId + "/participants",
            headers: {},
            params: { offset: offset, limit: limit, order_by: orderBy, direction: direction },
            asQuery: true
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getParticipantsCount(studyId, participant_state, paused, proceed) {
        const params = { participant_state, paused, proceed };
        // Remove undefined parameters
        Object.keys(params).forEach(key => {
            if (params[key] === undefined) {
                delete params[key];
            }
        });
        const options = {
            method: "GET",
            path: "studies/" + studyId + "/participants/count",
            headers: {},
            params: params,
            asQuery: true
        };
        this.setHeaders(options);
        return this.request(options);
    }
    generateParticipants(studyId, amount) {
        const options = {
            method: "POST",
            path: "studies/" + studyId + "/participants",
            headers: {},
            params: { amount: amount },
            asQuery: true
        };
        this.setHeaders(options);
        return this.request(options);
    }
    addParticipants(studyId, amount) {
        const options = {
            method: "POST",
            path: "studies/" + studyId + "/add-participants",
            headers: {},
            params: { amount: amount },
            asQuery: true
        };
        this.setHeaders(options);
        return this.request(options);
    }
    exportStudySchema(studyId) {
        return this.basicRead("studies/" + studyId + "/export");
    }
    importStudySchema(studySchema) {
        return this.basicCreate("studies/import", studySchema);
    }
    duplicateStudy(studyId) {
        return this.basicRead("studies/" + studyId + "/duplicate");
    }
    // DEPRECATED function
    //populateSurveyParticipants(studyId: number) {
    //    return this.basicRead("studies/" + studyId + "/survey-participants");
    //}
    // Procedure Configs
    getProcedureConfig(procedureConfigId) {
        return this.basicRead("procedure-configs/" + procedureConfigId);
    }
    getProcedureConfigOverview(procedureConfigId) {
        return this.basicRead("procedure-configs/" + procedureConfigId + "/overview");
    }
    createProcedureConfigBlock(block) {
        return this.basicCreate("procedure-configs/block", block);
    }
    deleteProcedureConfigBlock(blockId) {
        return this.basicDelete("procedure-configs/block/" + blockId);
    }
    createSingleProcedureConfigStep(procedureConfigId, procedureConfigStep) {
        const options = {
            method: "POST",
            path: "procedure-configs/" + procedureConfigId + "/step",
            headers: {},
            body: procedureConfigStep
        };
        this.setHeaders(options);
        return this.request(options);
    }
    createProcedureConfigSteps(procedureConfigId, procedureConfigSteps) {
        const options = {
            method: "POST",
            path: "procedure-configs/" + procedureConfigId + "/create-steps",
            headers: {},
            body: procedureConfigSteps
        };
        this.setHeaders(options);
        return this.request(options);
    }
    updateProcedureConfig(procedureConfigId, procedureConfigSteps) {
        return this.basicUpdate("procedure-configs/" + procedureConfigId, procedureConfigSteps);
    }
    // Conditions
    getConditionIds(studyId) {
        const options = {
            method: "GET",
            path: "conditions/ids",
            headers: {},
            body: { study_id: studyId },
            formData: true,
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getCondition(conditionId) {
        return this.basicRead("conditions/" + conditionId);
    }
    getConditions(studyId) {
        return this.basicRead("studies/" + studyId + "/conditions");
    }
    createCondition(condition) {
        return this.basicCreate("conditions", condition);
    }
    updateCondition(conditionId, condition) {
        return this.basicUpdate("conditions/" + conditionId, condition);
    }
    deleteCondition(conditionId) {
        return this.basicDelete("conditions/" + conditionId);
    }
    getTasks(studyId) {
        return this.basicRead("studies/" + studyId + "/tasks");
    }
    getTexts(studyId) {
        return this.basicRead("studies/" + studyId + "/texts");
    }
    getQuestionnaires(studyId) {
        return this.basicRead("studies/" + studyId + "/questionnaires");
    }
    getPauses(studyId) {
        return this.basicRead("studies/" + studyId + "/pauses");
    }
    // Collaborators
    getCollaborators(studyId) {
        return this.basicRead("collaborators/study/" + studyId);
    }
    createCollaborator(collaborator) {
        return this.basicCreate("collaborators", collaborator);
    }
    deleteCollaborator(collaboratorId) {
        return this.basicDelete("collaborators/" + collaboratorId);
    }
    // Procedures
    getProcedures(studyId) {
        const options = {
            method: "GET",
            path: "procedures",
            headers: {},
            body: { study_id: studyId },
            formData: true,
        };
        this.setHeaders(options);
        return this.request(options);
    }
    procedureStepPush(participantToken) {
        return this.basicRead("procedures/push/" + participantToken);
    }
    // Participants
    getParticipantsByProcedure(procedureId) {
        const options = {
            method: "GET",
            path: "participants",
            headers: {},
            body: { procedure_id: procedureId },
            formData: true,
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getParticipantById(participantId) {
        return this.basicRead("participants/" + participantId);
    }
    endParticipantPause(participantToken) {
        return this.basicRead("participants/" + participantToken + "/end-pause");
    }
    //Tasks
    createTask(task) {
        return this.basicCreate("tasks", task);
    }
    getTask(taskId) {
        return this.basicRead("tasks/" + taskId);
    }
    updateTask(taskId, task) {
        return this.basicUpdate("tasks/" + taskId, task);
    }
    deleteTask(taskId) {
        return this.basicDelete("tasks/" + taskId);
    }
    //Texts
    createText(text) {
        return this.basicCreate("texts", text);
    }
    getText(textId) {
        return this.basicRead("texts/" + textId);
    }
    updateText(textId, text) {
        return this.basicUpdate("texts/" + textId, text);
    }
    deleteText(textId) {
        return this.basicDelete("texts/" + textId);
    }
    //Questionnaires
    createQuestionnaire(questionnaire) {
        return this.basicCreate("questionnaires", questionnaire);
    }
    getQuestionnaire(questionnaireId) {
        return this.basicRead("questionnaires/" + questionnaireId);
    }
    updateQuestionnaire(questionnaireId, questionnaire) {
        return this.basicUpdate("questionnaires/" + questionnaireId, questionnaire);
    }
    deleteQuestionnaire(questionnaireId) {
        return this.basicDelete("questionnaires/" + questionnaireId);
    }
    //Pauses
    createPause(pause) {
        return this.basicCreate("pauses", pause);
    }
    getPause(pauseId) {
        return this.basicRead("pauses/" + pauseId);
    }
    updatePause(pauseId, pause) {
        return this.basicUpdate("pauses/" + pauseId, pause);
    }
    deletePause(pauseId) {
        return this.basicDelete("pauses/" + pauseId);
    }
    //Interactions
    getInteractions(studyId, type, offset = 0, limit = 100, orderBy = "id", direction = "asc") {
        const options = {
            method: "GET",
            path: "interactions",
            headers: {},
            params: { study_id: studyId, type: type, offset: offset, limit: limit, order_by: orderBy, direction: direction },
            asQuery: true
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getInteractionCount(studyId, type) {
        const options = {
            method: "GET",
            path: "interactions/count",
            headers: {},
            params: { study_id: studyId, type: type },
            asQuery: true
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getInteractionCounts(studyId) {
        const options = {
            method: "GET",
            path: "interactions/counts",
            headers: {},
            params: { study_id: studyId },
            asQuery: true
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getInteractionExport(studyId) {
        const options = {
            method: "GET",
            path: "interactions/export",
            headers: {},
            params: { study_id: studyId },
            asQuery: true,
            responseType: "blob"
        };
        this.setHeaders(options);
        return this.request(options);
    }
    // ---- MAINLY FOR USE IN STUDY FRONTEND ---- //
    //TODO: read condition config
    //Study Frontend related functions
    getStudy(studyId) {
        const options = {
            method: "GET",
            path: "studies/" + (studyId || this.studyId),
        };
        return this.request(options);
    }
    getStudySetupInfo(studyId) {
        return this.basicRead("studies/" + studyId + "/setup-info");
    }
    // Participation related methods
    getParticipant(participantToken) {
        const options = {
            method: "GET",
            path: "participants/token/" + participantToken,
        };
        return this.request(options);
    }
    participate(participantToken) {
        let options = {
            method: "GET",
            path: "studies/" + this.studyId + "/participate"
        };
        if (participantToken) {
            options = {
                method: "GET",
                path: "studies/" + this.studyId + "/participate/" + participantToken
            };
        }
        return this.request(options);
    }
    setLoggerKey(loggerKey) {
        this.loggerKey = loggerKey;
    }
    storeTokens(responseJson) {
        localStorage.setItem("tokens", JSON.stringify(responseJson));
    }
    updateAccessToken(responseJson) {
        const tokens = this.readTokens();
        tokens["access_token"] = responseJson["access_token"];
        this.storeTokens(tokens);
    }
    readTokens(key = null) {
        let tokens = localStorage.getItem("tokens");
        if (tokens) {
            tokens = JSON.parse(tokens);
            if (key) {
                return tokens[key];
            }
            return tokens;
        }
        return null;
    }
    deleteTokens() {
        localStorage.removeItem("tokens");
    }
    refreshToken() {
        const options = {
            method: "GET",
            path: "participants/refresh",
            headers: {}
        };
        this.setHeaders(options, true);
        return this.request(options);
    }
    me() {
        const options = {
            method: "GET",
            path: "participants/me",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getProcedure(procedureId) {
        const options = {
            method: "GET",
            path: "procedures/" + procedureId,
            headers: {}
        };
        this.setHeaders(options);
        console.log(options);
        return this.request(options);
    }
    // Helper method to create bulks from interaction lists
    buildBulkList(interactionList, bulkSize = 10) {
        const bulks = [];
        while (this[interactionList].length > bulkSize) {
            bulks.push(this[interactionList].splice(0, bulkSize));
        }
        if (this[interactionList].length > 0) {
            bulks.push(this[interactionList].splice(0, this[interactionList].length));
        }
        return bulks;
    }
    // TODO: type callback correctly, starting point could be (conditionId: number, interactions: object[]) => Promise<any>
    logInteractionBulk(path, conditionId, interactionList, bulkSize, logInteractionBulkRequest) {
        const interactionBulks = this.buildBulkList(interactionList, bulkSize);
        const interactionBulkRequests = [];
        for (let i = 0; i < interactionBulks.length; i++) {
            interactionBulkRequests.push(logInteractionBulkRequest(path, conditionId, interactionBulks[i]));
        }
        return Promise.allSettled(interactionBulkRequests);
    }
    logInteractionBulkRequest(path, conditionId, interactions) {
        const options = {
            method: "POST",
            path: path,
            headers: {}
        };
        this.setLoggerHeaders(options);
        options.body = {
            condition_id: conditionId,
            interactions: interactions
        };
        return this.request(options);
    }
    logInteractionRequest(path, conditionId, interaction) {
        const options = {
            method: "POST",
            path: path,
            headers: {}
        };
        this.setLoggerHeaders(options);
        options.body = {
            condition_id: conditionId,
            interaction: interaction
        };
        return this.request(options);
    }
    // Mouse Interaction
    logMouseInteraction(conditionId, eventType, mouseEvent, timestamp, relatedTarget = {}, metaData = {}) {
        const interaction = new MouseInteraction(eventType, timestamp, mouseEvent, relatedTarget, metaData);
        const path = "interaction/mouse";
        return this.logInteractionRequest(path, conditionId, interaction);
    }
    addMouseInteraction(eventType, mouseEvent, timestamp, relatedTarget = {}, metaData = {}) {
        this.mouseInteractionList.push(new MouseInteraction(eventType, timestamp, mouseEvent, relatedTarget, metaData));
    }
    logMouseInteractionBulk(conditionId, bulkSize = 10) {
        const interactionType = "mouseInteractionList";
        const path = "interaction/mouse/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }
    // Drag Interaction
    logDragInteraction(conditionId, eventType, dragEvent, timestamp, relatedTarget = {}, metaData = {}) {
        const interaction = new DragInteraction(eventType, timestamp, dragEvent, relatedTarget, metaData);
        const path = "interaction/drag";
        return this.logInteractionRequest(path, conditionId, interaction);
    }
    addDragInteraction(eventType, dragEvent, timestamp, relatedTarget = {}, metaData = {}) {
        this.dragInteractionList.push(new DragInteraction(eventType, timestamp, dragEvent, relatedTarget, metaData));
    }
    logDragInteractionBulk(conditionId, bulkSize = 10) {
        const interactionType = "dragInteractionList";
        const path = "interaction/drag/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }
    // Keyboard Interaction
    logKeyboardInteraction(conditionId, eventType, keyboardEvent, timestamp, metaData = {}) {
        const interaction = new KeyboardInteraction(eventType, timestamp, keyboardEvent, metaData);
        const path = "interaction/keyboard";
        return this.logInteractionRequest(path, conditionId, interaction);
    }
    addKeyboardInteraction(eventType, keyboardEvent, timestamp, metaData = {}) {
        this.keyboardInteractionList.push(new KeyboardInteraction(eventType, timestamp, keyboardEvent, metaData));
    }
    logKeyboardInteractionBulk(conditionId, bulkSize = 10) {
        const interactionType = "keyboardInteractionList";
        const path = "interaction/keyboard/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }
    // Touch Interaction
    logTouchInteraction(conditionId, eventType, touchEvent, timestamp, metaData = {}) {
        const interaction = new TouchInteraction(eventType, timestamp, touchEvent, metaData);
        const path = "interaction/touch";
        return this.logInteractionRequest(path, conditionId, interaction);
    }
    addTouchInteraction(eventType, touchEvent, timestamp, metaData = {}) {
        this.touchInteractionList.push(new TouchInteraction(eventType, timestamp, touchEvent, metaData));
    }
    logTouchInteractionBulk(conditionId, bulkSize = 10) {
        const interactionType = "touchInteractionList";
        const path = "interaction/touch/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }
    // Generic Interaction
    logGenericInteraction(conditionId, eventType, genericEvent, timestamp, metaData = {}) {
        const interaction = new GenericInteraction(eventType, timestamp, genericEvent, metaData);
        const path = "interaction/generic";
        return this.logInteractionRequest(path, conditionId, interaction);
    }
    addGenericInteraction(eventType, genericEvent, timestamp, metaData = {}) {
        this.genericInteractionList.push(new GenericInteraction(eventType, timestamp, genericEvent, metaData));
    }
    logGenericInteractionBulk(conditionId, bulkSize = 10) {
        const interactionType = "genericInteractionList";
        const path = "interaction/generic/bulk";
        return this.logInteractionBulk(path, conditionId, interactionType, bulkSize, this.logInteractionBulkRequest.bind(this));
    }
    // Meta Interaction (Same as Generic Interaction but without condition_id
    logMetaInteraction(eventType, genericEvent, timestamp, metaData = {}) {
        const interaction = new GenericInteraction(eventType, timestamp, genericEvent, metaData);
        const path = "interaction/meta";
        return this.logInteractionRequest(path, null, interaction);
    }
    // Procedure related methods
    startProcedure() {
        const options = {
            method: "GET",
            path: "procedures/start",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    nextProcedure() {
        const options = {
            method: "GET",
            path: "procedures/next",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    endProcedure() {
        const options = {
            method: "GET",
            path: "procedures/end",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    currentProcedureStep() {
        const options = {
            method: "GET",
            path: "procedure-steps",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    checkSurveyResult() {
        const options = {
            method: "GET",
            path: "procedures/check-survey-result",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    startNavigator() {
        return new Promise((resolve, reject) => {
            // get the user token (uuid)
            this.me().then(response => {
                if (response.body) {
                    const participantToken = response.body.token;
                    const url = this.apiUrl + "/" + "procedures/navigator?participant=" + participantToken;
                    this.sse = new EventSource(url, { withCredentials: true });
                    resolve(true);
                }
                reject({
                    text: "Participant not found"
                });
            }).catch(error => {
                console.log(error);
                resolve(error);
            });
        });
    }
    closeNavigator() {
        this.sse.close();
    }
    reconnectNavigator() {
        const options = {
            method: "GET",
            path: "procedures/navigator/reconnect",
            headers: {}
        };
        this.setHeaders(options);
        return this.request(options);
    }
    getNavigator() {
        return this.sse;
    }
    updateNavigator(participantToken, source, state, extId) {
        const options = {
            method: "POST",
            path: "procedures/navigator",
            headers: {
                "Content-type": "application/json"
            }
        };
        options.body = {
            participant_token: participantToken,
            source: source,
            state: state,
            ext_id: extId
        };
        return this.request(options);
    }
}
StudyAlignLib.getParamsFromURL = () => {
    const url = new URL(window.location.href);
    const studyId = url.searchParams.get("study_id");
    const conditionId = url.searchParams.get("condition_id") || 1; // value from get parameter or 1 (default)
    const loggerKey = url.searchParams.get("logger_key"); // needed for logging
    const participantToken = url.searchParams.get("participant_token");
    return {
        studyId: studyId,
        conditionId: conditionId,
        loggerKey: loggerKey,
        participantToken: participantToken
    };
};
export default StudyAlignLib;
//# sourceMappingURL=study-align-lib.js.map