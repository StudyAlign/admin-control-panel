import React from "react";
import Topbar from "../../components/Topbar";
import SidebarLayout from "./SidebarLayout";
import Overview from "./Overview";
import Procedure from "./Procedure";
import InteractionData from "./InteractionData";
import { useParams } from "react-router";

export default function StudyOverviewLayout() {

    const { page } = useParams()

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
            {content}
        </SidebarLayout>
        </>
    )
}