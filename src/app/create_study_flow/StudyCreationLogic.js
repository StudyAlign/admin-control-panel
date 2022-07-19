import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {getStudySetupInfo, selectStudyApiStatus, selectStudySetupInfo} from "../../redux/reducers/studySlice";
import React, {useEffect} from "react";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";

export default function StudyCreationLogic(props) {
    const dispatch = useDispatch()
    const { study_id } = useParams()
    const location = useLocation()

    const creationOrder = [
        "study",
        "procedure",
        "integrations",
        "check",
        "done"
    ]

    const studySetupInfo = useSelector(selectStudySetupInfo)
    const studyApiStatus = useSelector(selectStudyApiStatus)
    useEffect( () => {
        dispatch(getStudySetupInfo(study_id));
        console.log("Status1")
        console.log(studyApiStatus)
    }, [])



    const next_step = (current_step) => {
        let idx = creationOrder.indexOf(current_step)
        return creationOrder[idx+1]
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

    console.log("Status")
    console.log(studyApiStatus)
    // Status 404 -> navigate to dashboard
    if(studySetupInfo === null) {
        return <LoadingScreen/>
    }

    if(get_step(location.pathname) === next_step(studySetupInfo.current_setup_step)) {
        return <Outlet/>
    }
    else {
        return <Navigate to={next_step(studySetupInfo.current_setup_step)} replace state={{ from: location }} />
    }
}