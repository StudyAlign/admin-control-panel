import React from 'react';
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

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/"                         element={<Dashboard/>} />
                <Route path="/login"                    element={<Login/>} />
                <Route path="/login/forgot"             element={<ForgotPW/>} />
                <Route path="/login/reset"              element={<ResetPW/>} />
                <Route path="/study/:study_id/:page"    element={<StudyOverviewLayout/>} />
            </Routes>
        </BrowserRouter>
    );
}
