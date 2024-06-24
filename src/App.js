import React, {createContext, useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useDispatch, useSelector, useStore} from "react-redux";

import Login from './app/login/Login';
import ForgotPW from './app/login/ForgotPW';
import ResetPW from './app/login/ResetPW';
import Dashboard from './app/dashboard/Dashboard';
import StudyOverviewLayout from "./app/study_overview/StudyOverviewLayout";
import CreateInformation from "./app/create_study_flow/CreateInformation";
import CreateProcedure, { EmptyProcedureOrderProvider } from "./app/create_study_flow/CreateProcedure";
import StudyCreationLogic from "./app/create_study_flow/StudyCreationLogic";
import CreateIntegrations from "./app/create_study_flow/CreateIntegrations";
import CreateCheck from "./app/create_study_flow/CreateCheck";
import EditInformation from './app/create_study_flow/EditInformation';
import ImportStudy from './app/create_study_flow/ImportStudy';
import { StudyStatus } from './app/create_study_flow/StudyCreationLayout';

import RequireAuth, {AuthRoute, AuthProvider, useAuth} from "./components/Auth";

import { authSlice } from "./redux/reducers/authSlice";

import './App.css';
import 'bootstrap/dist/css/bootstrap.css';


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
                        <Route path="/"                         element={<Dashboard/>} />
                        <Route path="/study/:study_id/:page"    element={<StudyOverviewLayout/>} />

                        <Route path="import"            element={<ImportStudy/>} />
                        <Route path="create"            element={<EmptyProcedureOrderProvider><CreateInformation/></EmptyProcedureOrderProvider>} />
                        <Route path="create/:study_id"  element={<EmptyProcedureOrderProvider><StudyCreationLogic/></EmptyProcedureOrderProvider>}>
                            <Route path="information"   element={<EditInformation status={StudyStatus.Creation}/>} />
                            <Route path="procedure"     element={<CreateProcedure status={StudyStatus.Creation}/>} />
                            <Route path="integrations"  element={<CreateIntegrations status={StudyStatus.Creation}/>} />
                            <Route path="check"         element={<CreateCheck/>} />
                            <Route path="*"             element={<h1>ERROR</h1>} />
                        </Route>

                        <Route path="edit/:study_id"  element={<StudyCreationLogic/>}>
                            <Route path="information"   element={<EditInformation status={StudyStatus.Active}/>} />
                            <Route path="procedure"     element={<CreateProcedure status={StudyStatus.Active}/>} />
                            <Route path="integrations"  element={<CreateIntegrations status={StudyStatus.Active}/>} />
                            <Route path="check"         element={<CreateCheck/>} />
                            <Route path="*"             element={<h1>ERROR</h1>} />
                        </Route>
                    </Route>

                    <Route path="/login"            element={<Login/>} />
                    <Route path="/logout"           element={<Login logout/>} />
                    <Route path="/login/forgot"     element={<ForgotPW/>} />
                    <Route path="/login/reset"      element={<ResetPW/>} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
