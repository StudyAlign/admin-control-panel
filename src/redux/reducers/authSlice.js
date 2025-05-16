import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    deleteTokensApi,
    readTokensApi,
    refreshTokenApi,
    storeTokensApi, userLoginApi, userMeApi, initApi, apiWithAuth
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    isAuthenticated: false,
    user: null,
    tokens: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

//async thunks
export const userLogin = createAsyncThunk(
    'userLogin',
    async (data, { getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().auth
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await userLoginApi(data.username, data.password)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const me = createAsyncThunk(
    'me',
    async (arg, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().auth
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(userMeApi, arg, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const refreshToken = createAsyncThunk(
    'refreshToken',
    async (arg, { getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().auth
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await refreshTokenApi()
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);


// reducers
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        initApi(state, action) {
            initApi(action.payload);
        },
        readTokens(state, action) {
            console.log("Read tokens from localstorage")
            state.tokens = readTokensApi()
        },
        deleteTokens(state, action) {
            console.log("Delete tokens from localstorage")
            deleteTokensApi()
            state.tokens = null
        },
        setIsAuthenticated(state, action) {
            state.isAuthenticated = true;
        },
        logout(state, action) {
            console.log("Logging out")
            deleteTokensApi()
            state.tokens = null
            state.user = null
            state.isAuthenticated = false
        },
        setError(state, action) {
            state.error = action.payload
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    const tokens = action.payload.body;
                    state.tokens = tokens;
                    storeTokensApi(tokens);
                    state.status = action.payload.status
                    state.isAuthenticated = true
                    state.currentRequestId = undefined
                }
            })
            .addCase(me.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(me.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.user = action.payload.body
                    state.status = action.payload.status
                    state.isAuthenticated = true
                    state.currentRequestId = undefined
                }
            })
    },
});


// selectors

export const selectIsAuthenticated = (state) => {
    return state.auth.isAuthenticated;
}

export const selectUserTokens = (state) => {
    return state.auth.tokens;
}

export const selectUser = (state) => {
    return state.auth.user;
}

export const selectUserApi = (state) => {
    return state.auth.api;
}

export const selectUserError = (state) => {
    return state.auth.error;
}

export const selectUserStatus = (state) => {
    return state.auth.status;
}


export default authSlice.reducer;