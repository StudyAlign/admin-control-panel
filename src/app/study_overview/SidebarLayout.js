import React from "react";
import {Container, Row, Col, Nav } from "react-bootstrap";
import {useNavigate, useParams} from "react-router";
import "./StudyOverview.css"

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
                <Row>
                    <Col xs={"auto"} id="sidebar-wrapper">
                        <Nav className="col-md-12 d-none d-md-block sidebar">
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
                    <Col xs={10} id="page-content-wrapper">
                        {props.children}
                    </Col>
                </Row>
            </Container>
        </>
    );
};