import React from "react";
import { Button } from "react-bootstrap";
import { useDispatch} from "react-redux";

import { getStudy, updateStudy } from "../../redux/reducers/studySlice";

import { reformatDate } from "../../components/CommonFunctions";

import "./StudyOverview.css";

export default function Overview(props) {
    const dispatch = useDispatch()

    const handleStudyActive = async (event, active) => {
        event.preventDefault()
        await dispatch(updateStudy({studyId: props.study.id, study: {"is_active": active}}));
        await dispatch(getStudy(props.study.id));
    }

    const getButton = (is_active) => {
        if (is_active) {
            return <Button type="button" className="big-button" onClick={(event) => handleStudyActive(event, false)}> Close Study </Button>
        }
        else {
            return <Button type="button" className="big-button" onClick={(event) => handleStudyActive(event, true)}> Open Study </Button>
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
                    <td> {(props.study.is_active) ? 'Running' : 'Closed'} </td>
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
            <hr/>
            <h1 className="small-title"> Collaborators </h1>
            <ul>
                <li> N.A. </li>
            </ul>
            <Button type="button" className="small-button"> + Add </Button>
            {getButton(props.study.is_active)}
        </>
    )
}