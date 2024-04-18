import React, {useState} from 'react';
import {Card, Accordion, useAccordionButton, Form} from "react-bootstrap";

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

    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label> Title </Form.Label>
                <Form.Control type="text" value={props.content.title} readOnly/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="body">
                <Form.Label> Body </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.body} readOnly/>
            </Form.Group>
        </Form>
    )
}

function ConditionForm(props) {
    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label> Name </Form.Label>
                <Form.Control type="text" value={props.content.name} readOnly/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="config">
                <Form.Label> Config </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.config} readOnly/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="url">
                <Form.Label> URL </Form.Label>
                <Form.Control type="url" value={props.content.url} readOnly/>
            </Form.Group>
        </Form>
    )
}

function QuestionnaireForm(props) {

    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="url">
                <Form.Label> URL </Form.Label>
                <Form.Control type="url" value={props.content.url} readOnly/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="system">
                <Form.Label> System </Form.Label>
                <Form.Select value={props.content.system} readOnly disabled>
                    <option disabled value={""}> -- Select a System -- </option>
                    <option value={"limesurvey"}> Limesurvey </option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="ext_id">
                <Form.Label> Ext-Id </Form.Label>
                <Form.Control type="text" value={props.content.ext_id} readOnly/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="api_url">
                <Form.Label> API-Url </Form.Label>
                <Form.Control type="url" value={props.content.api_url} readOnly/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="api_username">
                <Form.Label> API-Username </Form.Label>
                <Form.Control type="text" value={props.content.api_username} readOnly/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="api_password">
                <Form.Label> API-Password </Form.Label>
                <Form.Control type="password" value={props.content.api_password} readOnly/>
            </Form.Group>
        </Form>
    )
}

function PauseForm(props) {

    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label> Title </Form.Label>
                <Form.Control type="text" value={props.content.title} readOnly/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="body">
                <Form.Label> Body </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.body} readOnly/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="proceed_body">
                <Form.Label> Proceed Body </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.proceed_body} readOnly/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="type">
                <Form.Label> Type </Form.Label>
                <Form.Select value={props.content.type} readOnly disabled>
                    <option disabled value={""}> -- Select a Type -- </option>
                    <option value={"time_based"}> Time based </option>
                    <option value={"controlled"}> Controlled </option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="config">
                <Form.Label> Config </Form.Label>
                <Form.Control as="textarea" rows={3} value={props.content.config} readOnly/>
            </Form.Group>
        </Form>
    )
}

export default function ProcedureObject(props) {

    const decoratedOnClick = useAccordionButton(props.id, (event) => {
        event.preventDefault()
    });

    const getForm = (procedureType, content) => {
        switch (procedureType) {
            case ProcedureTypes.TextPage:
                return <TextPageForm content={content}/>
            case ProcedureTypes.Condition:
                return <ConditionForm content={content}/>
            case ProcedureTypes.Questionnaire:
                return <QuestionnaireForm content={content}/>
            case ProcedureTypes.Pause:
                return <PauseForm content={content}/>
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
        return header
    }

    return (
         <Card className="m-1">
             <Card.Header onClick={decoratedOnClick}>
                 { getHeader(props.type, props.content) }
             </Card.Header>
             <Accordion.Collapse eventKey={props.id}>
                 <Card.Body className="pt-1">
                     { getForm(props.type, props.content) }
                 </Card.Body>
             </Accordion.Collapse>
         </Card>
    );
}
