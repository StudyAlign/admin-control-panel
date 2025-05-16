import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {unwrapResult} from "@reduxjs/toolkit";

import {
    me,
    selectUser,
    selectUserApi,
    selectUserTokens,
    authSlice,
    selectIsAuthenticated,
    selectUserError,
} from "../redux/reducers/authSlice";

import LoadingScreen from "./LoadingScreen";


const {createContext} = require("react");
const {useContext} = require("react");

const authContext = createContext();

function useProvideAuth() {
    const isAuthenticated = useSelector(selectIsAuthenticated)
    const user = useSelector(selectUser)
    const userApi = useSelector(selectUserApi)
    const tokens = useSelector(selectUserTokens)
    const error = useSelector(selectUserError)

    return {
        isAuthenticated,
        user,
        userApi,
        tokens,
        error,
    }
}

export function AuthProvider({children}) {
    const auth = useProvideAuth()
    return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    )
}

export function useAuth() {
    return useContext(authContext)
}

export default function RequireAuth({ role = 0 }) {
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

    // Errors happening while authenticated
    if (auth.error && auth.error.status && auth.isAuthenticated) {
        return <Navigate to={`/error/${auth.error.status}`} replace />;
    }

    if (role === 1) {
        return auth && auth.isAuthenticated && auth.user.role_id === 1 ? <Outlet /> : <Navigate to="/error/403" replace />;
    } else {
        return auth && auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
    }
}
