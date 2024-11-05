import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {Container, Row, Col, Button, Badge, Card} from "react-bootstrap";
import {
    PeopleFill,
    CalendarDateFill,
    CalendarFill,
    Calendar,
    CalendarRange,
    CalendarRangeFill
} from "react-bootstrap-icons";

import { useDispatch } from "react-redux";
import { studySlice, getStudySetupInfo } from "../../redux/reducers/studySlice";

import { STATES } from "../study_overview/StudyOverviewLayout";

import { reformatDate } from "../../components/CommonFunctions";

import "./Dashboard.scss";
import LoadingScreen from "../../components/LoadingScreen";

export default function StudyBox(props) {

    const [participants, setParticipants] = useState("loading...")
    const [doneParticipants, setDoneParticipants] = useState("loading...")

    const navigate = useNavigate()
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

    function getButton2(state) {
        let button
        if (state === STATES.RUNNING) {
           button = <Button className="button1"> Interaction Logs </Button>
        }
        else {
            button = <Button className="button1"> Export Data </Button>
        }
        return button
    }

    return (
        <Card className={"study-box"} onClick={handleClickOverview}>
            <Card.Body>
                <Card.Title className="d-flex align-items-start">
                    <span className="study-title">{study.name}</span>
                    {getStatusLabel(study.state)}
                </Card.Title>
                <Card.Text>
                    <div className="study-info">
                        <span className="label"><span className="icon"><CalendarRangeFill /></span> Date</span>
                        <span className="data"> {reformatDate(study.startDate) + " - " + reformatDate(study.endDate)} </span>
                    </div>
                    <div className="study-info">
                        <span className="label"><span className="icon"><PeopleFill/></span> Participants</span>
                        <span className="data"> {doneParticipants + " / " + participants} </span>
                    </div>
                </Card.Text>
            </Card.Body>
        </Card>
    )

/*    return (
        <div className="study-box" onClick={handleClickOverview}>
            <Container>
                <Row>
                    <Col>
                        <h5 className="study-name-label"> {study.name} </h5> {getStatusLabel(study.state)}
                    </Col>
                </Row>

                <div>
                    <label className="date-label-header"> Date <CalendarDateFill /> </label>
                    <label className="date-label"> {reformatDate(study.startDate) + " - " + reformatDate(study.endDate)} </label>
                    <label className="participants-label-header"> Participants <PeopleFill /> </label>
                    <label className="participants-label"> {doneParticipants + " / " + participants} </label>
                </div>
            </Container>
        </div>
    )*/
}