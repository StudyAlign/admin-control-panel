import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    deleteTokensApi,
    readTokensApi,
    refreshTokenApi,
    storeTokensApi, userLoginApi, userMeApi, initApi, apiWithAuth, getStudiesApi, createStudyApi, getStudyApi
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    studies: null,
    study: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

//async thunks
export const getStudies = createAsyncThunk(
    'getStudies',
    async (arg, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getStudiesApi, arg, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getStudy = createAsyncThunk(
    'getStudy',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getStudyApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const createStudy = createAsyncThunk(
    'createStudy',
    async (arg, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(createStudyApi, arg, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// reducers
export const studySlice = createSlice({
    name: 'studies',
    initialState,
    reducers: {
        // REDUCERS THAT DO NOT DEPEND ON API CALLS GO HERE
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStudies.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getStudies.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.studies = action.payload.body

                }
            })
            .addCase(getStudy.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getStudy.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.study = action.payload.body

                }
            })
            .addCase(createStudy.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(createStudy.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.study = action.payload.body
                }
            })
    },
});


// selectors

export const selectStudies = (state) => {
    return state.studies.studies;
}

export const selectStudy = (state) => {
    return state.studies.study;
}

export default studySlice.reducer;