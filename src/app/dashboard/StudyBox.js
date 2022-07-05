import React from "react";
import {Container, Row, Col, Button} from "react-bootstrap";
import {PeopleFill} from "react-bootstrap-icons";
import "./Dashboard.css"

export default function StudyBox(props) {
    const study = props.study

    function getButton2(status) {
        let button
        if (status === "Running") {
           button = <Button className="button1"> Interaction Logs </Button>
        }
        else if (status === "Finished") {
            button = <Button className="button1"> Export Data </Button>
        }
        else if (status === "Created") {
            button = <Button className="button1"> Edit Procedure </Button>
        }
        else {
            button = <></>
        }
        return button
    }

    return(
        <div className="study-box">
            <Container>
                <Row>
                    <Col> <label className={"status-label " + study.status.toLowerCase()}> {study.status} </label> </Col>
                    <Col> <label className="participants-label"> <PeopleFill/> {study.participants + "/" + study.max_participants} </label> </Col>
                </Row>
                <Row>
                    <Col> <label className="study-name-label"> {study.name} </label> </Col>
                </Row>
                <Row>
                    <Col> <label className="date-label"> {study.startDate + " - " + study.endDate} </label> </Col>
                </Row>
                <Row style={{"marginTop": "15px"}}>
                    <Col xs="auto"> <Button className="button1"> Overview </Button> </Col>
                    <Col> { getButton2(study.status) } </Col>
                </Row>
            </Container>
        </div>
    )
}