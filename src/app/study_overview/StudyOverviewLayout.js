import React, {useEffect} from "react";
import Topbar from "../../components/Topbar";
import SidebarLayout from "./SidebarLayout";
import Overview from "./Overview";
import Procedure from "./Procedure";
import InteractionData from "./InteractionData";
import { useParams } from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {getStudy, selectStudy} from "../../redux/reducers/studySlice";

// TODO Maybe refactor layout so that the use is similar to the CreateStudyLayout
export default function StudyOverviewLayout() {
    const dispatch = useDispatch()
    const { study_id, page } = useParams()

    const mock_study = {
        name: "Collaborative writing with AI - Pilot",
        startDate: "2022-04-21T07:15:07.446Z",
        endDate: "2022-05-21T07:15:07.446Z",
        is_active: true,
        id: study_id,
        description: "This is a first pilot study for collaborative writing with AI. ......",
        consent: "string",
        link: "https://www.studyalign.com/invite/0374011473910"
    }

    const study = useSelector(selectStudy)
    useEffect(() => {
        dispatch(getStudy(study_id));
    }, [])

    // Somehow you just get out logged when you enter an invalid study id
    if(study == null) {
        return (<h3> Study not found </h3>)
    }

    const getContent = (page) => {
        let content
        if(page === 'overview') {
            content = <Overview study={study}/>
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
        return content
    }
    return (
        <>
            <Topbar/>
            <SidebarLayout>
                <h1 className="study-title"> {study.name} <label className="study-id">(#{study_id})</label> </h1>
                {getContent(page)}
            </SidebarLayout>
        </>
    )
}