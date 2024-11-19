import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Button,
    NavLink,
    Navbar,
    Nav,
    NavDropdown,
    Dropdown,
    DropdownButton,
    ButtonGroup
} from "react-bootstrap";
import { useNavigate } from "react-router";

import StudyBox from "./StudyBox";

import { STATES } from "../study_overview/StudyOverviewLayout";

import "./Dashboard.scss";
import {CalendarRange, FunnelFill} from "react-bootstrap-icons";

export default function FilledDashboard(props) {

    const STUDY_ENUM = {
        RECENT: 'recent',
        ALL: 'all',
        RUNNING: STATES.RUNNING,
        FUTURE: 'future',
        CLOSED: STATES.FINISHED,
        SETUP_UNFINISHED: STATES.SETUP
    }

    const STUDY_LABELS = {
        ALL: 'All Studies',
        RUNNING: 'Open Studies',
        FUTURE: 'Future Studies',
        CLOSED: 'Closed Studies',
        SETUP_UNFINISHED: 'Setup Not Finished'
    }

    const [activeStudyType, setActiveStudyType] = useState(STUDY_ENUM.RUNNING)
    const [activeLabel, setActiveLabel] = useState(STUDY_LABELS.RUNNING)
    const [expanded, setExpanded] = useState(false)

    const handleSelect = (eventKey) => {
        setActiveStudyType(eventKey)
        setExpanded(false)

        switch (eventKey) {
            case STUDY_ENUM.ALL:
                setActiveLabel(STUDY_LABELS.ALL)
                break
            case STUDY_ENUM.RUNNING:
                setActiveLabel(STUDY_LABELS.RUNNING)
                break
            case STUDY_ENUM.FUTURE:
                setActiveLabel(STUDY_LABELS.FUTURE)
                break
            case STUDY_ENUM.CLOSED:
                setActiveLabel(STUDY_LABELS.CLOSED)
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
    
    const study_dict = {
        [STUDY_ENUM.RECENT]: [],
        [STUDY_ENUM.ALL]: [],
        [STUDY_ENUM.RUNNING]: [],
        [STUDY_ENUM.FUTURE]: [],
        [STUDY_ENUM.CLOSED]: [],
        [STUDY_ENUM.SETUP_UNFINISHED]: []
    }

    for (let s of props.studies) {

        const study = <Row key={s.id}> <NavLink onClick={(event) => handleClickStudyLink(event, s.id)}> {s.name} </NavLink> </Row>

        if(s.state !== STUDY_ENUM.SETUP_UNFINISHED) {

            study_dict[STUDY_ENUM.ALL].push(study)

            // recent = first studies in backend order
            if(study_dict[STUDY_ENUM.RECENT].length < max_amount_boxes) {
                study_dict[STUDY_ENUM.RECENT].push(
                    <Col key={s.id} md={4}> <StudyBox study={s}/> </Col>
                )
            }

            if (s.state === STUDY_ENUM.RUNNING) {
                study_dict[STUDY_ENUM.RUNNING].push(study)
            }

            if (s.state === STUDY_ENUM.CLOSED) {
                study_dict[STUDY_ENUM.CLOSED].push(study)
            }

            if (new Date(s.startDate.split('T')[0]) > new Date()) {
                study_dict[STUDY_ENUM.FUTURE].push(study)
            }

        } else {
            study_dict[STUDY_ENUM.SETUP_UNFINISHED].push(study)
        }
        
    }

    const renderStudies = () => {
        let studiesList = null

        switch (activeStudyType) {
            case STUDY_ENUM.ALL:
                studiesList = study_dict[STUDY_ENUM.ALL]
                break
            case STUDY_ENUM.RUNNING:
                studiesList = study_dict[STUDY_ENUM.RUNNING]
                break
            case STUDY_ENUM.FUTURE:
                studiesList = study_dict[STUDY_ENUM.FUTURE]
                break
            case STUDY_ENUM.CLOSED:
                studiesList = study_dict[STUDY_ENUM.CLOSED]
                break
            case STUDY_ENUM.SETUP_UNFINISHED:
                studiesList = study_dict[STUDY_ENUM.SETUP_UNFINISHED]
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
                        <Row>
                            <h3 className="headline">Recent Studies</h3>
                        </Row>
                        <Col lg={9}>
                            <Row className="g-2">
                                {study_dict[STUDY_ENUM.RECENT]}
                            </Row>
                        </Col>

                        <Col lg={3}>

                            <Navbar expand={false} className="custom-navbar" expanded={expanded}>
                                <Navbar.Brand>{activeLabel}</Navbar.Brand>
                                <NavDropdown align="end" title={<FunnelFill />} id="custom-navbar-dropdown">
                                    <NavDropdown.Item active={activeStudyType === STUDY_ENUM.ALL}
                                                      onClick={() => handleSelect(STUDY_ENUM.ALL)}>
                                        {STUDY_LABELS.ALL}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item active={activeStudyType === STUDY_ENUM.RUNNING}
                                                      onClick={() => handleSelect(STUDY_ENUM.RUNNING)}>
                                        {STUDY_LABELS.RUNNING}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item active={activeStudyType === STUDY_ENUM.FUTURE}
                                                      onClick={() => handleSelect(STUDY_ENUM.FUTURE)}>
                                        {STUDY_LABELS.FUTURE}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item  active={activeStudyType === STUDY_ENUM.CLOSED}
                                                       onClick={() => handleSelect(STUDY_ENUM.CLOSED)}>
                                        {STUDY_LABELS.CLOSED}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item active={activeStudyType === STUDY_ENUM.SETUP_UNFINISHED}
                                                      onClick={() => handleSelect(STUDY_ENUM.SETUP_UNFINISHED)}>
                                        {STUDY_LABELS.SETUP_UNFINISHED}
                                    </NavDropdown.Item>
                                </NavDropdown>
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
