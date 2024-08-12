import React, {useEffect} from "react";
import {Container, Row, Col, Button, NavLink} from "react-bootstrap";
import {useNavigate} from "react-router";

import { STATES } from "../study_overview/StudyOverviewLayout";

import StudyBox from "./StudyBox";

import "./Dashboard.css";

export default function FilledDashboard(props) {
    const navigate = useNavigate()
    const max_amount_boxes = 3

    const handleClickStudyLink = (event, study_id) => {
        event.preventDefault()
        navigate("/study/"+study_id+"/overview")
    }

    const handleClickCreateStudy = (event) => {
        event.preventDefault()
        navigate("/create")
    }

    const handleClickSetupStudy = (event, study_id) => {
        event.preventDefault()
        navigate("/create/" + study_id)
    }

    const handleClickImportStudy = (event) => {
        event.preventDefault()
        navigate("/import")
    }

    let running_studies = []
    let finished_done_studies = []
    let finished_future_studies = []
    let recent_studies = []
    let setup_unfinished_studies = []
    for(let s of props.studies) {
        // TODO how to declare which (and how many) studies are shown as boxes
        if(recent_studies.length < max_amount_boxes && s.state !== STATES.SETUP) {
            recent_studies.push(
                <Col key={s.id} xs="auto"> <StudyBox study={s}/> </Col>
            )
        }
        else {
            if(s.state === STATES.RUNNING) {
                running_studies.push(
                    <Row key={s.id}> <NavLink onClick={(event) => handleClickStudyLink(event, s.id)}> {s.name} </NavLink> </Row>
                )
            }
            else if(s.state === STATES.FINISHED) {
                if (new Date(s.startDate.split('T')[0]) > new Date()) {
                    finished_future_studies.push(
                        <Row key={s.id}> <NavLink onClick={(event) => handleClickStudyLink(event, s.id)}> {s.name} </NavLink> </Row>
                    )
                } else {
                    finished_done_studies.push(
                        <Row key={s.id}> <NavLink onClick={(event) => handleClickStudyLink(event, s.id)}> {s.name} </NavLink> </Row>
                    )
                }
                
            } else {
                setup_unfinished_studies.push(
                    <Row key={s.id}> <NavLink onClick={(event) => handleClickSetupStudy(event, s.id)}> {s.name} </NavLink> </Row>
                )
            }
        }
    }

    return (
        <>
            <div className="curr-studies">
                <Container fluid>
                    <Row>
                        <label className="headline"> Recent Studies </label>
                    </Row>
                    <Row>
                        {recent_studies}
                    </Row>
                    <Row>
                        <Col>
                            <Row> <label className="headline"> Open Studies </label> </Row>
                            {running_studies}
                        </Col>
                        <Col>
                            <Row> <label className="headline"> Closed Studies [Done] </label> </Row>
                            {finished_done_studies}
                        </Col>
                        <Col>
                            <Row> <label className="headline"> Closed Studies [Future] </label> </Row>
                            {finished_future_studies}
                        </Col>
                        <Col>
                            <Row> <label className="headline"> Setup not finished </label> </Row>
                            {setup_unfinished_studies}
                        </Col>
                    </Row>
                    <Row className="button-center">
                        <Button className="button1" onClick={handleClickCreateStudy}> Create Study </Button>
                        <Button className="button1" onClick={handleClickImportStudy}> Import Study </Button>
                    </Row>
                </Container>
            </div>
        </>
    )
}
