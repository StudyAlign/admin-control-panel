import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    deleteTokensApi,
    getStudyApi,
    meApi,
    getParticipantApi,
    participateApi,
    readTokensApi,
    refreshTokenApi,
    storeTokensApi, updateAccessTokenApi, userLoginApi, userMeApi, initApi
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
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
        const { api, currentRequestId } = getState().user
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
    async (arg, { getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().user
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await userMeApi()
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// reducers
export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        initApi(state, action) {
            initApi(action.payload);
        },
        readTokens(state, action) {
            console.log("read tokens")
            state.tokens = readTokensApi()
        },
        deleteTokens(state, action) {
            console.log("delete tokens")
            deleteTokensApi()
            state.tokens = null
        }
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
                    console.log("save tokens to storage")
                    storeTokensApi(tokens);
                    state.status = action.payload.status
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
                    state.currentRequestId = undefined
                }
            })
    },
});


// selectors

export const selectUser = (state) => {
    return state.user.user;
}


export default userSlice.reducer;