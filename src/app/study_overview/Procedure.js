import React from "react";
import ProcedureObject from "./ProcedureObject";
import "./StudyOverview.css"
import { useParams } from "react-router";

export default function Procedure() {
    const { study_id } = useParams()

    const procedure = [
        {name: 'Welcome Message', type: 'Text Page'},
        {name: 'Procedure Description', type: 'Text Page'},
        {name: 'Prototype 1', type: 'Condition'},
        {name: 'Likert Prototype 1', type: 'Questionnaire'},
    ]

    let content = []
    for (let step of procedure) {
        content.push(<ProcedureObject name={step.name} type={step.type}/>)
    }

    return (
        <>
            <div className="procedure-box">
                <div className="box-header"> Procedure Order </div>
                <div className="box-content">
                    {content}
                </div>
            </div>
        </>
    )
}