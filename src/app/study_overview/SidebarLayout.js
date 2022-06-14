import React from "react";
import {Container, Row, Col, Nav } from "react-bootstrap";
import "./StudyOverview.css"
import "bootstrap/dist/css/bootstrap.css";

export default function SidebarLayout(props){
    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={"auto"} id="sidebar-wrapper">
                        <Nav className="col-md-12 d-none d-md-block sidebar">
                            <Nav.Item>
                                <Nav.Link className="sidebar-item" href="#overview">Overview</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className="sidebar-item" href="#procedure">Procedure</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className="sidebar-item" href="#data">Interaction Data</Nav.Link>
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