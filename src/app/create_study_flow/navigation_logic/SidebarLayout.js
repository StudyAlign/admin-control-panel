import React, { useContext } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import {useDispatch, useSelector} from "react-redux";

import { CreationSteps } from "./StudyCreationLayout";
import {studySlice, updateStudy, getStudySetupInfo, selectStudySetupInfo} from "../../../redux/reducers/studySlice";
import { CreationOrder } from "./StudyCreationLayout";
import { CreateProcedureContext } from "../CreateProcedure";

import "../../SidebarAndReactStyles.scss";


export default function SidebarLayout(props){

    const studySetupInfo = useSelector(selectStudySetupInfo)

    console.log(studySetupInfo)

    const { setEmptyOrder, emptyOrderListener } = useContext(CreateProcedureContext)

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
        console.log(props.step + 1 === CreationOrder.indexOf(navTo))
        if (props.step + 1 === CreationOrder.indexOf(navTo)) {
            event.preventDefault()
            return
        }
        // return if the order is empty
        // if (props.step === CreationSteps.Procedure) {
        //     await dispatch(studySlice.actions.resetProcedureOverview())
        //     if(emptyOrderListener) {
        //         event.preventDefault()
        //         setEmptyOrder(true)
        //         return
        //     }
        // }

        // else update and navigate
        // await dispatch(updateStudy({
        //     "studyId": study_id,
        //     "study": {
        //         "current_setup_step": step
        //     }
        // }))
        // await dispatch(getStudySetupInfo(study_id))
        navigate("/create/" + study_id + "/" + navTo)
    }

    const getLink = (label, step, navStep, navTo) => {
        const current_setup_step = studySetupInfo ? CreationOrder.indexOf(studySetupInfo.current_setup_step) : 0
        // Only disable links if study is new OR it is in setup state
        if (studySetupInfo == null ||  (studySetupInfo && studySetupInfo.state == "setup")) {
            if (step > current_setup_step) {
                return <Nav.Link disabled className={getClassName(step)}>{label}</Nav.Link>
            }
        }
        return <Nav.Link onClick={(event) => handleNavigation(event, navStep, navTo)} className={getClassName(step)}>{label}</Nav.Link>
    }

    return (
        <>
            <Container fluid>
                <Row className="">
                    <Col id="sidebar-wrapper" className="flex-grow-1">
                        <Nav className="d-block sidebar">
                            <Nav.Item>
                                { getLink("Information", CreationSteps.Information, CreationOrder[0], CreationOrder[1]) }
                            </Nav.Item>
                            <Nav.Item>
                                { getLink("Procedure", CreationSteps.Procedure, CreationOrder[1], CreationOrder[2]) }
                            </Nav.Item>
                            <Nav.Item>
                                { getLink("Integrations", CreationSteps.Integrations, CreationOrder[2], CreationOrder[3]) }
                            </Nav.Item>
                            <Nav.Item>
                                { getLink("Check", CreationSteps.Check, CreationOrder[3], CreationOrder[4]) }
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