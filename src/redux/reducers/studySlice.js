import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    apiWithAuth,
    getStudiesApi,
    createStudyApi,
    getStudyApi,
    getStudySetupInfoApi,
    updateStudyApi,
    deleteStudyApi,
    getProcedureConfigMainApi, // Get Procedure Config
    getProcedureConfigOverviewApi, // Get Procedure Config Overview
    createSingleProcedureConfigStepApi, // Create Procedure Config Step
    updateProcedureConfigApi, // Update Procedure Config
    exportStudySchemaApi,
    importStudySchemaApi,
    duplicateStudyApi,
    generateProceduresWithStepsApi,
    generateParticipantsApi,
    // populateSurveyParticipantsApi, // DEPRECATED
    addParticipantsApi,
} from "../../api/studyAlignApi";
import { LOADING, IDLE } from "../apiStates";

const initialState = {
    studies: null,
    study: null,
    studySetupInfo: null,
    studyProcedure: null, // Procedure Config State
    procedureOverview: null, // Procedure Config Overview State
    studyExport: null,
    api: IDLE,
    error: null,
    status: null,
    currentRequestId: undefined
};

//async thunks
export const getStudies = createAsyncThunk(
    'getStudies',
    async (arg, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getStudiesApi, arg, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getStudy = createAsyncThunk(
    'getStudy',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getStudyApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const getStudySetupInfo = createAsyncThunk(
    'getStudySetupInfo',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getStudySetupInfoApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const createStudy = createAsyncThunk(
    'createStudy',
    async (arg, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(createStudyApi, arg, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const updateStudy = createAsyncThunk(
    'updateStudy',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(updateStudyApi, args, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const deleteStudy = createAsyncThunk(
    'deleteStudy',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(deleteStudyApi, studyId, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// create procedure config step
export const createSingleProcedureConfigStep = createAsyncThunk(
    'createSingleProcedureConfigStep',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(createSingleProcedureConfigStepApi, args, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// get procedure config
export const getProcedureConfig = createAsyncThunk(
    'getProcedureConfig',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getProcedureConfigMainApi, studyId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// get procedure config
export const getProcedureConfigOverview = createAsyncThunk(
    'getProcedureConfigOverview',
    async (procedureConfigId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(getProcedureConfigOverviewApi, procedureConfigId, dispatch)
            return response
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// update procedure config
export const updateProcedure = createAsyncThunk(
    'updateProcedure',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(updateProcedureConfigApi, args, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const importStudySchema = createAsyncThunk(
    'importStudySchema',
    async (studySchema, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            return await apiWithAuth(importStudySchemaApi, studySchema, dispatch)
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const exportStudySchema = createAsyncThunk(
    'exportStudySchema',
    async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            return await apiWithAuth(exportStudySchemaApi, studyId, dispatch)
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const generateProceduresWithSteps = createAsyncThunk(
    'generateProceduresWithSteps',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(generateProceduresWithStepsApi, args, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

export const generateParticipants = createAsyncThunk(
    'generateParticipants',
    async (args, { dispatch, getState, rejectWithValue, requestId}) => {
        const { api, currentRequestId } = getState().studies
        if (api !== LOADING || requestId !== currentRequestId) {
            return
        }
        try {
            const response = await apiWithAuth(generateParticipantsApi, args, dispatch)
            return response;
        } catch (err) {
            return rejectWithValue(err)
        }
    }
);

// DEPRECATED
// export const populateSurveyParticipants = createAsyncThunk(
//     'populateSurveyParticipants',
//     async (studyId, { dispatch, getState, rejectWithValue, requestId}) => {
//         const { api, currentRequestId } = getState().studies
//         if (api !== LOADING || requestId !== currentRequestId) {
//             return
//         }
//         try {
//             const response = await apiWithAuth(populateSurveyParticipantsApi, studyId, dispatch)
//             return response;
//         } catch (err) {
//             return rejectWithValue(err)
//         }
//     }
// );

// reducers
export const studySlice = createSlice({
    name: 'studies',
    initialState,
    reducers: {
        // REDUCERS THAT DO NOT DEPEND ON API CALLS GO HERE
        resetStudySetupInfo: (state, _action) => {
            state.studySetupInfo = null
        },
        resetProcedureOverview: (state, _action) => {
            state.procedureOverview = null
        },
        resetStudyExport: (state, _action) => {
            state.studyExport = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStudies.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getStudies.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.studies = action.payload.body
                }
            })
            .addCase(getStudy.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getStudy.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.study = action.payload.body
            })
            .addCase(getStudySetupInfo.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getStudySetupInfo.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.studySetupInfo = action.payload.body
            })
            .addCase(getStudySetupInfo.rejected, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    //state.studySetupInfo = action.payload.body
                }
            })
            .addCase(createStudy.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(createStudy.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.study = action.payload.body
                }
            })
            .addCase(updateStudy.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(updateStudy.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            .addCase(deleteStudy.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(deleteStudy.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            // Procedure Config Overview
            .addCase(getProcedureConfigOverview.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getProcedureConfigOverview.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.procedureOverview = action.payload.body
            })
            //
            // Procedure Config Cases
            .addCase(getProcedureConfig.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(getProcedureConfig.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.studyProcedure = action.payload.body
            })
            //
            // Add Procedure Config step Cases
            .addCase(createSingleProcedureConfigStep.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(createSingleProcedureConfigStep.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    //state.studyProcedure = action.payload.body
                }
            })
            //
            // Update Procedure Config Cases
            .addCase(updateProcedure.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(updateProcedure.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            //
            // Export Study Schema Cases
            .addCase(exportStudySchema.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(exportStudySchema.fulfilled, (state, action) => {
                const { requestId } = action.meta
                state.api = IDLE
                state.status = action.payload.status
                state.currentRequestId = undefined
                state.studyExport = action.payload.body
            })
            //
            // Import Study Schema Cases
            .addCase(importStudySchema.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(importStudySchema.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                    state.study = action.payload.body
                }
            })
            //
            .addCase(generateProceduresWithSteps.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(generateProceduresWithSteps.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            .addCase(generateParticipants.pending, (state, action) => {
                state.api = LOADING
                state.currentRequestId = action.meta.requestId
            })
            .addCase(generateParticipants.fulfilled, (state, action) => {
                const { requestId } = action.meta
                if (state.api === LOADING && state.currentRequestId === requestId) {
                    state.api = IDLE
                    state.status = action.payload.status
                    state.currentRequestId = undefined
                }
            })
            // .addCase(populateSurveyParticipants.pending, (state, action) => {
            //     state.api = LOADING
            //     state.currentRequestId = action.meta.requestId
            // })
            // .addCase(populateSurveyParticipants.fulfilled, (state, action) => {
            //     const { requestId } = action.meta
            //     if (state.api === LOADING && state.currentRequestId === requestId) {
            //         state.api = IDLE
            //         state.status = action.payload.status
            //         state.currentRequestId = undefined
            //     }
            // })

    },
});


// selectors

export const selectStudies = (state) => {
    return state.studies.studies;
}

export const selectStudy = (state) => {
    return state.studies.study;
}

export const selectStudySetupInfo = (state) => {
    return state.studies.studySetupInfo;
}

export const selectStudyExport = (state) => {
    return state.studies.studyExport;
}

export const selectStudyApiStatus = (state) => {
    return state.studies.status
}

export const selectStudyProcedure = (state) => {
    return state.studies.studyProcedure
}

export const selectStudyProcedureOverview = (state) => {
    return state.studies.procedureOverview
}

export default studySlice.reducer;