import {useNavigate, useParams} from "react-router";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import React, {useEffect} from "react";
import {Container, Row, Col, ListGroup, Card, Button} from "react-bootstrap";
import {getTexts, selectTexts} from "../../redux/reducers/textSlice";
import {getConditions, selectConditions} from "../../redux/reducers/conditionSlice";
import {getPauses, selectPauses} from "../../redux/reducers/pauseSlice";
import {
    getStudy,
    getStudySetupInfo,
    selectStudy,
    selectStudySetupInfo,
    updateStudy
} from "../../redux/reducers/studySlice";
import {useDispatch, useSelector} from "react-redux";
import LoadingScreen from "../../components/LoadingScreen";
import {reformatDate} from "../../components/CommonFunctions";


export default function CreateCheck() {
    const { study_id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const study = useSelector(selectStudy)
    const studySetupInfo = useSelector(selectStudySetupInfo)
    const texts = useSelector(selectTexts)
    const conditions = useSelector(selectConditions)
    const pauses = useSelector(selectPauses)

    useEffect(  () => {
        dispatch(getStudy(study_id)).then(() => {
            dispatch(getStudySetupInfo(study_id))
        })
        dispatch(getTexts(study_id))
        dispatch(getConditions(study_id))
        dispatch(getPauses(study_id))
    }, [])

    if (study == null || studySetupInfo == null
        || texts == null || conditions == null || pauses == null) {
        return <LoadingScreen/>
    }

    const getProcedureStep = (orderObject, key) => {
        let header = ""

        if (orderObject.text_id != null) {
            header = texts.find(obj => obj.id === orderObject.text_id).title + " - Text"
        }
        else if (orderObject.condition_id != null) {
            header = conditions.find(obj => obj.id === orderObject.condition_id).name + " - Condition"
        }
        else if (orderObject.questionnaire_id != null) {
            header = "Questionnaire"
        }
        else if (orderObject.pause_id != null) {
            header = pauses.find(obj => obj.id === orderObject.pause_id).title + " - Pause"
        }

        return <Card className="m-1 p-1" style={{ "width": "300px" }} key={key}> {header} </Card>
    }

    const handleFinish = async (event) => {
        event.preventDefault()
        // TODO .....?
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
                <ListGroup>
                    {
                        studySetupInfo.planned_procedure.map((orderObject, index) => {
                         return getProcedureStep(orderObject, index)
                        })
                    }
                </ListGroup>
            </Row>
            <Row className="mt-3"> <hr/> </Row>
            <Row className='mt-0' xs="auto">
                <Button size="lg" onClick={handleFinish}>Finish</Button>
            </Row>
        </Container>

        </StudyCreationLayout>
    )
}