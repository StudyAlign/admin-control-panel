import React from "react";
import Topbar from "../../components/Topbar";
import SidebarLayout from "./SidebarLayout";
import Overview from "./Overview";
import Procedure from "./Procedure";
import InteractionData from "./InteractionData";

export default function StudyOverviewLayout(props) {

    let content
    if(props.content === 'overview') {
        content = <Overview/>
    }
    else if(props.content === 'procedure') {
        content = <Procedure/>
    }
    else if(props.content === 'data') {
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