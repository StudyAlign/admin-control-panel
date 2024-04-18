import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    apiWithAuth,
    getQuestionnairesApi,
    getQuestionnaireApi,
    createQuestionnaireApi,
    updateQuestionnaireApi, deleteTextApi, deleteQuestionnaireApi,
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";
import {getPauses} from "./pauseSlice";

const initialState = {
    questionnaires: null,
    questionnaire: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

//async thunks
export const getQuestionnaires = createAsyncThunk(
    'getQuestionnaires',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().questionnaires
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getQuestionnairesApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getQuestionnaire = createAsyncThunk(
    'getQuestionnaire',
    async (questionnaireId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().questionnaires
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getQuestionnaireApi, questionnaireId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const createQuestionnaire = createAsyncThunk(
    'createQuestionnaire',
    async (questionnaire, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().questionnaires
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(createQuestionnaireApi, questionnaire, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const updateQuestionnaire = createAsyncThunk(
    'updateQuestionnaire',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().questionnaires
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(updateQuestionnaireApi, args, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const deleteQuestionnaire = createAsyncThunk(
    'deleteQuestionnaire',
    async (questionnaireId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().questionnaires
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(deleteQuestionnaireApi, questionnaireId, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// reducers
export const questionnaireSlice = createSlice({
    name: 'questionnaires',
    initialState,
    reducers: {
        // REDUCERS THAT DO NOT DEPEND ON API CALLS GO HERE
    },
    extraReducers: (builder) => {
        builder
            .addCase(getQuestionnaires.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getQuestionnaires.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.questionnaires = action.payload.body
                }
            })
            .addCase(getQuestionnaires.rejected, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.questionnaires = []
                }
            })
            .addCase(getQuestionnaire.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getQuestionnaire.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.questionnaire = action.payload.body
                }
            })
            .addCase(createQuestionnaire.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(createQuestionnaire.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.questionnaire = action.payload.body
                }
            })
            .addCase(updateQuestionnaire.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(updateQuestionnaire.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            .addCase(deleteQuestionnaire.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(deleteQuestionnaire.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
    },
});


// selectors

export const selectQuestionnaires = (state) => {
    return state.questionnaires.questionnaires;
}

export const selectQuestionnaire = (state) => {
    return state.questionnaires.questionnaire;
}

export const selectQuestionnaireApiStatus = (state) => {
    return state.questionnaires.status
}

export default questionnaireSlice.reducer;