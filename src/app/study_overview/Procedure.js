import React from "react";
import "./StudyOverview.css"
import {useParams} from "react-router";

export default function Procedure() {
    const { study_id } = useParams()

    return (
        <>
            <h1 className="study-title"> Collaborative writing with AI - Pilot (#{study_id}) </h1>

            Procedure
        </>
    )
}