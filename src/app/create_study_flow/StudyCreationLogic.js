import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {getStudySetupInfo, selectStudySetupInfo} from "../../redux/reducers/studySlice";
import React, {useEffect} from "react";
import {Navigate} from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";

export default function StudyCreationLogic(props) {
    const dispatch = useDispatch()
    const { study_id } = useParams()

    const creationOrder = [
        "study",
        "procedure",
        "integrations",
        "check",
        "done"
    ]

    const studySetupInfo = useSelector(selectStudySetupInfo)
    useEffect(() => {
        dispatch(getStudySetupInfo(study_id));
    }, [])


    const next_step = (current_step) => {
        let idx = creationOrder.indexOf(current_step)
        return creationOrder[idx+1]
    }

    if(studySetupInfo === null) {
        return <LoadingScreen/>
    }
    else {
        const nav = "/create/" + study_id + "/" + next_step(studySetupInfo.current_setup_step)
        return <Navigate to={nav} replace />
    }
}