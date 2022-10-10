import React, {useState} from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {Card, Accordion, useAccordionButton, Form, Row, Button, Col} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {createText, deleteText, updateText} from "../../redux/reducers/textSlice";
import {createCondition, deleteCondition, updateCondition} from "../../redux/reducers/conditionSlice";
import {createQuestionnaire, deleteQuestionnaire, updateQuestionnaire} from "../../redux/reducers/questionnaireSlice";
import {createPause, deletePause, updatePause} from "../../redux/reducers/pauseSlice";
import {DeviceSsd, Trash3} from "react-bootstrap-icons";

export const ProcedureTypes = {
    TextPage: {
        id: 0,
        key: "text",
        label: "Text Page",
        emptyContent: { "title": "", "body": "", "study_id": -1 }
    },
    Condition: {
        id: 1,
        key: "condition",
        label: "Condition",
        emptyContent: { "name": "", "config": "", "url": "", "study_id": -1 }
    },
    Questionnaire: {
        id: 2,
        key: "questionnaire",
        label: "Questionnaire",
        emptyContent: { "url": "", "system": "limesurvey", "ext_id": "-", "api_url": "-", "api_username": "-", "api_password": "-", "study_id": -1}
    },
    Pause:  {
        id: 3,
        key: "pause",
        label: "Pause",
        emptyContent: { "title": "", "body": "", "proceed_body": "", "type": "time_based", "config": "", "study_id": -1 }
    },
}

function TextPageForm(props) {

    const onChange = (event) => {
        event.preventDefault()
        props.editProcedureStep(event.target.id, event.target.value)
    }

    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label> Title </Form.Label>
                <Form.Control type="text" value={props.content.title} onChange={onChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="body">
                <Form.Label> Body </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.body} onChange={onChange} required/>
            </Form.Group>
        </Form>
    )
}

function ConditionForm(props) {

    const onChange = (event) => {
        event.preventDefault()
        props.editProcedureStep(event.target.id, event.target.value)
    }

    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label> Name </Form.Label>
                <Form.Control type="text" value={props.content.name} onChange={onChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="config">
                <Form.Label> Config </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.config} onChange={onChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="url">
                <Form.Label> URL </Form.Label>
                <Form.Control type="url" value={props.content.url} onChange={onChange} required/>
            </Form.Group>
        </Form>
    )
}

