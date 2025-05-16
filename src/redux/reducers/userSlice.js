import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    apiWithAuth,
    getUsersApi,
    getUsersCountApi,
    getUserApi,
    createUserApi,
    updateUserApi,
    deleteUserApi,
    getRolesApi,
    // Collabs
    getCollaboratorsApi,
    createCollaboratorApi,
    deleteCollaboratorApi,
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    users: {
        items: null,
        count: null,
    },
    user: null,
    collaborators: null,
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
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().users
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const [usersResponse, countResponse] = await Promise.all([
                apiWithAuth(getUsersApi, args, dispatch),
                apiWithAuth(getUsersCountApi, args, dispatch)
            ]);
            return {
                users: usersResponse,
                count: countResponse
            };
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

export const getCollaborators = createAsyncThunk(
    'getCollaborators',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().users
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getCollaboratorsApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const createCollaborator = createAsyncThunk(
    'createCollaborator',
    async (collaborator, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().users
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(createCollaboratorApi, collaborator, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const deleteCollaborator = createAsyncThunk(
    'deleteCollaborator',
    async (collaboratorId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().users
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(deleteCollaboratorApi, collaboratorId, dispatch)
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
        resetAllUsers: (state, _) => {
            state.users = {
                items: null,
                count: null,
            }
        },
        resetCollaborators: (state, _) => {
            state.collaborators = null
        },
        resetUser: (state, _) => {
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
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.users = {
                    items: action.payload.users.body,
                    count: action.payload.count.body,
                };
            })
            // .addCase(getUsers.rejected, (state, _) => {
            //     state.api = IDLE
            //     state.currentRequestId = undefined
            //     state.users = {
            //         items: null,
            //         count: 0
            //     }
            // })
            //
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
            //
            .addCase(getCollaborators.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getCollaborators.fulfilled, (state, action) => {
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.collaborators = action.payload.body
            })
            .addCase(createCollaborator.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(createCollaborator.fulfilled, (state, action) => {
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
            })
            .addCase(deleteCollaborator.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(deleteCollaborator.fulfilled, (state, action) => {
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
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

export const selectCollaborators = (state) => {
    return state.users.collaborators;
}

// export api status
export const selectUserApiStatus = (state) => {
    return state.users.api;
}

export default userSlice.reducer;