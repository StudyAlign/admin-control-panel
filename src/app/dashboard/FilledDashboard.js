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
        console.log("Clicked")
        navigate("/study/"+study_id+"/overview")
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
                <Row> <NavLink onClick={(event) => handleClickStudyLink(event, s.id)} key={s.id}> {s.name} </NavLink> </Row>
            )
        }
    }

    let recent_studies = []
    for(let s of props.studies) {
        recent_studies.push(
            <Col key={s.id} xs="auto"> <StudyBox study={s}/> </Col>
        )
        if(recent_studies.length === max_amount_boxes) {
            break
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
                    <Row className="justify-content-center"> <Button className="button1"> Create Study</Button></Row>
                </Container>
            </div>
        </>
    )
}
// TODO Continue view, if there are to many studies for displaying as boxes
