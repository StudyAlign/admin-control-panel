import React, {useState} from "react";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import {ProcedureTypes} from "./ProcedureObject";
import {useParams} from "react-router";
import {Button, Card, Col, Container, ListGroup, Row, Accordion} from "react-bootstrap";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import ProcedureObject from "./ProcedureObject";

export default function CreateProcedure() {
    const { study_id } = useParams()

    const [procedure, setProcedure] = useState([
        {id: "0", type: ProcedureTypes.TextPage, content: {
                "title": "Welcome Message",
                "body": "Some Welcome Message ...",
                "study_id": study_id
            }},
        {id: "1", type: ProcedureTypes.Condition, content: {
                "name": "Test Condition",
                "config": "{}", // What is the config??
                "url": "www.some-url.com",
                "study_id": study_id
            }},
        {id: "2", type: ProcedureTypes.Questionnaire, content: {
                "url": "www.limesurvey.com/123456",
                "system": "limesurvey",
                "ext_id": "string",
                "api_url": "string",
                "api_username": "string",
                "api_password": "string",
                "study_id": study_id
            }},
        {id: "3", type: ProcedureTypes.Pause, content: {
                "title": "Test Pause",
                "body": "string",
                "proceed_body": "string",
                "type": "time_based", // What else??
                "config": "{}",
                "study_id": study_id
            }},
    ])

    const editProcedure = (index, content_id, value) => {
        let new_procedure = [...procedure]
        new_procedure[index].content[content_id] = value
        setProcedure(new_procedure)
    }

    const onDragEnd = (result) => {
        if(result.destination === null) return
        const idx_src = result.source.index
        const idx_dest = result.destination.index
        if(idx_src === idx_dest) return
        const obj = procedure[idx_src]
        procedure.splice(idx_src, 1)
        procedure.splice(idx_dest, 0, obj)
    }

    const createProcedureStep = (event, procedureType) => {
        event.preventDefault()
        let new_procedure = [...procedure]
        let prodStep = {
            id: procedure.length.toString(),
            type: procedureType,
            content: procedureType.emptyContent,
        }
        prodStep.content.study_id = study_id
        new_procedure.push(prodStep)
        setProcedure(new_procedure)
    }

    let buttons = []
    for (let t in ProcedureTypes) {
        buttons.push(
            <Col xs={'auto'} key={ProcedureTypes[t].id}>
                <Button onClick={(event) => createProcedureStep(event, ProcedureTypes[t])}> { ProcedureTypes[t].label } </Button>
            </Col>
        )
    }

    return (
        <StudyCreationLayout step={CreationSteps.Procedure}>

            <Container>
                <Row className='mt-3'>
                    { buttons }
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
                                                {procedure.map((step, index) => (
                                                    <ProcedureObject key={step.id} index={index}
                                                                     procedureStep={step}
                                                                     editProcedureStep={(content_id, value) => editProcedure(index, content_id, value)}
                                                    />
                                                ))}
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