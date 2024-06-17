import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
    studySlice,
    getStudySetupInfo,
    selectStudyApiStatus,
    selectStudySetupInfo,
    resetStudySetupInfo
} from "../../redux/reducers/studySlice";

import LoadingScreen from "../../components/LoadingScreen";
import { CreationOrder } from "./StudyCreationLayout";

export default function StudyCreationLogic(props) {
    const dispatch = useDispatch()
    const { study_id } = useParams()
    const location = useLocation()

    const studySetupInfo = useSelector(selectStudySetupInfo)
    const studyApiStatus = useSelector(selectStudyApiStatus)

    useEffect( () => {
        dispatch(getStudySetupInfo(study_id))
        return () => {
            dispatch(studySlice.actions.resetStudySetupInfo())
            dispatch(studySlice.actions.resetProcedureOverview())
        }
    }, [])

    const next_step = (current_step) => {
        let idx = CreationOrder.indexOf(current_step)
        if(idx === 0) idx += 1 // TODO: Remove after Backend Change
        return CreationOrder[idx+1]
    }

    const get_step = (path) => {
        const path_split = path.split('/')
        if(path_split.size < 4) {
            return ''
        }
        else {
            return path_split.slice(3).join('/')
        }
    }

    // Status 404 -> navigate to dashboard
    if(studyApiStatus === 404) {
        return <Navigate to={'/'} replace state={{ from: location }} />
    }

    if(studySetupInfo === null) {
        return <LoadingScreen/>
    }

    if (studySetupInfo.current_setup_step === "done" || next_step(studySetupInfo.current_setup_step) === "done") {
        // If creation is done, navigate to study overview
        return <Navigate to={"/study/" + study_id + "/overview"} replace state={{ from: location }} />
    }
    else if (get_step(location.pathname) === next_step(studySetupInfo.current_setup_step)) {
        return <Outlet/>
    }
    else {
        return <Navigate to={next_step(studySetupInfo.current_setup_step)} replace state={{ from: location }} />
    }
}