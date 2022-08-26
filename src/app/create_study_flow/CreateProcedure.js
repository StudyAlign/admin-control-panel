import React, {useEffect, useState} from "react";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import {ProcedureTypes} from "./ProcedureObject";
import {useParams} from "react-router";
import {Button, Card, Col, Container, ListGroup, Row, Accordion} from "react-bootstrap";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import ProcedureObject from "./ProcedureObject";
import {useDispatch, useSelector} from "react-redux";
import {getStudy, selectStudy} from "../../redux/reducers/studySlice";
import {createText, getTexts, selectTexts} from "../../redux/reducers/textSlice";
import LoadingScreen from "../../components/LoadingScreen";

export default function CreateProcedure() {
    const dispatch = useDispatch()
    const { study_id } = useParams()
    const [texts, setTexts] = useState([])

    useEffect( () => {
        dispatch(getTexts(study_id));
    }, [])

    let n_texts = useSelector(selectTexts)
    if (n_texts != null && texts.length !== n_texts.length) {
        n_texts = texts.slice(0, texts.length).concat(n_texts.slice(texts.length))
        setTexts(n_texts)
    }

    const onDragEnd = (result) => {
        if(result.destination === null) return
        const idx_src = result.source.index
        const idx_dest = result.destination.index
        if(idx_src === idx_dest) return
        let n_texts = [...texts]
        let obj = texts[idx_src]
        n_texts.splice(idx_src, 1)
        n_texts.splice(idx_dest, 0, obj)
        setTexts(n_texts)
    }

    const createProcedureStep = async (event, procedureType) => {
        event.preventDefault()
        if(procedureType === ProcedureTypes.TextPage) {
            let text = {
                "title": "MockTitle",
                "body": "MockBody",
                "study_id": study_id
            }
            await dispatch(createText(text))
        }
        await dispatch(getTexts(study_id));
    }

    let buttons = []
    for (let t in ProcedureTypes) {
        buttons.push(
            <Col xs={'auto'} key={ProcedureTypes[t].id}>
                <Button onClick={(event) => createProcedureStep(event, ProcedureTypes[t])}> { ProcedureTypes[t].label } </Button>
            </Col>
        )
    }

    if(texts == null) {
        return <LoadingScreen/>
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
                                                {texts.map((text, index) => (
                                                    <ProcedureObject key={"text" + text.id.toString()}
                                                                     id={"text" + text.id.toString()}
                                                                     index={index}
                                                                     content={text}
                                                                     type={ProcedureTypes.TextPage}
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