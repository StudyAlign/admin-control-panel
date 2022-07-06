import React from "react";
import {useNavigate} from "react-router";
import {Container, Row, Col, Button} from "react-bootstrap";
import {PeopleFill} from "react-bootstrap-icons";
import "./Dashboard.css"

export default function StudyBox(props) {
    const navigate = useNavigate();
    const study = props.study

    const handleClickOverview = (event) => {
        event.preventDefault()
        navigate("/study/"+study.id+"/overview")
    }

    function getStatusLabel(is_active) {
        let label
        if (is_active) {
            label = <label className={"status-label running"}> Running </label>
        }
        else {
            label = <label className={"status-label finished"}> Closed </label>
        }
        return label
    }

    function getButton2(is_active) {
        let button
        if (is_active) {
           button = <Button className="button1"> Interaction Logs </Button>
        }
        else {
            button = <Button className="button1"> Export Data </Button>
        }
        return button
    }

    const reformatDate = (dateString) => {
        const date = new Date(dateString)
        let day = date.getDate()
        if(day < 10) day = "0" + day
        let month = date.getMonth()
        if(month < 10) month = "0" + month
        let year = date.getFullYear()
        return day + "." + month + "." + year
    }

    // TODO Amount participants and max participants has to be read from backend in order to display
    return(
        <div className="study-box">
            <Container>
                <Row>
                    <Col> { getStatusLabel(study.is_active) } </Col>
                    <Col> <label className="participants-label"> <PeopleFill/> {"N.A." + "/" + "N.A."} </label> </Col>
                </Row>
                <Row>
                    <Col> <label className="study-name-label"> {study.name} </label> </Col>
                </Row>
                <Row>
                    <Col> <label className="date-label"> {reformatDate(study.startDate) + " - " + reformatDate(study.endDate)} </label> </Col>
                </Row>
                <Row style={{"marginTop": "15px"}}>
                    <Col xs="auto"> <Button className="button1" onClick={handleClickOverview}> Overview </Button> </Col>
                    <Col> { getButton2(study.is_active) } </Col>
                </Row>
            </Container>
        </div>
    )
}