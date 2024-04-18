import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    apiWithAuth,
    getTextsApi,
    getTextApi,
    createTextApi,
    updateTextApi, deleteTextApi,
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";
import {getPauses} from "./pauseSlice";

const initialState = {
    texts: null,
    text: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

//async thunks
export const getTexts = createAsyncThunk(
    'getTexts',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().texts
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getTextsApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getText = createAsyncThunk(
    'getText',
    async (textId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().texts
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getTextApi, textId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const createText = createAsyncThunk(
    'createText',
    async (text, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().texts
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(createTextApi, text, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const updateText = createAsyncThunk(
    'updateText',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().texts
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(updateTextApi, args, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const deleteText = createAsyncThunk(
    'deleteText',
    async (textId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().texts
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(deleteTextApi, textId, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// reducers
export const textSlice = createSlice({
    name: 'texts',
    initialState,
    reducers: {
        // REDUCERS THAT DO NOT DEPEND ON API CALLS GO HERE
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTexts.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getTexts.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.texts = action.payload.body
                }
            })
            .addCase(getTexts.rejected, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.texts = []
                }
            })
            .addCase(getText.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getText.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.text = action.payload.body
                }
            })
            .addCase(createText.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(createText.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.text = action.payload.body
                }
            })
            .addCase(updateText.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(updateText.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            .addCase(deleteText.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(deleteText.fulfilled, (state, action) => {
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

export const selectTexts = (state) => {
    return state.texts.texts;
}

export const selectText = (state) => {
    return state.texts.text;
}

export const selectTextApiStatus = (state) => {
    return state.texts.status
}

export default textSlice.reducer;