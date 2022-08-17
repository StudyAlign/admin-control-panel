import React from "react";
import {Button} from "react-bootstrap";

import "./StudyOverview.css"
import {useDispatch} from "react-redux";
import {updateStudy} from "../../redux/reducers/studySlice";


export default function Overview(props) {
    const dispatch = useDispatch()

    // TODO maybe move to an common functions folder
    const reformatDate = (dateString) => {
        const date = new Date(dateString)
        let day = date.getDate()
        if(day < 10) day = "0" + day
        let month = date.getMonth()
        if(month < 10) month = "0" + month
        let year = date.getFullYear()
        return day + "." + month + "." + year
    }

    const handleCloseStudy = async (event) => {
        event.preventDefault()
        let new_study = {...props.study}
        new_study.is_active = false
        await dispatch(updateStudy({studyId: new_study.id, study: new_study}));
        console.log("Overview")
    }

    const handleOpenStudy = (event) => {
        event.preventDefault()
    }

    const getButton = (is_active) => {
        if (is_active) {
            return <Button type="button" className="big-button" onClick={handleCloseStudy}> Close Study </Button>
        }
        else {
            return <Button type="button" className="big-button" onClick={handleOpenStudy}> Open Study </Button>
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