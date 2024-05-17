import { useState } from 'react';
import { Card, Accordion, useAccordionButton, Form, Row, Button, Col, ListGroup } from "react-bootstrap";
import { DeviceSsd, Trash3 } from "react-bootstrap-icons";
import { DragHandleComponent } from 'react-sortful'
import styles from './CreateProcedure.module.css'

// Procedure Types Templates
export const ProcedureTypes = {
    TextPage: {
        id: 0,
        key: "text",
        label: "Text Page",
        color: "rgb(23, 162, 184)",
        emptyContent: { "title": "", "body": "", "study_id": -1 }
    },
    Condition: {
        id: 1,
        key: "condition",
        label: "Condition",
        color: "rgb(23, 162, 184)",
        emptyContent: { "name": "", "config": "", "url": "", "study_id": -1 }
    },
    Questionnaire: {
        id: 2,
        key: "questionnaire",
        label: "Questionnaire",
        color: "rgb(23, 162, 184)",
        emptyContent: { "url": "", "system": "limesurvey", "ext_id": "-", "api_url": "-", "api_username": "-", "api_password": "-", "study_id": -1 }
    },
    Pause: {
        id: 3,
        key: "pause",
        label: "Pause",
        color: "rgb(23, 162, 184)",
        emptyContent: { "title": "", "body": "", "proceed_body": "", "type": "time_based", "config": "", "study_id": -1 }
    },
    BlockElement: {
        id: 4,
        key: "block",
        label: "Block Element",
        color: "rgb(87, 145, 53)",
        emptyContent: {}
    },
}

function TextPageForm(props) {

    const onChange = (event) => {
        event.preventDefault()
        props.editProcedureStep(event.target.id, event.target.value)
    }

    return (
        <Form onSubmit={(event) => { event.preventDefault() }}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label> Title </Form.Label>
                <Form.Control type="text" value={props.content.title} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="body">
                <Form.Label> Body </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.body} onChange={onChange} required />
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
        <Form onSubmit={(event) => { event.preventDefault() }}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label> Name </Form.Label>
                <Form.Control type="text" value={props.content.name} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="config">
                <Form.Label> Config </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.config} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="url">
                <Form.Label> URL </Form.Label>
                <Form.Control type="url" value={props.content.url} onChange={onChange} required />
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
        <Form onSubmit={(event) => { event.preventDefault() }}>
            <Form.Group className="mb-3" controlId="url">
                <Form.Label> URL </Form.Label>
                <Form.Control type="url" value={props.content.url} onChange={onChange} required />
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
                <Form.Control type="text" value={props.content.ext_id} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="api_url">
                <Form.Label> API-Url </Form.Label>
                <Form.Control type="url" value={props.content.api_url} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="api_username">
                <Form.Label> API-Username </Form.Label>
                <Form.Control type="text" value={props.content.api_username} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="api_password">
                <Form.Label> API-Password </Form.Label>
                <Form.Control type="password" value={props.content.api_password} onChange={onChange} required />
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
        <Form onSubmit={(event) => { event.preventDefault() }}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label> Title </Form.Label>
                <Form.Control type="text" value={props.content.title} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="body">
                <Form.Label> Body </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.body} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="proceed_body">
                <Form.Label> Proceed Body </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.proceed_body} onChange={onChange} required />
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
                <Form.Control as="textarea" rows={3} value={props.content.config} onChange={onChange} required />
            </Form.Group>
        </Form>
    )
}

// Drag Element fuer Procedure
const dotsSVG = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
        <circle cx="18" cy="12" r="3" />
        <circle cx="18" cy="24" r="3" />
        <circle cx="18" cy="36" r="3" />
        <circle cx="30" cy="12" r="3" />
        <circle cx="30" cy="24" r="3" />
        <circle cx="30" cy="36" r="3" />
    </svg>
)

export default function SingleItem(props) {

    const [content, setContent] = useState(props.content)
    const [stored, setStored] = useState(props.stored)
    const [updated, setUpdated] = useState(false)

    const decoratedOnClick = (id) => {
        console.log("decoratedOnClick: " + id)
    }

    const editContent = (content_id, value) => {
        let new_content = { ...content }
        new_content[content_id] = value
        setContent(new_content)
        setUpdated(true)
    }

    const getForm = (procedureType, content, editProcedureStep) => {
        switch (procedureType) {
            case ProcedureTypes.TextPage:
                return <TextPageForm content={content} editProcedureStep={editProcedureStep} />
            case ProcedureTypes.Condition:
                return <ConditionForm content={content} editProcedureStep={editProcedureStep} />
            case ProcedureTypes.Questionnaire:
                return <QuestionnaireForm content={content} editProcedureStep={editProcedureStep} />
            case ProcedureTypes.Pause:
                return <PauseForm content={content} editProcedureStep={editProcedureStep} />
        }
    }

    const getHeader = (procedureType, content) => {
        let header
        switch (procedureType) {
            case ProcedureTypes.TextPage:
            case ProcedureTypes.Pause:
                header = !content.title ? procedureType.label : content.title + " - " + procedureType.label
                break
            case ProcedureTypes.Condition:
                header = !content.name ? procedureType.label : content.name + " - " + procedureType.label
                break
            case ProcedureTypes.Questionnaire:
                header = procedureType.label
                break
        }
        if (!stored) {
            header += ' [Not Stored]'
        }
        return header
    }

    return (
        <div className={styles.item}>
            <DragHandleComponent className={styles.dragHandle}>
                {dotsSVG}
            </DragHandleComponent>


            <Accordion.Item onClick={() => decoratedOnClick(props.id)} eventKey={props.id} className={styles.accordionItem}>
                <Accordion.Header>{getHeader(props.type, content)}</Accordion.Header>
                <Accordion.Body>
                    {getForm(props.type, content, editContent)}
                </Accordion.Body>
            </Accordion.Item>


            <Button variant="danger" size="sm" onClick={() => props.deleteItem(props.id)} className={styles.deleteButton}>
                <Trash3 />
            </Button>

        </div>
    );
};