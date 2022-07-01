import React, {useEffect, useState} from "react";
import {
    Navigate, Outlet,
    Route, Routes, useLocation, useNavigate
} from "react-router-dom";
import {useDispatch, useSelector, useStore} from "react-redux";
import {
    me,
    refreshToken,
    selectUser,
    selectUserApi,
    selectUserTokens,
    authSlice,
    selectIsAuthenticated
} from "../redux/reducers/authSlice";
import LoadingScreen from "./LoadingScreen";
import {unwrapResult} from "@reduxjs/toolkit";

const {createContext} = require("react");
const {useContext} = require("react");

const authContext = createContext();

function useProvideAuth() {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const user = useSelector(selectUser)
    const userApi = useSelector(selectUserApi)
    const tokens = useSelector(selectUserTokens)

    return {
        isAuthenticated,
        user,
        userApi,
        tokens
    };
}

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

export default function RequireAuth() {
    const auth = useAuth()
    const location = useLocation();
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true)

    // Reauthenticate, e.g. if app gets refreshed in the browser
    useEffect(( ) => {
        console.log("Reauthenticate")
        reAuthenticate()
    }, [])

    // make a "me" call to retrieve the user profile
    // if successful, tokens worked, set isAuthenticated to true
    const reAuthenticate = async () => {
        try {
            unwrapResult(await dispatch(me())) // unwrapResult needed to throw exception on error, the next lines will then be skipped
            dispatch(authSlice.actions.setIsAuthenticated())
        } catch (err) {
            console.log(err)
        }
        setIsLoading(false)
    }

    if (isLoading) {
        return <LoadingScreen text={"Log in..."}/>
    }
    return auth && auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}
