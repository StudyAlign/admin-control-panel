import React from "react";
import Topbar from "../../components/Topbar";
import SidebarLayout from "./SidebarLayout";

export const StudyStatus = {
    Creation: 0,
    Active: 1,
}

export const CreationOrder = [
    "study",
    "information",
    "procedure",
    "integrations",
    "check",
    "done"
]

export const CreationSteps = {
    Information: 0,
    Procedure: 1,
    Integrations: 2,
    Check: 3,
}

export default function StudyCreationLayout(props) {
    const getTitle = (step) => {
        switch (step) {
            case CreationSteps.Information:
                return "Study Information"
            case CreationSteps.Procedure:
                return "Procedure"
            case CreationSteps.Integrations:
                return "Integrations"
            case CreationSteps.Check:
                return "Sanity Check"
            default:
                return "Create Study"
        }
    }

    return(
        <>
            <Topbar/>
            <SidebarLayout step={props.step}>
                <h1 className="page-title"> {getTitle(props.step)} </h1>
                {props.children}
            </SidebarLayout>
        </>
    )
}