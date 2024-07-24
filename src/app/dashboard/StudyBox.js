import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Container, Row, Col, Button } from "react-bootstrap";
import { PeopleFill } from "react-bootstrap-icons";

import { useDispatch } from "react-redux";
import { getStudySetupInfoParticipantsNoThunk } from "../../redux/reducers/studySlice";

import { STATES } from "../study_overview/StudyOverviewLayout";

import { reformatDate } from "../../components/CommonFunctions";

import "./Dashboard.css";
import LoadingScreen from "../../components/LoadingScreen";

export default function StudyBox(props) {

    const [participants, setParticipants] = useState("loading...")

    const navigate = useNavigate();
    const study = props.study

    useEffect(async () => {
        await getStudySetupInfoParticipantsNoThunk(study.id).then((response) => {
            setParticipants(response)
        })
    }, [])

    const handleClickOverview = (event) => {
        event.preventDefault()
        navigate("/study/"+study.id+"/overview")
    }

    function getStatusLabel(state) {
        let label
        if (state === STATES.RUNNING) {
            label = <label className={"status-label running"}> Running </label>
        }
        else {
            label = <label className={"status-label finished"}> Closed </label>
        }
        return label
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

    // TODO Amount participants and max participants has to be read from backend in order to display
    return(
        <div className="study-box">
            <Container>
                <Row>
                    <Col> { getStatusLabel(study.state) } </Col>
                    <Col> <label className="participants-label"> <PeopleFill/> {"N.A. / " + participants} </label> </Col>
                </Row>
                <Row>
                    <Col> <label className="study-name-label"> {study.name} </label> </Col>
                </Row>
                <Row>
                    <Col> <label className="date-label"> {reformatDate(study.startDate) + " - " + reformatDate(study.endDate)} </label> </Col>
                </Row>
                <Row style={{"marginTop": "15px"}}>
                    <Col xs="auto"> <Button className="button1" onClick={handleClickOverview}> Overview </Button> </Col>
                    <Col> { getButton2(study.state) } </Col>
                </Row>
            </Container>
        </div>
    )
}