import React, {useState} from "react";
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

    const [toggledState, changeState] = useState(new Array(procedure.length).fill(false))

    function clickObject(event, index) {
        if(event && event.stopPropagation) event.stopPropagation()

        let state = new Array(procedure.length).fill(false)
        state[index] = true
        changeState(state)
    }

    function deselectObject() {
        changeState(new Array(procedure.length).fill(false))
    }


    return (
        <>
            <div className="procedure-box" onClick={() => deselectObject()}>
                <div className="box-header"> Procedure Order </div>
                <div className="box-content" id="content">
                    {procedure.map((step, index) => (
                        <div key={index} onClick={(e) => clickObject(e, index)}>
                            <ProcedureObject name={step.name} type={step.type} toggled={toggledState[index]} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}