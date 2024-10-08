import React, { useState } from "react";
import { Container, Row, Col, Button, NavLink, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router";

import { STATES } from "../study_overview/StudyOverviewLayout";

import StudyBox from "./StudyBox";

import "./Dashboard.css";

export default function FilledDashboard(props) {

    const STUDY_ENUM = {
        RUNNING: 'running',
        FINISHED_DONE: 'finished_done',
        FINISHED_FUTURE: 'finished_future',
        SETUP_UNFINISHED: 'setup_unfinished'
    }

    const STUDY_LABELS = {
        RUNNING: 'Open Studies',
        FINISHED_DONE: 'Closed Studies [Done]',
        FINISHED_FUTURE: 'Closed Studies [Future]',
        SETUP_UNFINISHED: 'Setup Not Finished'
    }

    const [activeStudyType, setActiveStudyType] = useState(STUDY_ENUM.RUNNING)
    const [activeLabel, setActiveLabel] = useState(STUDY_LABELS.RUNNING)
    const [expanded, setExpanded] = useState(false)

    const handleSelect = (eventKey) => {
        setActiveStudyType(eventKey)
        setExpanded(false)

        switch (eventKey) {
            case STUDY_ENUM.RUNNING:
                setActiveLabel(STUDY_LABELS.RUNNING)
                break
            case STUDY_ENUM.FINISHED_DONE:
                setActiveLabel(STUDY_LABELS.FINISHED_DONE)
                break
            case STUDY_ENUM.FINISHED_FUTURE:
                setActiveLabel(STUDY_LABELS.FINISHED_FUTURE)
                break
            case STUDY_ENUM.SETUP_UNFINISHED:
                setActiveLabel(STUDY_LABELS.SETUP_UNFINISHED)
                break
        }
    }

    const navigate = useNavigate()
    const max_amount_boxes = 5

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

    const renderStudies = () => {
        let studiesList = null

        switch (activeStudyType) {
            case STUDY_ENUM.RUNNING:
                studiesList = running_studies
                break
            case STUDY_ENUM.FINISHED_DONE:
                studiesList = finished_done_studies
                break
            case STUDY_ENUM.FINISHED_FUTURE:
                studiesList = finished_future_studies
                break
            case STUDY_ENUM.SETUP_UNFINISHED:
                studiesList = setup_unfinished_studies
                break
        }

        if (!studiesList || studiesList.length === 0) {
            return <div>No entries available at the moment.</div>
        }

        return studiesList
    }

    return (
        <>
            <div className="curr-studies">
                <Container fluid className="p-0 mx-auto">
                    <Row className="justify-content-between">
                        <Col lg={7}>
                            <Row>
                                <label className="headline">Recent Studies</label>
                            </Row>
                            <Row className="recent-studies-container">
                                {recent_studies}
                            </Row>
                            <Row className="mt-4 mb-4 d-flex justify-content-center">
                                <Button className="buttonDashboard mr-3" onClick={handleClickCreateStudy}>
                                    Create Study
                                </Button>
                                <Button className="buttonDashboard" onClick={handleClickImportStudy}>
                                    Import Study
                                </Button>
                            </Row>
                        </Col>

                        <Col xs="auto" className="d-flex justify-content-center align-items-center">
                            <div className="divider" />
                        </Col>

                        <Col lg={4}>
                            <Navbar expand={false} className="custom-navbar" variant="dark" expanded={expanded}>
                                <Navbar.Brand>{activeLabel}</Navbar.Brand>
                                <Navbar.Toggle
                                    aria-controls="basic-navbar-nav"
                                    onClick={() => setExpanded((prev) => !prev)}
                                />
                                <Navbar.Collapse id="basic-navbar-nav">
                                    <Nav className="ml-auto">
                                        <Nav.Link
                                            className="custom-navbar__link"
                                            active={activeStudyType === STUDY_ENUM.RUNNING}
                                            onClick={() => handleSelect(STUDY_ENUM.RUNNING)}
                                        >
                                            {STUDY_LABELS.RUNNING}
                                        </Nav.Link>
                                        <Nav.Link
                                            className="custom-navbar__link"
                                            active={activeStudyType === STUDY_ENUM.FINISHED_DONE}
                                            onClick={() => handleSelect(STUDY_ENUM.FINISHED_DONE)}
                                        >
                                            {STUDY_LABELS.FINISHED_DONE}
                                        </Nav.Link>
                                        <Nav.Link
                                            className="custom-navbar__link"
                                            active={activeStudyType === STUDY_ENUM.FINISHED_FUTURE}
                                            onClick={() => handleSelect(STUDY_ENUM.FINISHED_FUTURE)}
                                        >
                                            {STUDY_LABELS.FINISHED_FUTURE}
                                        </Nav.Link>
                                        <Nav.Link
                                            className="custom-navbar__link"
                                            active={activeStudyType === STUDY_ENUM.SETUP_UNFINISHED}
                                            onClick={() => handleSelect(STUDY_ENUM.SETUP_UNFINISHED)}
                                        >
                                            {STUDY_LABELS.SETUP_UNFINISHED}
                                        </Nav.Link>
                                    </Nav>
                                </Navbar.Collapse>
                            </Navbar>

                            <div className="study-list mt-3">
                                {renderStudies()}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}
