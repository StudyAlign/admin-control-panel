import React, {useEffect, useState} from "react";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router";
import {Button, Card, Col, Container, ListGroup, Row} from "react-bootstrap";
import {getStudy, selectStudy} from "../../redux/reducers/studySlice";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import ProcedureObject from "./ProcedureObject";

export default function CreateProcedure() {
    const dispatch = useDispatch()
    const { study_id } = useParams()

    const [procedure, setProcedure] = useState([
        {id: 'step-0', name: 'Welcome Message', type: 'Text Page'},
        {id: 'step-1', name: 'Procedure Description', type: 'Text Page'},
        {id: 'step-2', name: 'Prototype 1', type: 'Condition'},
        {id: 'step-3', name: 'Likert Prototype 1', type: 'Questionnaire'},
    ])

    const study = useSelector(selectStudy)
    useEffect(( ) => {
        dispatch(getStudy(study_id));
    }, [])

    const handleDragEnd = (result) => {
        if(result.destination === null) return
        const idx_src = result.source.index
        const idx_dest = result.destination.index
        if(idx_src === idx_dest) return
        const obj = procedure[idx_src]
        procedure.splice(idx_src, 1)
        procedure.splice(idx_dest, 0, obj)
    }

    return (
        <StudyCreationLayout step={CreationSteps.Procedure}>

            <Container>
                <Row className='mt-3'>
                    <Col xs={'auto'}> <Button> Text Page </Button> </Col>
                    <Col xs={'auto'}> <Button> Condition </Button> </Col>
                    <Col xs={'auto'}> <Button> Questionnaire </Button> </Col>
                    <Col xs={'auto'}> <Button> Pause </Button> </Col>
                </Row>

                <Row className='mt-3'>
                    <Col>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Card>
                            <Card.Header> Procedure Order </Card.Header>
                            <Card.Body>
                                <Droppable droppableId={'procedure-0'}>
                                    {provided => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            <ListGroup>
                                                {procedure.map((step, index) => (
                                                    <ProcedureObject key={step.id} procedureStep={step} index={index} />
                                                ))}
                                            </ListGroup>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
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