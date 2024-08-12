import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    apiWithAuth,
    createProcedureConfigBlockApi,
    deleteProcedureConfigBlockApi
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    block: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

//async thunks
export const createBlock = createAsyncThunk(
    'createBlock',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().blocks
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(createProcedureConfigBlockApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const deleteBlock = createAsyncThunk(
    'deleteBlock',
    async (blockId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().blocks
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(deleteProcedureConfigBlockApi, blockId, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// reducers
export const blockSlice = createSlice({
    name: 'blocks',
    initialState,
    reducers: {
        // REDUCERS THAT DO NOT DEPEND ON API CALLS GO HERE
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBlock.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(createBlock.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.block = action.payload.body
                }
            })
            .addCase(deleteBlock.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(deleteBlock.fulfilled, (state, action) => {
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

export const selectBlock = (state) => {
    return state.blocks.block;
}

export const selectBlockApiStatus = (state) => {
    return state.blocks.status
}

export default blockSlice.reducer;