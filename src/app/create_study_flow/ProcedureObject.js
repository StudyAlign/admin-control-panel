import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {Card, Accordion, useAccordionButton, Form} from "react-bootstrap";

export const ProcedureTypes = {
    TextPage: {
        id: 0,
        label: "Text Page",
        emptyContent: { "title": "", "body": "", "study_id": -1 }
    },
    Condition: {
        id: 1,
        label: "Condition",
        emptyContent: { "name": "", "config": "", "url": "", "study_id": -1 }
    },
    Questionnaire: {
        id: 2,
        label: "Questionnaire",
        emptyContent: { "url": "", "system": "", "ext_id": "", "api_url": "", "api_username": "", "api_password": "", "study_id": -1 }
    },
    Pause:  {
        id: 3,
        label: "Pause",
        emptyContent: { "title": "", "body": "", "proceed_body": "", "type": "", "config": "", "study_id": -1 }
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

    const decoratedOnClick = useAccordionButton(props.procedureStep.id, () => {
        // Customize anything on click
    });

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
        switch (procedureType) {
            case ProcedureTypes.TextPage:
            case ProcedureTypes.Pause:
                return content.title + " - " + procedureType.label
            case ProcedureTypes.Condition:
                return content.name + " - " + procedureType.label
            case ProcedureTypes.Questionnaire:
                return procedureType.label

        }
    }

    return (
        <Draggable draggableId={props.procedureStep.id} index={props.index}>
            {provided => (
                <div {...provided.draggableProps} {...provided.dragHandleProps}  ref={provided.innerRef}>

                    <Card className="m-1">
                        <Card.Header onClick={decoratedOnClick}>
                            { getHeader(props.procedureStep.type, props.procedureStep.content) }
                        </Card.Header>

                        <Accordion.Collapse eventKey={props.procedureStep.id}>
                            <Card.Body>
                                { getForm(props.procedureStep.type, props.procedureStep.content, props.editProcedureStep) }
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>

                </div>
            )}
        </Draggable>
    );
}
