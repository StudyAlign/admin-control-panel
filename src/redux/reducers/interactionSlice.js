import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    apiWithAuth,
    getInteractions
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    all: null,
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

export const getGenericInteractions = createAsyncThunk(
    'getGenericInteractions',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().interactions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            // add type to args
            args.type = "generic"
            const response = await apiWithAuth(getInteractions, args, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getMouseInteractions = createAsyncThunk(
    'getMouseInteractions',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().interactions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            // add type to args
            args.type = "mouse"
            const response = await apiWithAuth(getInteractions, args, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getDragInteractions = createAsyncThunk(
    'getDragInteractions',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().interactions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            // add type to args
            args.type = "drag"
            const response = await apiWithAuth(getInteractions, args, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getKeyboardInteractions = createAsyncThunk(
    'getKeyboardInteractions',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().interactions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            // add type to args
            args.type = "keyboard"
            const response = await apiWithAuth(getInteractions, args, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getTouchInteractions = createAsyncThunk(
    'getTouchInteractions',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().interactions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            // add type to args
            args.type = "touch"
            const response = await apiWithAuth(getInteractions, args, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getAllInteractions = createAsyncThunk(
    'getAllInteractions',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().interactions
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            // add type to args
            args.type = "all"
            const response = await apiWithAuth(getInteractions, args, dispatch)
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
        resetAllInteractions: (state, _action) => {
            state.all = null
            state.generic = null
            state.drag = null
            state.keyboard = null
            state.mouse = null
            state.touch = null
        },
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
            .addCase(getGenericInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getGenericInteractions.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.generic = action.payload.body
            })
            // drag
            .addCase(getDragInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getDragInteractions.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.drag = action.payload.body
            })
            // mouse
            .addCase(getMouseInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getMouseInteractions.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.mouse = action.payload.body
            })
            // keyboard
            .addCase(getKeyboardInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getKeyboardInteractions.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.keyboard = action.payload.body
            })
            // touch
            .addCase(getTouchInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getTouchInteractions.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.touch = action.payload.body
            })
            // all
            .addCase(getAllInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getAllInteractions.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.all = action.payload.body
            })
    },
});

// selectors

export const selectAllInteractions = (state) => {
    return state.interactions.all
}

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