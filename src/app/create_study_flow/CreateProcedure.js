import React, {useEffect, useState} from "react";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import {ProcedureTypes} from "./ProcedureObject";
import {useParams} from "react-router";
import {Button, Card, Col, Container, ListGroup, Row, Accordion} from "react-bootstrap";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import ProcedureObject from "./ProcedureObject";
import {useDispatch, useSelector} from "react-redux";
import {getTexts, selectTexts} from "../../redux/reducers/textSlice";
import {getConditions, selectConditions} from "../../redux/reducers/conditionSlice";
import {getQuestionnaires, selectQuestionnaires} from "../../redux/reducers/questionnaireSlice";
import {getPauses, selectPauses} from "../../redux/reducers/pauseSlice";
import ProcedureAlert from "./ProcedureAlert";
import {getStudySetupInfo, selectStudySetupInfo, updateStudy} from "../../redux/reducers/studySlice";

export default function CreateProcedure() {
    const dispatch = useDispatch()
    const { study_id } = useParams()
    const [procedure, setProcedure] = useState([])
    const [notStoredSteps, setNSSteps] = useState([])
    const [idCounter, setIdCounter] = useState(0)
    const [message, setMessage] = useState({
        type: "none", // "success"/"danger"/"warning"/"info"
        text: "..."
    })

    useEffect( () => {
        dispatch(getTexts(study_id))
        dispatch(getConditions(study_id))
        dispatch(getQuestionnaires(study_id))
        dispatch(getPauses(study_id))
        dispatch(getStudySetupInfo(study_id))
    }, [])

    const texts = useSelector(selectTexts)
    const conditions = useSelector(selectConditions)
    const pauses = useSelector(selectPauses)
    const questions = useSelector(selectQuestionnaires)

    const studySetupInfo = useSelector(selectStudySetupInfo)


    console.log("Here")
    if (texts != null && questions != null && pauses != null && conditions != null &&
        procedure.length !== texts.length + conditions.length + pauses.length + questions.length) {
        console.log("New Procedure")
        let texts_c = [...texts]
        let conditions_c = [...conditions]
        let pauses_c = [...pauses]
        let questions_c = [...questions]

        let n_procedure = []

        if(studySetupInfo.planned_procedure != null) {
            for(let step of studySetupInfo.planned_procedure) {
                if(step["text_id"] != null) {
                    let idx = texts_c.findIndex(obj => {
                        return obj.id === step["text_id"]
                    })
                    if(idx > -1) {
                        n_procedure.push({
                            id: "t" + step["text_id"].toString(),
                            type: ProcedureTypes.TextPage,
                            content: texts_c[idx],
                            deleted: false
                        })
                        texts_c.splice(idx, 1)
                    }
                }
                else if(step["condition_id"] != null) {
                    let idx = conditions_c.findIndex(obj => {
                        return obj.id === step["condition_id"]
                    })
                    if(idx > -1) {
                        n_procedure.push({
                            id: "c" + step["condition_id"].toString(),
                            type: ProcedureTypes.Condition,
                            content: conditions_c[idx],
                            deleted: false
                        })
                        conditions_c.splice(idx, 1)
                    }
                }
                else if(step["questionnaire_id"] != null) {
                    let idx = questions_c.findIndex(obj => {
                        return obj.id === step["questionnaire_id"]
                    })
                    if(idx > -1) {
                        n_procedure.push({
                            id: "q" + step["questionnaire_id"].toString(),
                            type: ProcedureTypes.Questionnaire,
                            content: questions_c[idx],
                            deleted: false
                        })
                        questions_c.splice(idx, 1)
                    }
                }
                else if(step["pause_id"] != null) {
                    let idx = pauses_c.findIndex(obj => {
                        return obj.id === step["pause_id"]
                    })
                    if (idx > -1) {
                        n_procedure.push({
                            id: "p" + step["pause_id"].toString(),
                            type: ProcedureTypes.Pause,
                            content: pauses_c[idx],
                            deleted: false
                        })
                        pauses_c.splice(idx, 1)
                    }
                }
            }
        }

        for(let text of texts_c) {
            n_procedure.push({id: "t" + text.id.toString(), type: ProcedureTypes.TextPage, content: text, deleted: false})
        }
        for(let cond of conditions_c) {
            n_procedure.push({id: "c" + cond.id.toString(), type: ProcedureTypes.Condition, content: cond, deleted: false})
        }
        for(let quest of questions_c) {
            n_procedure.push({id: "q" + quest.id.toString(), type: ProcedureTypes.Questionnaire, content: quest, deleted: false})
        }
        for(let pause of pauses_c) {
            n_procedure.push({id: "p" + pause.id.toString(), type: ProcedureTypes.Pause, content: pause, deleted: false})
        }
        setProcedure(n_procedure)
    }

    const onDragEnd = (result) => {
        if(result.destination === null) return
        const idx_src = result.source.index
        const idx_dest = result.destination.index
        if(idx_src === idx_dest) return
        let n_procedure = [...procedure]
        let obj = procedure[idx_src]
        n_procedure.splice(idx_src, 1)
        n_procedure.splice(idx_dest, 0, obj)
        setProcedure(n_procedure)
        storeProcedureOrder(n_procedure)
    }

    const storeProcedureOrder = (procedure) => {
        let planned_procedure = []
        for (const step of procedure) {
            let obj = {}
            obj[step.type.key + "_id"] = step.content.id
            planned_procedure.push(obj)
        }
        dispatch(updateStudy({
            "studyId": study_id,
            "study": {"planned_procedure": planned_procedure}
        }))
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
        }
        setIdCounter(idCounter+1)
        n_steps.push(step)
        setNSSteps(n_steps)
    }

    const storeProcedureStep = (id, type) => {
        if (type === ProcedureTypes.TextPage) {
            dispatch(getTexts(study_id))
        }
        else if (type === ProcedureTypes.Condition) {
            dispatch(getConditions(study_id))
        }
        else if (type === ProcedureTypes.Questionnaire) {
            dispatch(getQuestionnaires(study_id))
        }
        else if (type === ProcedureTypes.Pause) {
            dispatch(getPauses(study_id))
        }

        let idx = notStoredSteps.findIndex(obj => {
            return obj.id === id
        })

        if (idx > -1) {
            let nss = [...notStoredSteps]
            nss.splice(idx, 1)
            setNSSteps(nss)
        }
    }

    const deleteProcedureStep = (id, type) => {
        if (type === ProcedureTypes.TextPage) {
            dispatch(getTexts(study_id))
        }
        else if (type === ProcedureTypes.Condition) {
            dispatch(getConditions(study_id))
        }
        else if (type === ProcedureTypes.Questionnaire) {
            dispatch(getQuestionnaires(study_id))
        }
        else if (type === ProcedureTypes.Pause) {
            dispatch(getPauses(study_id))
        }

        let idx = procedure.findIndex(obj => {
            return obj.id === id
        })

        let n_prod = [...procedure]
        n_prod[idx].deleted = true
        setProcedure(n_prod)

        /*
        let idx = procedure.findIndex(obj => {
            return obj.id === id
        })
        if (idx > -1) {
            let proc = [...procedure]
            proc.splice(idx, 1)
            setProcedure(proc)
        }
        */
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
                                                                     stored={true}
                                                                     deleted={ps.deleted}
                                                                     setMessage={setMessage}
                                                                     storeProcedureStep={storeProcedureStep}
                                                                     deleteProcedureStep={deleteProcedureStep}
                                                    />
                                                ))
                                                }
                                                {   notStoredSteps.map((ps, index) => (
                                                    <ProcedureObject key={ps.id}
                                                                     id={ps.id}
                                                                     index={procedure.length+index}
                                                                     content={ps.content}
                                                                     type={ps.type}
                                                                     stored={false}
                                                                     deleted={ps.deleted}
                                                                     setMessage={setMessage}
                                                                     storeProcedureStep={storeProcedureStep}
                                                                     deleteProcedureStep={deleteProcedureStep}
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
                    <Col> <Button size="lg">Save and Proceed</Button> </Col>
                </Row>
            </Container>

        </StudyCreationLayout>
    )
}