import React, {useEffect} from "react";
import Topbar from "../../components/Topbar";
import EmptyDashboard from "./EmptyDashboard";
import FilledDashboard from "./FilledDashboard";
import {useDispatch, useSelector} from "react-redux";
import {getStudies, selectStudies} from "../../redux/reducers/studySlice";


export default function Dashboard() {
    const dispatch = useDispatch()
    const studies = useSelector(selectStudies)

    // Currently, this effect is only called after the initial rendering
    useEffect(( ) => {
        dispatch(getStudies()); //Dispatching getStudies Action from studySlice
    }, [])

    let dashboard
    if(studies != null && studies.length > 0) {
        dashboard = <FilledDashboard studies={studies}/>
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