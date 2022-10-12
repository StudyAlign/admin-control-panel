import React, {useEffect, useState} from "react";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import {ProcedureTypes} from "./ProcedureObject";
import {useNavigate, useParams} from "react-router";
import {Button, Card, Col, Container, ListGroup, Row, Accordion} from "react-bootstrap";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import ProcedureObject from "./ProcedureObject";
import {useDispatch, useSelector} from "react-redux";
import {getTexts, selectTexts} from "../../redux/reducers/textSlice";
import {getConditions, selectConditions} from "../../redux/reducers/conditionSlice";
import {getQuestionnaires, selectQuestionnaires} from "../../redux/reducers/questionnaireSlice";
import {getPauses, selectPauses} from "../../redux/reducers/pauseSlice";
import {getStudySetupInfo, selectStudySetupInfo, updateStudy} from "../../redux/reducers/studySlice";
import ProcedureAlert from "./ProcedureAlert";

export default function CreateProcedure() {
    const dispatch = useDispatch()
    const { study_id } = useParams()
    const navigate = useNavigate()

    const [notStoredSteps, setNotStoredSteps] = useState([])
    const [idCounter, setIdCounter] = useState(0)
    const [message, setMessage] = useState({
        type: "none", // "success"/"danger"/"warning"/"info"
        text: "..."
    })

    const texts = useSelector(selectTexts)
    const conditions = useSelector(selectConditions)
    const pauses = useSelector(selectPauses)
    const questions = useSelector(selectQuestionnaires)
    const studySetupInfo = useSelector(selectStudySetupInfo)

    useEffect(  () => {
        dispatch(getTexts(study_id))
        dispatch(getConditions(study_id))
        dispatch(getQuestionnaires(study_id))
        dispatch(getPauses(study_id))
        dispatch(getStudySetupInfo(study_id))
    }, [])

    let procedure = []
    if (texts != null && questions != null && pauses != null && conditions != null) {
        let texts_c = [...texts]
        let conditions_c = [...conditions]
        let pauses_c = [...pauses]
        let questions_c = [...questions]

        if (studySetupInfo.planned_procedure != null) {
            for (let step of studySetupInfo.planned_procedure) {
                if (step["text_id"] != null) {
                    let idx = texts_c.findIndex(obj => {
                        return obj.id === step["text_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "t" + step["text_id"].toString(),
                            type: ProcedureTypes.TextPage,
                            content: texts_c[idx],
                            stored: true
                        })
                        texts_c.splice(idx, 1)
                    }
                }
                else if (step["condition_id"] != null) {
                    let idx = conditions_c.findIndex(obj => {
                        return obj.id === step["condition_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "c" + step["condition_id"].toString(),
                            type: ProcedureTypes.Condition,
                            content: conditions_c[idx],
                            stored: true
                        })
                        conditions_c.splice(idx, 1)
                    }
                }
                else if (step["questionnaire_id"] != null) {
                    let idx = questions_c.findIndex(obj => {
                        return obj.id === step["questionnaire_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "q" + step["questionnaire_id"].toString(),
                            type: ProcedureTypes.Questionnaire,
                            content: questions_c[idx],
                            stored: true
                        })
                        questions_c.splice(idx, 1)
                    }
                }
                else if (step["pause_id"] != null) {
                    let idx = pauses_c.findIndex(obj => {
                        return obj.id === step["pause_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "p" + step["pause_id"].toString(),
                            type: ProcedureTypes.Pause,
                            content: pauses_c[idx],
                            stored: true
                        })
                        pauses_c.splice(idx, 1)
                    }
                }
            }
        }

        for (let text of texts_c) {
            procedure.push({id: "t" + text.id.toString(), type: ProcedureTypes.TextPage, content: text, stored: true})
        }
        for (let cond of conditions_c) {
            procedure.push({id: "c" + cond.id.toString(), type: ProcedureTypes.Condition, content: cond, stored: true})
        }
        for (let quest of questions_c) {
            procedure.push({id: "q" + quest.id.toString(), type: ProcedureTypes.Questionnaire, content: quest, stored: true})
        }
        for (let pause of pauses_c) {
            procedure.push({id: "p" + pause.id.toString(), type: ProcedureTypes.Pause, content: pause, stored: true})
        }

        procedure.push(...notStoredSteps)
    }

    const onDragEnd = async (result) => {
        if(result.destination === null) return
        const idx_src = result.source.index
        const idx_dest = result.destination.index
        if(idx_src === idx_dest) return
        let obj = procedure[idx_src]
        procedure.splice(idx_src, 1)
        procedure.splice(idx_dest, 0, obj)
        let planned_procedure = getPlannedProcedure()
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {"planned_procedure": planned_procedure}
        }))
        await dispatch(getStudySetupInfo(study_id))
    }

    const getPlannedProcedure = () => {
        let planned_procedure = []
        for (const step of procedure) {
            if (step.stored) {
                let obj = {}
                obj[step.type.key + "_id"] = step.content.id
                planned_procedure.push(obj)
            }
        }
        return planned_procedure
    }

    const createProcedureStep = (event, procedureType) => {
        event.preventDefault()
        let empty_content = procedureType.emptyContent
        empty_content.study_id = study_id
        let n_steps = [...notStoredSteps]
        let step = {
            id: "x" + idCounter,
            type: procedureType,
            content: empty_content,
            stored: false
        }
        setIdCounter(idCounter+1)
        n_steps.push(step)
        setNotStoredSteps(n_steps)
    }

    const removeFromNotStored = async (id) => {
        let idx = notStoredSteps.findIndex(obj => {
            return obj.id === id
        })

        if (idx > -1) {
            let nss = [...notStoredSteps]
            nss.splice(idx, 1)
            setNotStoredSteps(nss)
        }
    }

    const procedureStepButtons = () => {
        let buttons = []
        for (let t in ProcedureTypes) {
            buttons.push(
                <Col xs={'auto'} key={ProcedureTypes[t].id}>
                    <Button onClick={(event) => createProcedureStep(event, ProcedureTypes[t])}> { ProcedureTypes[t].label } </Button>
                </Col>
            )
        }
        return buttons
    }

    const handleProceed = async (event) => {
        event.preventDefault()
        let planned_procedure = getPlannedProcedure()
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "planned_procedure": planned_procedure,
                "current_setup_step": "procedure"
            }
        }))
        await dispatch(getStudySetupInfo(study_id))
        navigate("/create/"+study_id+"/integrations")
    }

    return (
        <StudyCreationLayout step={CreationSteps.Procedure}>

            <Container>
                <Row className='mt-3'>
                    <ProcedureAlert message={message}/>
                </Row>

                <Row className='mt-3'>
                    { procedureStepButtons() }
                </Row>

                <Row className='mt-3'>
                    <Col>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Card>
                            <Card.Header> Procedure Order </Card.Header>
                            <Card.Body>

                                <Accordion>
                                <Droppable droppableId={"procedure-0"}>
                                    {provided => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            <ListGroup>
                                                {
                                                    procedure.map((ps, index) => (
                                                    <ProcedureObject key={ps.id}
                                                                     id={ps.id}
                                                                     index={index}
                                                                     content={ps.content}
                                                                     type={ps.type}
                                                                     stored={ps.stored}
                                                                     setMessage={setMessage}
                                                                     removeFromNotStored={removeFromNotStored}
                                                    />
                                                ))
                                                }
                                            </ListGroup>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                </Accordion>

                            </Card.Body>
                        </Card>
                    </DragDropContext>
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col> <Button size="lg" onClick={handleProceed}>Save and Proceed</Button> </Col>
                </Row>
            </Container>

        </StudyCreationLayout>
    )
}