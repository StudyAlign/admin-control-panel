import React from "react";
import {Button} from "react-bootstrap";
import { useParams } from "react-router";
import "./StudyOverview.css"


export default function Overview() {
    const { study_id } = useParams()

    const study = {
        name: "Collaborative writing with AI - Pilot",
        startDate: "2022-04-21T07:15:07.446Z",
        endDate: "2022-05-21T07:15:07.446Z",
        isActive: true,
        id: study_id,
        description: "This is a first pilot study for collaborative writing with AI. ......",
        consent: "string",
        link: "https://www.studyalign.com/invite/0374011473910"
    } // TODO fetch information from backend with the given study_id

        return(
            <>
                <table>
                    <tbody>
                    <tr>
                        <td className="content-name"> Description: </td>
                        <td> {study.description} </td>
                    </tr>
                    <tr>
                        <td className="content-name"> Start Date: </td>
                        <td> 21.04.2022 </td>
                    </tr>
                    <tr>
                        <td className="content-name"> End Date: </td>
                        <td> 21.05.2022 </td>
                    </tr>
                    <tr>
                        <td className="content-name"> Participants: </td>
                        <td> 9 / 10 </td>
                    </tr>
                    <tr>
                        <td className="content-name"> Invite Link: </td>
                        <td> <a href={study.link}>{study.link}</a> </td>
                    </tr>
                    </tbody>
                </table>

                <hr/>

                <h1 className="small-title"> Collaborators </h1>
                <ul>
                    <li> Max Mustermann (You) </li>
                    <li> Jonas Jäger </li>
                </ul>
                <Button type="button" className="small-button"> + Add </Button>
                <Button type="button" className="big-button"> Close Study </Button>
            </>
        )
}