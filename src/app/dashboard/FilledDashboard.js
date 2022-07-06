import React, {useEffect} from "react";
import {Container, Row, Col, Button, NavLink} from "react-bootstrap";
import "./Dashboard.css";
import StudyBox from "./StudyBox";
import {useNavigate} from "react-router";

export default function FilledDashboard(props) {
    const navigate = useNavigate();
    const max_amount_boxes = 3;

    const handleClickStudyLink = (event, study_id) => {
        event.preventDefault()
        navigate("/study/"+study_id+"/overview")
    }

    const handleClickCreateStudy = (event) => {
        event.preventDefault()
        navigate("/create")
    }

    // TODO how to declare which (and how many) studies are shown as boxes
    let recent_studies = []
    for(let s of props.studies) {
        recent_studies.push(
            <Col key={s.id} xs="auto"> <StudyBox study={s}/> </Col>
        )
        if(recent_studies.length === max_amount_boxes) {
            break
        }
    }

    let running_studies = []
    let finished_studies = []
    for(let s of props.studies) {
        if(s.is_active) {
            running_studies.push(
                <Row key={s.id}> <NavLink onClick={(event) => handleClickStudyLink(event, s.id)}> {s.name} </NavLink> </Row>
            )
        }
        else {
            finished_studies.push(
                <Row key={s.id}> <NavLink onClick={(event) => handleClickStudyLink(event, s.id)}> {s.name} </NavLink> </Row>
            )
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
                            <Row> <label className="headline"> Running Studies </label> </Row>
                            {running_studies}
                        </Col>
                        <Col>
                            <Row> <label className="headline"> Finished Studies </label> </Row>
                            {finished_studies}
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Button className="button1" onClick={handleClickCreateStudy}> Create Study </Button>
                    </Row>
                </Container>
            </div>
        </>
    )
}
