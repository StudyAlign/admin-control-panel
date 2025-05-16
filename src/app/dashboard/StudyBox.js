import { useNavigate } from "react-router";
import { Badge, Card } from "react-bootstrap";
import {
    PeopleFill,
    CalendarRangeFill
} from "react-bootstrap-icons";

import { STATES } from "../study_overview/StudyOverviewLayout";

import { reformatDate } from "../../components/CommonFunctions";

import "./Dashboard.scss";

export default function StudyBox(props) {

    const navigate = useNavigate()
    const study = props.study

    const handleClickOverview = (event) => {
        event.preventDefault()
        navigate("/study/"+study.id+"/overview")
    }

    function getStatusLabel(state) {
        if (state === STATES.RUNNING) {
            return <Badge pill bg="success" className="ms-auto status-pill">Running</Badge>
        }
        return <Badge pill bg="secondary" className="ms-auto status-pill">Closed</Badge>
    }

    return (
        <Card className={"study-box"} onClick={handleClickOverview}>
            <Card.Body>
                <Card.Title className="d-flex align-items-start">
                    <span className="study-title">{study.name}</span>
                    {getStatusLabel(study.state)}
                </Card.Title>
                <Card.Text>
                    <span className="study-info">
                        <span className="label"><span className="icon"><CalendarRangeFill /></span> Date</span>
                        <span className="data"> {reformatDate(study.startDate) + " - " + reformatDate(study.endDate)} </span>
                    </span>
                    <span className="study-info">
                        <span className="label"><span className="icon"><PeopleFill/></span> Participants</span>
                        <span className="data"> {study.done_participants} </span>
                        {study.in_progress_participants > 0 && <span className="data" style={{color: 'red'}}> {" (" + (study.done_participants + study.in_progress_participants) + ")"} </span>}
                        <span className="data"> {" / " + study.total_participants} </span>
                    </span>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}