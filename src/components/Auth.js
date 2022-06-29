import React from "react";
import {
    Navigate,
    Route, Routes, useLocation
} from "react-router-dom";
import { useSelector} from "react-redux";

const {createContext} = require("react");
const {useContext} = require("react");

const authContext = createContext();

export function AuthProvider({children}) {
    const auth = useProvideAuth()
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext)
}

function useProvideAuth() {

    // TODO: useSelector(selectUser), see example below

    // const participant = useSelector(selectParticipant)
    // const participantStatus = useSelector(selectStudyStatus)
    // const participantError =  useSelector(selectStudyError)
    // const participantApi =  useSelector(selectParticipantApi)
    //
    // return {
    //     participant,
    //     participantStatus,
    //     participantError,
    //     participantApi
    // };
}

export default function RequireAuth({ children }) {
    const auth = useAuth()
    const location = useLocation();
    return auth && auth.user ? children : <Navigate to="/login" state={{ from: location }} replace />;
}
