import React from "react";
import Topbar from "../../components/Topbar";
import SidebarLayout from "./SidebarLayout";

export default function StudyCreationLayout(props) {
    return(
        <>
            <Topbar/>
            <SidebarLayout>
                <h1 className="page-title"> Study Information </h1>
                {props.children}
            </SidebarLayout>
        </>
    )
}