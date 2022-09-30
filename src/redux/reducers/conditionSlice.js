import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    apiWithAuth,
    createConditionApi, deleteConditionApi,
    getConditionApi,
    getConditionIdsApi,
    getConditionsApi,
    updateConditionApi,
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";
import {getStudySetupInfo} from "./studySlice";

const initialState = {
    conditionIds: null,
    conditions: null,
    condition: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

//async thunks
export const getConditionIds = createAsyncThunk(
    'getConditionIds',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().conditions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getConditionIdsApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getConditions = createAsyncThunk(
    'getConditions',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().conditions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getConditionsApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getCondition = createAsyncThunk(
    'getCondition',
    async (conditionId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().conditions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getConditionApi, conditionId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const createCondition = createAsyncThunk(
    'createCondition',
    async (condition, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().conditions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(createConditionApi, condition, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const updateCondition = createAsyncThunk(
    'updateCondition',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().conditions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(updateConditionApi, args, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const deleteCondition = createAsyncThunk(
    'deleteCondition',
    async (conditionId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().conditions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(deleteConditionApi, conditionId, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// reducers
export const conditionSlice = createSlice({
    name: 'conditions',
    initialState,
    reducers: {
        // REDUCERS THAT DO NOT DEPEND ON API CALLS GO HERE
    },
    extraReducers: (builder) => {
        builder
            .addCase(getConditionIds.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getConditionIds.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.conditionIds = action.payload.body
                }
            })
            .addCase(getConditions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getConditions.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.conditions = action.payload.body
                }
            })
            .addCase(getConditions.rejected, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.conditions = []
                }
            })
            .addCase(getCondition.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getCondition.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.condition = action.payload.body
                }
            })
            .addCase(createCondition.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(createCondition.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.condition = action.payload.body
                }
            })
            .addCase(updateCondition.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(updateCondition.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            .addCase(deleteCondition.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(deleteCondition.fulfilled, (state, action) => {
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

export const selectConditionIds = (state) => {
    return state.conditions.conditionIds;
}

export const selectConditions = (state) => {
    return state.conditions.conditions;
}

export const selectCondition = (state) => {
    return state.conditions.condition;
}

export const selectConditionApiStatus = (state) => {
    return state.conditions.status
}

export default conditionSlice.reducer;