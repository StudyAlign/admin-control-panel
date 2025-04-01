import React, { useState, useEffect } from "react";
import { Button, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useDispatch} from "react-redux";

import { STATES } from "./StudyOverviewLayout";

import { studySlice, getStudySetupInfo, getStudy, updateStudy } from "../../redux/reducers/studySlice";

import { reformatDate } from "../../components/CommonFunctions";

import { Copy, Check } from "react-bootstrap-icons";

import "./StudyOverview.css";
import "../SidebarAndReactStyles.scss";

const url = process.env.REACT_APP_STUDY_ALIGN_STUDY_FRONTEND_URL;

export default function Overview(props) {
    const [participants, setParticipants] = useState("loading...")
    const [doneParticipants, setDoneParticipants] = useState("loading...")
    const [isClicked, setIsClicked] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const study = props.study
    const collab_url = url + study.id + "/"

    useEffect(async () => {
        await dispatch(getStudySetupInfo(study.id)).then((response) => {
            const tempParticipants = response.payload.body.planned_number_participants
            setParticipants(tempParticipants)
            setDoneParticipants(tempParticipants - response.payload.body.remaining_participants)
            dispatch(studySlice.actions.resetStudySetupInfo())
        })
    }, [])

    const handleCopy = () => {
        navigator.clipboard.writeText(collab_url)
        setIsClicked(true)
        setTimeout(() => setIsClicked(false), 500)
    }

    const handleStudyActive = async (event, state) => {
        event.preventDefault()
        await dispatch(updateStudy({studyId: study.id, study: {"state": state}}))
        await dispatch(getStudy(study.id))
    }

    const handleEdit = async (event) => {
        event.preventDefault()
        await dispatch(updateStudy({
            "studyId": study.id,
            "study": {
                "current_setup_step": "study"
            }
        }))
        await dispatch(getStudySetupInfo(study.id))
        navigate("/create/" + study.id + "/information")
    }

    const getButton = (state) => {
        switch (state) {
            case STATES.RUNNING:
                return <Button onClick={(event) => handleStudyActive(event, "finished")}> Close Study </Button>
            case STATES.FINISHED:
                return <Button onClick={(event) => handleStudyActive(event, "running")}> Open Study </Button>
            case STATES.SETUP:
                return <Button onClick={(event) => handleEdit(event)}> Finish Setup </Button>
        }
    }

    const getStatus = () => {
        switch (study.state) {
            case STATES.RUNNING:
                return "Running"
            case STATES.SETUP:
                return "Setup"
            default:
                return "Closed"
        }
    }

    const getStudyIsOver = () => {
        if (new Date(study.endDate.split('T')[0]) < new Date()) {
            return "(is over)"
        }
    }

    return (
        <>
            <Tabs defaultActiveKey="details" id="study-tabs" className="mb-3">
                <Tab eventKey="details" title="Details">
                    <table>
                        <tbody>
                            <tr>
                                <td className="content-name"> Status: </td>
                                <td> {getStatus()} {getStudyIsOver()} </td>
                            </tr>
                            <tr>
                                <td className="content-name"> Private Study: </td>
                                <td> {study.invite_only ? "Yes" : "No"} </td>
                            </tr>
                            <tr>
                                <td className="content-name"> Start Date: </td>
                                <td> {reformatDate(study.startDate)} </td>
                            </tr>
                            <tr>
                                <td className="content-name"> End Date: </td>
                                <td> {reformatDate(study.endDate)} </td>
                            </tr>
                            <tr>
                                <td className="content-name"> Participants: </td>
                                <td> {doneParticipants} / {participants} </td>
                            </tr>
                            <tr>
                                <td className="content-name"> Invite Link: </td>
                                <td> <a href={collab_url}> {collab_url} </a> <button
                                    onClick={handleCopy}
                                    className={`copy-button ${isClicked ? 'clicked' : ''}`}
                                >
                                    <Copy size={10} />
                                </button> </td>
                            </tr>
                        </tbody>
                    </table>
                </Tab>
                <Tab eventKey="description" title="Description">
                    <div
                        className="description-content"
                        dangerouslySetInnerHTML={{ __html: study.description }}>
                    </div>
                </Tab>
                <Tab eventKey="consent" title="Consent">
                    <div
                        className="consent-content"
                        dangerouslySetInnerHTML={{ __html: study.consent }}>
                    </div>
                </Tab>
            </Tabs>
            <hr />
            {getButton(study.state)}
            <hr />
            <h3> Collaborators </h3>
            <ul>
                <li> N.A. </li>
            </ul>
            <Button type="button" className="small-button"> + Add </Button>
        </>
    )
}