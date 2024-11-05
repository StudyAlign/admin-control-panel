import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch} from "react-redux";

import { STATES } from "./StudyOverviewLayout";

import { getStudy, updateStudy } from "../../redux/reducers/studySlice";

import { reformatDate } from "../../components/CommonFunctions";

import "./StudyOverview.css";
import "../SidebarAndReactStyles.scss";

export default function Overview(props) {
    const dispatch = useDispatch()

    const handleStudyActive = async (event, state) => {
        event.preventDefault()
        await dispatch(updateStudy({studyId: props.study.id, study: {"state": state}}));
        await dispatch(getStudy(props.study.id));
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
        switch (props.study.state) {
            case STATES.RUNNING:
                return "Running"
            case STATES.SETUP:
                return "Setup"
            default:
                return "Closed"
        }
    }

    const getStudyIsOver = () => {
        if (new Date(props.study.endDate.split('T')[0]) < new Date()) {
            return "(is over)"
        }
    }

    // TODO fetch partcicipant informations in order to display the amount of participants

    return(
        <>
            <table>
                <tbody>
                <tr>
                    <td className="content-name"> Description: </td>
                    <td> {props.study.description} </td>
                </tr>
                <tr>
                    <td className="content-name"> Status: </td>
                    <td> {getStatus()} {getStudyIsOver()} </td>
                </tr>
                <tr>
                    <td className="content-name"> Start Date: </td>
                    <td> {reformatDate(props.study.startDate)} </td>
                </tr>
                <tr>
                    <td className="content-name"> End Date: </td>
                    <td> {reformatDate(props.study.endDate)} </td>
                </tr>
                <tr>
                    <td className="content-name"> Participants: </td>
                    <td> N.A. / N.A. </td>
                </tr>
                <tr>
                    <td className="content-name"> Invite Link: </td>
                    <td> <a href={""}> N.A. </a> </td>
                </tr>
                </tbody>
            </table>
            {getButton(props.study.state)}
            <hr />
            <h3> Collaborators </h3>
            <ul>
                <li> N.A. </li>
            </ul>
            <Button type="button" className="small-button"> + Add </Button>
        </>
    )
}