function QuestionnaireForm(props) {

    const onChange = (event) => {
        event.preventDefault()
        props.editProcedureStep(event.target.id, event.target.value)
    }

    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="url">
                <Form.Label> URL </Form.Label>
                <Form.Control type="url" value={props.content.url} onChange={onChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="system">
                <Form.Label> System </Form.Label>
                <Form.Select value={props.content.system} onChange={onChange}>
                    <option disabled value={""}> -- Select a System -- </option>
                    <option value={"limesurvey"}> Limesurvey </option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="ext_id">
                <Form.Label> Ext-Id </Form.Label>
                <Form.Control type="text" value={props.content.ext_id} onChange={onChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="api_url">
                <Form.Label> API-Url </Form.Label>
                <Form.Control type="url" value={props.content.api_url} onChange={onChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="api_username">
                <Form.Label> API-Username </Form.Label>
                <Form.Control type="text" value={props.content.api_username} onChange={onChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="api_password">
                <Form.Label> API-Password </Form.Label>
                <Form.Control type="password" value={props.content.api_password} onChange={onChange} required/>
            </Form.Group>
        </Form>
    )
}

function PauseForm(props) {

    const onChange = (event) => {
        event.preventDefault()
        props.editProcedureStep(event.target.id, event.target.value)
    }

    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label> Title </Form.Label>
                <Form.Control type="text" value={props.content.title} onChange={onChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="body">
                <Form.Label> Body </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.body} onChange={onChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="proceed_body">
                <Form.Label> Proceed Body </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.proceed_body} onChange={onChange} required/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="type">
                <Form.Label> Type </Form.Label>
                <Form.Select value={props.content.type} onChange={onChange}>
                    <option disabled value={""}> -- Select a Type -- </option>
                    <option value={"time_based"}> Time based </option>
                    <option value={"controlled"}> Controlled </option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="config">
                <Form.Label> Config </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.config} onChange={onChange} required/>
            </Form.Group>
        </Form>
    )
}

export default function ProcedureObject(props) {
    const dispatch = useDispatch()

    const [content, setContent] = useState(props.content)
    const [stored, setStored] = useState(props.stored) // Indicator if ProcedureObject already got stored in backed
    const [updated, setUpdated] = useState(false) // Indicator if the content got updated

    const contentComplete = () => {
        let required = Object.keys(props.type.emptyContent).filter(k => k !== "study_id")
        for (let k of required) {
            if (content[k] === "") {
                return false
            }
        }
        return true
    }

    const storeContent = async () => {
        if (!contentComplete()) {
            props.setMessage({type: "danger", text: "There are still some fields missing that need to be filled in!", duration: 4000})
            return
        }
        if(props.type === ProcedureTypes.TextPage) {
            await dispatch(createText(content))
        }
        else if(props.type === ProcedureTypes.Condition) {
            await dispatch(createCondition(content))
        }
        else if(props.type === ProcedureTypes.Questionnaire) {
            await dispatch(createQuestionnaire(content))
        }
        else if(props.type === ProcedureTypes.Pause) {
            await dispatch(createPause(content))
        }
        setStored(true)
        props.setMessage({type: "success", text: "Procedure-Object created"})
        props.storeProcedureStep(props.id, props.type)
    }

    const updateContent = async () => {
        if (!stored) {
            storeContent().then(r => { })
            return
        }
        if (props.type === ProcedureTypes.TextPage) {
            await dispatch(updateText({textId: content.id, text: {
                    "title": content.title,
                    "body": content.body
                }}))
        }
        else if (props.type === ProcedureTypes.Condition) {
            await dispatch(updateCondition({conditionId: content.id, condition: {
                    "name": content.name,
                    "config": content.config,
                    "url": content.url
                }}))
        }
        else if (props.type === ProcedureTypes.Questionnaire) {
            await dispatch(updateQuestionnaire({questionnaireId: content.id, questionnaire: {
                    "url": content.url,
                    "system": content.system,
                    "ext_id": content.ext_id,
                    "api_url": content.api_url,
                    "api_username": content.api_username,
                    "api_password": content.api_password,
                }}))
        }
        else if (props.type === ProcedureTypes.Pause) {
            await dispatch(updatePause({pauseId: content.id, pause: {
                    "title": content.title,
                    "body": content.body,
                    "proceed_body": content.proceed_body,
                    "type": content.type,
                    "config": content.config
                }}))
        }
        setUpdated(false)
        props.setMessage({type: "success", text: "Procedure-Object updated"})
    }

    const decoratedOnClick = useAccordionButton(props.id, (event) => {
        event.preventDefault()
        if(updated) {
            updateContent()
        }
    });

    const handleDelete = async (event) => {
        event.preventDefault()
        console.log("Delete Object")
        // TODO Check if id is already stored
        if(props.type === ProcedureTypes.TextPage) {
            await dispatch(deleteText(content.id))
        }
        else if (props.type === ProcedureTypes.Condition) {
            await dispatch(deleteCondition(content.id))
        }
        else if (props.type === ProcedureTypes.Questionnaire) {
            await dispatch(deleteQuestionnaire(content.id))
        }
        else if (props.type === ProcedureTypes.Pause) {
            await dispatch(deletePause(content.id))
        }
        console.log("...deleted")
        props.setMessage({type: "success", text: "Procedure-Object deleted"})
        props.deleteProcedureStep(props.id, props.type)
    }

    const handleSave = (event) => {
        event.preventDefault()
        if(updated) {
            updateContent()
        }
    }

    const editContent = (content_id, value) => {
        let new_content = {...content}
        new_content[content_id] = value
        setContent(new_content)
        setUpdated(true)
    }

    const getForm = (procedureType, content, editProcedureStep) => {
        switch (procedureType) {
            case ProcedureTypes.TextPage:
                return <TextPageForm content={content} editProcedureStep={editProcedureStep}/>
            case ProcedureTypes.Condition:
                return <ConditionForm content={content} editProcedureStep={editProcedureStep}/>
            case ProcedureTypes.Questionnaire:
                return <QuestionnaireForm content={content} editProcedureStep={editProcedureStep}/>
            case ProcedureTypes.Pause:
                return <PauseForm content={content} editProcedureStep={editProcedureStep}/>
        }
    }

    const getHeader = (procedureType, content) => {
        let header
        switch (procedureType) {
            case ProcedureTypes.TextPage:
            case ProcedureTypes.Pause:
                header = content.title + " - " + procedureType.label
                break
            case ProcedureTypes.Condition:
                header = content.name + " - " + procedureType.label
                break
            case ProcedureTypes.Questionnaire:
                header = procedureType.label
                break
        }
        if(!stored) {
            header += ' [Not Stored]'
        }
        return header
    }

    return (
        <Draggable draggableId={props.id} index={props.index} disabled={!props.stored}>
            {provided => (
                <div {...provided.draggableProps} {...provided.dragHandleProps}  ref={provided.innerRef}>

                    <Card className="m-1" hidden={props.deleted}>
                        <Card.Header onClick={decoratedOnClick}>
                            { getHeader(props.type, content) }
                        </Card.Header>

                        <Accordion.Collapse eventKey={props.id}>
                            <Card.Body className="pt-1">
                                <Row className="me-0">
                                    <Col> </Col>
                                    <Col xs="auto" className="p-1">
                                        <Button className="p-1 pt-0 m-0" onClick={handleSave} disabled={!updated}> <DeviceSsd/> </Button>
                                    </Col>
                                    <Col xs="auto" className="p-1">
                                        <Button className="p-1 pt-0 m-0" onClick={handleDelete} variant="danger"> <Trash3/> </Button>
                                    </Col>
                                </Row>
                                { getForm(props.type, content, editContent) }
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                </div>
            )}
        </Draggable>
    );
}
