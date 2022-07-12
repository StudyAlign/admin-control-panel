import React, {useEffect, useState} from "react";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {getStudy, selectStudy} from "../../redux/reducers/studySlice";

export default function CreateProcedure() {
    const dispatch = useDispatch()
    const { study_id } = useParams()

    console.log(study_id)

    const study = useSelector(selectStudy)
    useEffect(( ) => {
        dispatch(getStudy(study_id));
    }, [])



    return (
        <StudyCreationLayout step={CreationSteps.Procedure}>
            Hello World!!
            {study.name}
        </StudyCreationLayout>
    )
}