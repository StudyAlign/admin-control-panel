import React, {createContext, useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from './app/login/Login';
import ForgotPW from './app/login/ForgotPW';
import ResetPW from './app/login/ResetPW';
import Dashboard from './app/dashboard/Dashboard';
import StudyOverviewLayout from "./app/study_overview/StudyOverviewLayout";
import RequireAuth, {AuthRoute, AuthProvider, useAuth} from "./components/Auth";
import {useDispatch, useSelector, useStore} from "react-redux";
import {
    authSlice,
} from "./redux/reducers/authSlice";


export default function App() {
    const dispatch = useDispatch();
    const store = useStore();

    const [init, setInit] = useState(false);
    if (!init) {
        //Init StudyAlignApi and read tokens
        dispatch(authSlice.actions.initApi())
        //TODO: Do we need to read tokens into redux store?
        dispatch(authSlice.actions.readTokens())
        setInit(true)
    }

    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<RequireAuth />}>

                    </Route>
                    <Route path="/" element={<Dashboard/>} />
                    <Route path="/study/:study_id/:page"    element={<StudyOverviewLayout/>} />


                    <Route path="/login"                    element={<Login/>} />
                    <Route path="/logout"                   element={<Login logout/>} />
                    <Route path="/login/forgot"             element={<ForgotPW/>} />
                    <Route path="/login/reset"              element={<ResetPW/>} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
