import { configureStore } from '@reduxjs/toolkit';
import rootReducer from "./reducers"

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore serializability checks for the exported blob payload.
                ignoredActions: ['getInteractionExport/fulfilled'],
                ignoredPaths: ['interactions.export.data'],
            },
        }),
});