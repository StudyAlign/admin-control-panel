import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";

import { CreationSteps } from "./StudyCreationLayout";

import "../../SidebarAndReactStyles.css";

export default function SidebarLayoutStatic(props){

    const getClassName = (step) => {
        let className = 'sidebar-item'
        if (step === props.step) {
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
                                <Nav.Link className={getClassName(CreationSteps.Information)}> (1) Study </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link disabled className={getClassName(CreationSteps.Procedure)}> (2) Procedure </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link disabled className={getClassName(CreationSteps.Integrations)}> (3) Integrations </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link disabled className={getClassName(CreationSteps.Check)}> (4) Check </Nav.Link>
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
