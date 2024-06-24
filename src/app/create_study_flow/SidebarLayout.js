import React, { useContext } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";

import { CreationSteps } from "./StudyCreationLayout";
import { updateStudy, getStudySetupInfo } from "../../redux/reducers/studySlice";
import { CreationOrder } from "./StudyCreationLayout";
import { EmptyProcedureOrder, EmptyProcedureOrderProvider } from "./CreateProcedure";

import "./CreateStudyFlow.css";


export default function SidebarLayout(props){

    const { setEmptyOrder, emptyOrderListener } = useContext(EmptyProcedureOrder)

    const { study_id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const getClassName = (step) => {
        let className = 'sidebar-item'
        if (step === props.step) {
            className += ' sidebar-item-selected'
        }
        return className
    }

    const handleNavigation = async (event, step, navTo) => {
        // return if the step is already selected
        if (props.step + 1 === CreationOrder.indexOf(navTo)) {
            event.preventDefault()
            return
        }
        // return if the order is empty
        if (props.step === CreationSteps.Procedure && emptyOrderListener) {
            event.preventDefault()
            setEmptyOrder(true)
            return
        }
        // else update and navigate
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "current_setup_step": step
            }
        }))
        await dispatch(getStudySetupInfo(study_id))
        navigate("create/" + study_id + "/" + navTo)
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={"auto"} id="sidebar-wrapper">
                        <Nav className="col-md-12 d-none d-md-block sidebar">
                            <Nav.Item>
                                <Nav.Link onClick={(event) => handleNavigation(event,CreationOrder[0],CreationOrder[1])} className={getClassName(CreationSteps.Information)}> (1) Study </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                {/*TODO:0 -> 1, if backend is ready*/}
                                <Nav.Link onClick={(event) => handleNavigation(event,CreationOrder[0],CreationOrder[2])} className={getClassName(CreationSteps.Procedure)}> (2) Procedure </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link onClick={(event) => handleNavigation(event,CreationOrder[2],CreationOrder[3])} className={getClassName(CreationSteps.Integrations)}> (3) Integrations </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link disabled style={{ cursor: "not-allowed" }} className={getClassName(CreationSteps.Check)} > (4) Check </Nav.Link>
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