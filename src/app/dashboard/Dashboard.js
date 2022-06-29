import React from "react";
import Topbar from "../../components/Topbar";
import EmptyDashboard from "./EmptyDashboard";
import FilledDashboard from "./FilledDashboard";

export default function Dashboard() {
    const amountStudies = 1
    // TODO Request Studies

    let dashboard
    if(amountStudies > 0) {
        dashboard = <FilledDashboard/>
    }
    else {
        dashboard = <EmptyDashboard/>
    }

    return (
        <>
            <Topbar/>
            {dashboard}
        </>
    )
}