import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { studySlice, getStudies, selectStudies } from "../../redux/reducers/studySlice";

import Topbar from "../../components/Topbar";
import EmptyDashboard from "./EmptyDashboard";
import FilledDashboard from "./FilledDashboard";
import LoadingScreen from "../../components/LoadingScreen";


export default function Dashboard() {
    const dispatch = useDispatch()
    const studies = useSelector(selectStudies)

    const mock_studies = [
        {
            name: "Collaborative writing with AI - Pilot",
            id: 0,
            is_active: true,
            startDate: "2022-04-21T15:08:50.161000",
            endDate: "2022-05-21T15:08:50.161000",
            owner_id: 1,
            invite_only: false,
        },
        {
            name: "Writing with generative models on mobile devices",
            id: 1,
            is_active: true,
            startDate: "2021-11-01T15:08:50.161000",
            endDate: "2021-11-10T15:08:50.161000",
            owner_id: 1,
            invite_only: false,
        },
        {
            name: "Quantitative Study on collaborative writing with AI",
            id: 2,
            is_active: false,
            startDate: "2022-05-30T15:08:50.161000",
            endDate: "2022-06-30T15:08:50.161000",
            owner_id: 1,
            invite_only: false,
        },
        {
            name: "Typing Behaviour Biometrics",
            id: 3,
            is_active: false,
            startDate: "2022-05-30T15:08:50.161000",
            endDate: "2022-06-30T15:08:50.161000",
            owner_id: 1,
            invite_only: false,
        }
    ]

    useEffect(() => {
        dispatch(getStudies())
        return () => {
            dispatch(studySlice.actions.resetStudies())
        }
    }, [])

    let dashboard
    if (studies == null) {
        dashboard = <LoadingScreen />
    }
    else if (studies.length == 0) {
        dashboard = <EmptyDashboard/>
    }
    else {
        dashboard = <FilledDashboard studies={studies} />
    }

    return (
        <>
            <Topbar/>
            {dashboard}
        </>
    )
}