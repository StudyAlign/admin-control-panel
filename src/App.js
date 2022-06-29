import React, {createContext, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from './app/login/Login';
import ForgotPW from './app/login/ForgotPW';
import ResetPW from './app/login/ResetPW';
import Dashboard from './app/dashboard/Dashboard';
import RequireAuth, {AuthRoute, AuthProvider} from "./components/Auth";
import {useDispatch} from "react-redux";
import {userSlice} from "./redux/reducers/userSlice";

export default function App() {
    const dispatch = useDispatch()

    useEffect(( ) => {
        dispatch(userSlice.actions.initApi())
    }, [])

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/"             element={<Dashboard/>} />
                    <Route path="/login"        element={<Login/>} />
                    <Route path="/login/forgot" element={<ForgotPW/>} />
                    <Route path="/login/reset"  element={<ResetPW/>} />
                    <Route path="/authtest"     element={<RequireAuth><Dashboard /></RequireAuth>} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
