import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    apiWithAuth,
    getFirst100InteractionsApi // Get First 100 Interactions
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    generic: null,
    drag: null,
    keyboard: null,
    mouse: null,
    touch: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

export const getFirst100GenericInteractions = createAsyncThunk(
    'getFirst100GenericInteractions',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().interactions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getFirst100InteractionsApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// reducers
export const interactionSlice = createSlice({
    name: 'interactions',
    initialState,
    reducers: {
        // REDUCERS THAT DO NOT DEPEND ON API CALLS GO HERE
        resetGenericInteraction: (state, _action) => {
            state.generic = null
        },
        resetDragInteraction: (state, _action) => {
            state.drag = null
        },
        resetKeyboardInteraction: (state, _action) => {
            state.keyboard = null
        },
        resetMouseInteraction: (state, _action) => {
            state.mouse = null
        },
        resetTouchInteraction: (state, _action) => {
            state.touch = null
        },
    },
    extraReducers: (builder) => {
        builder
            // generic
            .addCase(getFirst100GenericInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getFirst100GenericInteractions.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.generic = action.payload.body
            })

    },
});

// selectors

export const selectGenericInteraction = (state) => {
    return state.interactions.generic
}

export const selectDragInteraction = (state) => {
    return state.interactions.drag
}

export const selectKeyboardInteraction = (state) => {
    return state.interactions.keyboard
}

export const selectMouseInteraction = (state) => {
    return state.interactions.mouse
}

export const selectTouchInteraction = (state) => {
    return state.interactions.touch
}

export default interactionSlice.reducer;