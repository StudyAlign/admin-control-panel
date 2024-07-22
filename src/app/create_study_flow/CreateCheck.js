import { useNavigate, useParams } from "react-router";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import React, { useEffect } from "react";

import { getTexts, selectTexts } from "../../redux/reducers/textSlice";
import { getConditions, selectConditions } from "../../redux/reducers/conditionSlice";
import { getPauses, selectPauses } from "../../redux/reducers/pauseSlice";
import {
    getProcedureConfig,
    getStudy,
    getStudySetupInfo,
    selectStudy,
    selectStudySetupInfo,
    selectStudyProcedure,
    updateStudy,
    generateProceduresWithSteps,
    generateParticipants,
    // populateSurveyParticipants,
    selectStudyProcedureOverview,
    getProcedureConfigOverview,
} from "../../redux/reducers/studySlice";
import { useDispatch, useSelector } from "react-redux";

import Topbar from "../../components/Topbar";
import LoadingScreen from "../../components/LoadingScreen";
import { reformatDate } from "../../components/CommonFunctions";
import ShowProcedure from "./ShowProcedure";
import StudyCreationLayout, { CreationSteps } from "./navigation_logic/StudyCreationLayout";


export default function CreateCheck() {
    const { study_id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const study = useSelector(selectStudy)
    const studySetupInfo = useSelector(selectStudySetupInfo)
    const texts = useSelector(selectTexts)
    const conditions = useSelector(selectConditions)
    const pauses = useSelector(selectPauses)
    const procedureConfig = useSelector(selectStudyProcedure)
    const procedureConfigOverview = useSelector(selectStudyProcedureOverview)

    useEffect(  () => {
        dispatch(getStudy(study_id))
        dispatch(getStudySetupInfo(study_id))
        dispatch(getProcedureConfig(study_id)).then((response) => {
            if (response.payload.body.id) {
                dispatch(getProcedureConfigOverview(response.payload.body.id))
            }
        })

    }, [])

    if (study == null || studySetupInfo == null || procedureConfig == null || procedureConfigOverview == null) {
        return (
            <>
                <Topbar />
                <LoadingScreen />
            </>
        )
    }

    const handleFinish = async (event) => {
        event.preventDefault()

        // let procedureScheme = studySetupInfo.planned_procedure.map(step =>
        //     step.condition_id == null ? step : {"dummy": true}
        // )

        // DEPRECATED
        await dispatch(generateProceduresWithSteps({
            "studyId": study_id,
            "procedureScheme": studySetupInfo.planned_procedure
        }))

        await dispatch(generateParticipants({
            "studyId": study_id,
            "amount": studySetupInfo.planned_number_participants
        }))

        // DEPRECATED
        // if (studySetupInfo.planned_procedure.findIndex(step => step.questionnaire_id != null) > -1) {
        //     await dispatch(populateSurveyParticipants(study_id))
        // }

        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "current_setup_step": "check"
            }
        }))
        navigate("/study/" + study_id + "/overview")
    }

    return (
        <StudyCreationLayout step={CreationSteps.Check}>
        <Container>
            <Row> <h3> Overview </h3> </Row>
            <Row>
                <Col xs={2}> <b> Name: </b> </Col>
                <Col> {study.name} </Col>
            </Row>
            <Row>
                <Col xs={2}> <b> Start Date: </b> </Col>
                <Col> {reformatDate(study.startDate)} </Col>
            </Row>
            <Row>
                <Col xs={2}> <b> End Date: </b> </Col>
                <Col> {reformatDate(study.endDate)} </Col>
            </Row>
            <Row>
                <Col xs={2}> <b> Number Participants: </b> </Col>
                <Col> {studySetupInfo.planned_number_participants} </Col>
            </Row>
            <Row>
                <Col xs={2}> <b> Description: </b> </Col>
                <Col> {study.description} </Col>
            </Row>
            <Row>
                <Col xs={2}> <b> Consent: </b> </Col>
                <Col> {study.consent} </Col>
            </Row>

            <Row className="mt-3"> <hr/> </Row>
            <Row> <h3> Procedure </h3></Row>
            <Row>
                <ShowProcedure procedureId={procedureConfig && procedureConfig.id} />
            </Row>
            <Row className="mt-3"> <hr/> </Row>
            <Row className='mt-0' xs="auto">
                <Button size="lg" onClick={handleFinish}>Finish</Button>
            </Row>
        </Container>

        </StudyCreationLayout>
    )
}