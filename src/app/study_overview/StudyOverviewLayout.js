import React from "react";
import Topbar from "../../components/Topbar";
import SidebarLayout from "./SidebarLayout";
import Overview from "./Overview";
import Procedure from "./Procedure";
import InteractionData from "./InteractionData";
import { useParams } from "react-router";


export default function StudyOverviewLayout() {

    const { study_id, page } = useParams()

    const study = {
        name: "Collaborative writing with AI - Pilot",
        id: study_id,
    } // TODO fetch information from backend with the given study_id

    let content
    if(page === 'overview') {
        content = <Overview/>
    }
    else if(page === 'procedure') {
        content = <Procedure/>
    }
    else if(page === 'data') {
        content = <InteractionData/>
    }
    else {
        content = "Error - Page not found"
    }

    return (
        <>
            <Topbar/>
            <SidebarLayout>
                <h1 className="study-title"> {study.name} <label className="study-id">(#{study_id})</label> </h1>
                {content}
            </SidebarLayout>
        </>
    )
}