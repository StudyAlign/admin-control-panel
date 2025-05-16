import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    apiWithAuth,
    getInteractionsApi,
    getInteractionCountApi,
    getInteractionCountsApi,
    getInteractionExportApi,
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    all: {
        items: null,
        count: null,
    },
    generic: {
        items: null,
        count: null,
    },
    drag: {
        items: null,
        count: null,
    },
    keyboard: {
        items: null,
        count: null,
    },
    mouse: {
        items: null,
        count: null,
    },
    touch: {
        items: null,
        count: null,
    },
    //
    export: {
        status: IDLE,
        data: null,
        error: null,
    },
    //
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
            args.type = "generic";
            const [interactionsResponse, countResponse] = await Promise.all([
                apiWithAuth(getInteractionsApi, args, dispatch),
                apiWithAuth(getInteractionCountApi, args, dispatch)
            ]);
            return {
                interactions: interactionsResponse,
                count: countResponse
            };
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
            const [interactionsResponse, countResponse] = await Promise.all([
                apiWithAuth(getInteractionsApi, args, dispatch),
                apiWithAuth(getInteractionCountApi, args, dispatch)
            ]);
            return {
                interactions: interactionsResponse,
                count: countResponse
            };
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
            const [interactionsResponse, countResponse] = await Promise.all([
                apiWithAuth(getInteractionsApi, args, dispatch),
                apiWithAuth(getInteractionCountApi, args, dispatch)
            ]);
            return {
                interactions: interactionsResponse,
                count: countResponse
            };
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
            const [interactionsResponse, countResponse] = await Promise.all([
                apiWithAuth(getInteractionsApi, args, dispatch),
                apiWithAuth(getInteractionCountApi, args, dispatch)
            ]);
            return {
                interactions: interactionsResponse,
                count: countResponse
            };
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
            const [interactionsResponse, countResponse] = await Promise.all([
                apiWithAuth(getInteractionsApi, args, dispatch),
                apiWithAuth(getInteractionCountsApi, args, dispatch)
            ]);
            return {
                interactions: interactionsResponse,
                count: countResponse
            };
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
            const [interactionsResponse, countResponse] = await Promise.all([
                apiWithAuth(getInteractionsApi, args, dispatch),
                apiWithAuth(getInteractionCountsApi, args, dispatch)
            ]);
            return {
                interactions: interactionsResponse,
                count: countResponse
            };
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getInteractionExport = createAsyncThunk(
    'getInteractionExport',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().interactions
        if (requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getInteractionExportApi, args, dispatch)
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
            state.all = {
                items: null,
                count: null,
            }
            state.generic = {
                items: null,
                count: null,
            }
            state.drag = {
                items: null,
                count: null,
            }
            state.keyboard = {
                items: null,
                count: null,
            }
            state.mouse = {
                items: null,
                count: null,
            }
            state.touch = {
                items: null,
                count: null,
            }
        },
        resetGenericInteraction: (state, _action) => {
            state.generic = {
                items: null,
                count: null,
            }
        },
        resetDragInteraction: (state, _action) => {
            state.drag = {
                items: null,
                count: null,
            }
        },
        resetKeyboardInteraction: (state, _action) => {
            state.keyboard = {
                items: null,
                count: null,
            }
        },
        resetMouseInteraction: (state, _action) => {
            state.mouse = {
                items: null,
                count: null,
            }
        },
        resetTouchInteraction: (state, _action) => {
            state.touch = {
                items: null,
                count: null,
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // export
            .addCase(getInteractionExport.pending, (state, action) => {
                state.currentRequestId = action.meta.requestId
                state.export = {
                    status: LOADING,
                    data: null,
                    error: null
                }
            })
            .addCase(getInteractionExport.fulfilled, (state, action) => {
                state.currentRequestId = undefined
                state.export = {
                    status: IDLE,
                    data: action.payload.body,
                    error: null
                }
            })
            .addCase(getInteractionExport.rejected, (state, _) => {
                state.currentRequestId = undefined
                state.export = {
                    status: IDLE,
                    data: null,
                    error: true // action.error.message
                }
            })
            // generic
            .addCase(getGenericInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getGenericInteractions.fulfilled, (state, action) => {
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.generic = {
                    items: action.payload.interactions.body,
                    count: action.payload.count.body
                };
            })
            .addCase(getGenericInteractions.rejected, (state, _) => {
                state.api = IDLE
                state.currentRequestId = undefined
                state.generic = {
                    items: null,
                    count: 0
                };
            })
            // drag
            .addCase(getDragInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getDragInteractions.fulfilled, (state, action) => {
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.drag = {
                    items: action.payload.interactions.body,
                    count: action.payload.count.body
                };
            })
            .addCase(getDragInteractions.rejected, (state, _) => {
                state.api = IDLE
                state.currentRequestId = undefined
                state.drag = {
                    items: null,
                    count: 0
                };
            })
            // mouse
            .addCase(getMouseInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getMouseInteractions.fulfilled, (state, action) => {
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.mouse = {
                    items: action.payload.interactions.body,
                    count: action.payload.count.body
                };
            })
            .addCase(getMouseInteractions.rejected, (state, _) => {
                state.api = IDLE
                state.currentRequestId = undefined
                state.mouse = {
                    items: null,
                    count: 0
                };
            })
            // keyboard
            .addCase(getKeyboardInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getKeyboardInteractions.fulfilled, (state, action) => {
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.keyboard = {
                    items: action.payload.interactions.body,
                    count: action.payload.count.body
                };
            })
            .addCase(getKeyboardInteractions.rejected, (state, _) => {
                state.api = IDLE
                state.currentRequestId = undefined
                state.keyboard = {
                    items: null,
                    count: 0
                };
            })
            // touch
            .addCase(getTouchInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getTouchInteractions.fulfilled, (state, action) => {
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.touch = {
                    items: action.payload.interactions.body,
                    count: action.payload.count.body
                };
            })
            .addCase(getTouchInteractions.rejected, (state, _) => {
                state.api = IDLE
                state.currentRequestId = undefined
                state.touch = {
                    items: null,
                    count: 0
                };
            })
            // all
            .addCase(getAllInteractions.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getAllInteractions.fulfilled, (state, action) => {
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.all = {
                    items: action.payload.interactions.body,
                    count: action.payload.count.body
                };
            })
            .addCase(getAllInteractions.rejected, (state, _) => {
                state.api = IDLE
                state.currentRequestId = undefined
                state.all = {
                    items: null,
                    count: 0
                };
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

export const selectExportInteraction = (state) => {
    return state.interactions.export
}

// export status
export const selectStatus = (state) => {
    return state.interactions.api
}

export default interactionSlice.reducer;