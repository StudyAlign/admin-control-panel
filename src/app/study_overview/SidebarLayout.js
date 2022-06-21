import React from "react";
import {Container, Row, Col, Nav } from "react-bootstrap";
import { useParams } from "react-router";
import "./StudyOverview.css"
import "bootstrap/dist/css/bootstrap.css";

export default function SidebarLayout(props){
    const { study_id, page } = useParams() // TODO use page to highlight the currently selected link

    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={"auto"} id="sidebar-wrapper">
                        <Nav className="col-md-12 d-none d-md-block sidebar">
                            <Nav.Item>
                                <Nav.Link className="sidebar-item" href={"/study/"+study_id+"/overview"}>Overview</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className="sidebar-item" href={"/study/"+study_id+"/procedure"}>Procedure</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className="sidebar-item" href={"/study/"+study_id+"/data"}>Interaction Data</Nav.Link>
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