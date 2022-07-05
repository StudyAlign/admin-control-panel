import React from "react";
import Topbar from "../../components/Topbar";
import EmptyDashboard from "./EmptyDashboard";
import FilledDashboard from "./FilledDashboard";
import {useDispatch} from "react-redux";
import {authSlice, me, userLogin} from "../../redux/reducers/authSlice";


export default function Dashboard() {
    const dispatch = useDispatch()

    const amountStudies = 1
    // TODO Request Studies

    let dashboard
    if(amountStudies > 0) {
        dashboard = <FilledDashboard/>
    }
    else {
        dashboard = <EmptyDashboard/>
    }

    let response = dispatch(me())
    console.log(response)

    return (
        <>
            <Topbar/>
            {dashboard}
        </>
    )
}