import React, {useEffect, useState} from "react";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import {ProcedureTypes} from "./ProcedureObject";
import {useParams} from "react-router";
import {Button, Card, Col, Container, ListGroup, Row, Accordion} from "react-bootstrap";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import ProcedureObject from "./ProcedureObject";
import {useDispatch, useSelector} from "react-redux";
import {createText, getTexts, selectTexts} from "../../redux/reducers/textSlice";
import {createCondition, getConditions, selectConditions} from "../../redux/reducers/conditionSlice";
import {createQuestionnaire, getQuestionnaires, selectQuestionnaires} from "../../redux/reducers/questionnaireSlice";
import {createPause, getPauses, selectPauses} from "../../redux/reducers/pauseSlice";

export default function CreateProcedure() {
    const dispatch = useDispatch()
    const { study_id } = useParams()
    const [procedure, setProcedure] = useState([])

    useEffect( () => {
        dispatch(getTexts(study_id));
        dispatch(getConditions(study_id));
        dispatch(getQuestionnaires(study_id));
        dispatch(getPauses(study_id));
    }, [])

    let texts = useSelector(selectTexts)
    let conditions = useSelector(selectConditions)
    let pauses = useSelector(selectPauses)
    let questions = useSelector(selectQuestionnaires)

    if (texts != null && questions != null && pauses != null && conditions != null &&
        procedure.length !== texts.length + conditions.length + pauses.length + questions.length) {
        let n_procedure = []
        for(let text of texts) {
            n_procedure.push({id: "t" + text.id.toString(), type: ProcedureTypes.TextPage, content: text})
        }
        for(let cond of conditions) {
            n_procedure.push({id: "c" + cond.id.toString(), type: ProcedureTypes.Condition, content: cond})
        }
        for(let quest of questions) {
            n_procedure.push({id: "q" + quest.id.toString(), type: ProcedureTypes.Questionnaire, content: quest})
        }
        for(let pause of pauses) {
            n_procedure.push({id: "p" + pause.id.toString(), type: ProcedureTypes.Pause, content: pause})
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
    }

    const createProcedureStep = async (event, procedureType) => {
        event.preventDefault()
        let content = procedureType.emptyContent
        content.study_id = study_id
        if(procedureType === ProcedureTypes.TextPage) {
            await dispatch(createText(content))
            await dispatch(getTexts(study_id));
        }
        else if(procedureType === ProcedureTypes.Condition) {
            await dispatch(createCondition(content))
            await dispatch(getConditions(study_id));
        }
        else if(procedureType === ProcedureTypes.Questionnaire) {
            await dispatch(createQuestionnaire(content))
            await dispatch(getQuestionnaires(study_id));
        }
        else if(procedureType === ProcedureTypes.Pause) {
            await dispatch(createPause(content))
            await dispatch(getPauses(study_id));
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

    return (
        <StudyCreationLayout step={CreationSteps.Procedure}>

            <Container>
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