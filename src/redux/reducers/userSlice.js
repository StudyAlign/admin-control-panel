import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    apiWithAuth,
    getUsersApi,
    getUserApi,
    createUserApi,
    updateUserApi,
    deleteUserApi,
    getRolesApi
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    users: null,
    user: null,
    userState: null,
    roles: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

//async thunks
export const getRoles = createAsyncThunk(
    'getRoles',
    async (arg, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().users
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getRolesApi, arg, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getUsers = createAsyncThunk(
    'getUsers',
    async (arg, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().users
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getUsersApi, arg, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getUser = createAsyncThunk(
    'getUser',
    async (userId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().users
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getUserApi, userId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const updateUser = createAsyncThunk(
    'updateUser',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().users
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(updateUserApi, args, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const createUser = createAsyncThunk(
    'createUser',
    async (arg, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().users
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(createUserApi, arg, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const deleteUser = createAsyncThunk(
    'deleteUser',
    async (userId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().users
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(deleteUserApi, userId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// reducers
export const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        // REDUCERS THAT DO NOT DEPEND ON API CALLS GO HERE
        resetAllUsers: (state, _action) => {
            state.users = null
        },
        resetUser: (state, _action) => {
            state.user = null
        },
        setUserProcess: (state, action) => {
            state.userState = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.users = action.payload.body
            })
            .addCase(getUser.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getUser.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.user = action.payload.body
            })
            .addCase(updateUser.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.user = action.payload.body
            })
            .addCase(createUser.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(createUser.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.user = action.payload.body
            })
            .addCase(deleteUser.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
            })
            //
            .addCase(getRoles.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getRoles.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.roles = action.payload.body
            })
    },
});

// selectors

export const selectRoles = (state) => {
    return state.users.roles;
}

export const selectUsers = (state) => {
    return state.users.users;
}

export const selectUser = (state) => {
    return state.users.user;
}

export const selectUserState = (state) => {
    return state.users.userState;
}

export default userSlice.reducer;