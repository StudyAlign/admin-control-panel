import React, {useEffect} from "react";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";

import { getProcedureConfig, selectStudyProcedure, getProcedureConfigOverview, selectStudyProcedureOverview } from "../../redux/reducers/studySlice";
import LoadingScreen from "../../components/LoadingScreen";
import ShowProcedure from "../create_study_flow/ShowProcedure";

export default function Procedure() {

    const dispatch = useDispatch()
    const { study_id } = useParams()

    const procedureConfig = useSelector(selectStudyProcedure)
    const procedureConfigOverview = useSelector(selectStudyProcedureOverview)

    useEffect(  () => {
        dispatch(getProcedureConfig(study_id)).then((response) => {
            if (response.payload.body.id) {
                dispatch(getProcedureConfigOverview(response.payload.body.id))
            }
        })
    }, [])

    if ( procedureConfigOverview == null ) {
        return <LoadingScreen/>
    }

    return (
        <ShowProcedure procedureId={procedureConfig && procedureConfig.id} />
    )
}