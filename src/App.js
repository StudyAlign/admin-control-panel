import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import Login from './app/login/Login';
import ForgotPW from './app/login/ForgotPW';
import ResetPW from './app/login/ResetPW';
import Dashboard from './app/dashboard/Dashboard';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/"             element={<Dashboard/>} /> 
                <Route path="/login"        element={<Login/>} />
                <Route path="/login/forgot" element={<ForgotPW/>} /> 
                <Route path="/login/reset"  element={<ResetPW/>} /> 
            </Routes>
        </Router>
    );
}
