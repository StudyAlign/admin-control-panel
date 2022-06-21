import React from "react";
import { useParams } from "react-router";
import "./StudyOverview.css"


export default function Overview() {
    const { study_id } = useParams()

    // TODO fetch informations from backend with the given study_id
        return(
            <>
                <h1 className="study-title"> Collaborative writing with AI - Pilot (#{study_id}) </h1>

                <table>
                    <tbody>
                    <tr>
                        <td className="content-name"> Description: </td>
                        <td> This is a first pilot study for collaborative writing with AI. ...... </td>
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
                        <td> https://www.studyalign.com/invite/0374011473910 </td>
                    </tr>
                    </tbody>
                </table>

                <hr/>

                <h1 className="small-title"> Collaborators </h1>
                <ul>
                    <li> Max Mustermann (Your) </li>
                    <li> Jonas Jäger </li>
                </ul>
                <button type="button" className="small-button"> + Add </button>
                <button type="button" className="big-button"> Close Study </button>
            </>
        )
}