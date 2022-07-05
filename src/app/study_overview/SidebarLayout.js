import React from "react";
import {Container, Row, Col, Nav } from "react-bootstrap";
import { useParams } from "react-router";
import "./StudyOverview.css"

export default function SidebarLayout(props){
    const { study_id, page } = useParams()

    let classOverview = 'sidebar-item'
    let classProcedure = 'sidebar-item'
    let classData = 'sidebar-item'
    if (page === 'overview') {
        classOverview += ' sidebar-item-selected'
    }
    else if (page === 'procedure') {
        classProcedure += ' sidebar-item-selected'
    }
    else if (page === 'data') {
        classData += ' sidebar-item-selected'
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={"auto"} id="sidebar-wrapper">
                        <Nav className="col-md-12 d-none d-md-block sidebar">
                            <Nav.Item>
                                <Nav.Link className={classOverview} href={"./overview"}>Overview</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className={classProcedure} href={"./procedure"}>Procedure</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className={classData} href={"./data"}>Interaction Data</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col xs={10} id="page-content-wrapper">
                        {props.children}
                    </Col>
                </Row>
            </Container>
        </>
    );
};