import React from "react";
import {Container, Row, Col, Nav } from "react-bootstrap";
import {useNavigate, useParams} from "react-router";
import "./CreateStudyFlow.css"

export default function SidebarLayout(props){
    const page = "study" // mock -> change this

    const getClassName = (section) => {
        let className = 'sidebar-item'
        if (section === page) {
            className += ' sidebar-item-selected'
        }
        return className
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={"auto"} id="sidebar-wrapper">
                        <Nav className="col-md-12 d-none d-md-block sidebar">
                            <Nav.Item>
                                <Nav.Link className={getClassName("study")}> (1) Study </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className={getClassName("procedure")}> (2) Procedure </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className={getClassName("Integrations")}> (3) Integrations </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className={getClassName("Check")}> (4) Check </Nav.Link>
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