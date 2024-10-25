import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";

import { UserSteps } from "./UserCreationLayout";

import "../SidebarAndReactStyles.css";


export default function SidebarLayout(props){

    const { user_id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const getClassName = (step) => {
        let className = 'sidebar-item'
        if (step === props.step) {
            className += ' sidebar-item-selected'
        }
        return className
    }

    const getClassNameCheck = (step) => {
        let className = 'sidebar-item-check'
        if (step === props.step) {
            className += ' sidebar-item-selected-check'
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
                                <Nav.Link className={getClassNameCheck(UserSteps.Create)}> (1) Create </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link className={getClassNameCheck(UserSteps.Information)}> (2) Information </Nav.Link>
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