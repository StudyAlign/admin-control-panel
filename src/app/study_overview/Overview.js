import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch} from "react-redux";

import { STATES } from "./StudyOverviewLayout";

import { studySlice, getStudySetupInfo, getStudy, updateStudy } from "../../redux/reducers/studySlice";

import { reformatDate } from "../../components/CommonFunctions";

import "./StudyOverview.css";
import "../SidebarAndReactStyles.scss";

export default function Overview(props) {
    const [participants, setParticipants] = useState("loading...")
    const [doneParticipants, setDoneParticipants] = useState("loading...")

    const dispatch = useDispatch()
    const study = props.study

    useEffect(async () => {
        await dispatch(getStudySetupInfo(study.id)).then((response) => {
            const tempParticipants = response.payload.body.planned_number_participants
            setParticipants(tempParticipants)
            setDoneParticipants(tempParticipants - response.payload.body.remaining_participants)
            dispatch(studySlice.actions.resetStudySetupInfo())
        })
    }, [])

    const handleStudyActive = async (event, state) => {
        event.preventDefault()
        await dispatch(updateStudy({studyId: study.id, study: {"state": state}}));
        await dispatch(getStudy(study.id));
    }

    const getButton = (state) => {
        if (state === STATES.RUNNING) {
            return <Button onClick={(event) => handleStudyActive(event, "finished")}> Close Study </Button>
        }
        else if (state === STATES.FINISHED) {
            return <Button onClick={(event) => handleStudyActive(event, "running")}> Open Study </Button>
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

    return(
        <>
            <table>
                <tbody>
                <tr>
                    <td className="content-name"> Description: </td>
                    <td> {study.description} </td>
                </tr>
                <tr>
                    <td className="content-name"> Consent: </td>
                    <td> {study.consent} </td>
                </tr>
                <tr>
                    <td className="content-name"> Status: </td>
                    <td> {getStatus()} {getStudyIsOver()} </td>
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
                    <td> <a href={""}> N.A. </a> </td>
                </tr>
                </tbody>
            </table>
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