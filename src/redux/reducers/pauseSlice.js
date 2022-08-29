import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    apiWithAuth,
    getPausesApi,
    getPauseApi,
    createPauseApi,
    updatePauseApi,
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";
import {getConditions} from "./conditionSlice";

const initialState = {
    pauses: null,
    pause: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

//async thunks
export const getPauses = createAsyncThunk(
    'getPauses',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().pauses
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getPausesApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getPause = createAsyncThunk(
    'getPause',
    async (pauseId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().pauses
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getPauseApi, pauseId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const createPause = createAsyncThunk(
    'createPause',
    async (pause, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().pauses
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(createPauseApi, pause, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const updatePause = createAsyncThunk(
    'updatePause',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().pauses
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(updatePauseApi, args, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// reducers
export const pauseSlice = createSlice({
    name: 'pauses',
    initialState,
    reducers: {
        // REDUCERS THAT DO NOT DEPEND ON API CALLS GO HERE
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPauses.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getPauses.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.pauses = action.payload.body
                }
            })
            .addCase(getPauses.rejected, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.pauses = []
                }
            })
            .addCase(getPause.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getPause.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.pause = action.payload.body
                }
            })
            .addCase(createPause.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(createPause.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.pause = action.payload.body
                }
            })
            .addCase(updatePause.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(updatePause.fulfilled, (state, action) => {
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

export const selectPauses = (state) => {
    return state.pauses.pauses;
}

export const selectPause = (state) => {
    return state.pauses.pause;
}

export const selectPauseApiStatus = (state) => {
    return state.pauses.status
}

export default pauseSlice.reducer;