import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";

import "./StudyOverview.css";
import "../SidebarAndReactStyles.scss";

export default function SidebarLayout(props){
    const navigate = useNavigate();
    const { study_id, page } = useParams()

    const getClassName = (section) => {
        let className = 'sidebar-item'
        if (section === page) {
            className += ' sidebar-item-selected'
        }
        return className
    }

    const handleClickOverview = (event) => {
        event.preventDefault()
        navigate("/study/"+study_id+"/overview")
    }

    const handleClickProcedure = (event) => {
        event.preventDefault()
        navigate("/study/"+study_id+"/procedure")
    }

    const handleClickData = (event) => {
        event.preventDefault()
        navigate("/study/"+study_id+"/data")
    }

    return (
        <>
            <Container fluid>
                <Row className="d-flex flex-nowrap">
                    <Col id="sidebar-wrapper">
                        <Nav className="d-none d-md-block sidebar">
                            <Nav.Item>
                                <Nav.Link className={getClassName("overview")} onClick={handleClickOverview}>Overview</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className={getClassName("procedure")} onClick={handleClickProcedure}>Procedure</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className={getClassName("data")} onClick={handleClickData}>Interaction Data</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col id="page-content-wrapper">
                        <Row>
                            <Col xs={12} md={12} lg={10} xl={8}>
                                {props.children}
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
};