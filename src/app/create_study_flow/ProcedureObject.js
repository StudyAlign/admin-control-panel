import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { DragHandleComponent } from 'react-sortful'
import { Accordion, Form, Button } from "react-bootstrap";
import { DeviceSsd, Trash3 } from "react-bootstrap-icons";
import { useDispatch} from "react-redux";

import { createSingleProcedureConfigStep } from "../../redux/reducers/studySlice"
import { createText, deleteText, getTexts, updateText } from "../../redux/reducers/textSlice";
import { createCondition, deleteCondition, getConditions, updateCondition } from "../../redux/reducers/conditionSlice";
import { createQuestionnaire, deleteQuestionnaire, getQuestionnaires, updateQuestionnaire } from "../../redux/reducers/questionnaireSlice";
import { createPause, deletePause, getPauses, updatePause } from "../../redux/reducers/pauseSlice";

import styles from './CreateProcedure.module.css'




// -------------------------------------------------------------------------------------------------------
// Sector: ProcedureObject Structure: Start --------------------------------------------------------------

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
        emptyContent: { "url": "", "system": "limesurvey", "ext_id": "-", "api_url": "-", "api_username": "-", "api_password": "-", "study_id": -1}
    },
    Pause:  {
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
        emptyContent: { "study_id": -1 }
    },
}

// Sector: ProcedureObject Structure: End --------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------




// -----------------------------------------------------------------------------------------------------------
// Sector: ProcedureObject content forms: Start --------------------------------------------------------------

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

// Drag Element for Procedure Object
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

// Sector: ProcedureObject content forms: End --------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------




const ProcedureObject = forwardRef((props, ref) => {

    
    
    
    // ---------------------------------------------------------------------------------------------------------
    // Sector: React States and References: Start --------------------------------------------------------------

    const dispatch = useDispatch()

    const [content, setContent] = useState(props.content)
    const [backendId, setBackendId] = useState(props.backendId) // BackendId of ProcedureObject
    const [stepId, setStepId] = useState(props.stepId) // StepId of ProcedureObject
    const [stored, setStored] = useState(props.stored) // Indicator if ProcedureObject already got stored in backed
    const [updated, setUpdated] = useState(false) // Indicator if the content got updated

    // onclose logic ref from accordion in createProcedure
    useImperativeHandle(ref, () => ({
        handleClose() {
            if (updated) {
                updateContent()
            }
        }
    }))

    // Update Frontend if stored, backendId or updated is changed
    useEffect(() => {
        props.updateProcedureMap(props.id, backendId, stepId, content, stored)
    }, [backendId, stepId, stored, updated])

    // Sector: React States and References: End --------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------

    
    
    
    // -----------------------------------------------------------------------------------------------------------------
    // Sector: update ProcedureObject backend: Start --------------------------------------------------------------

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
            props.setMessage({
                type: "danger",
                text: "There are still some fields missing that need to be filled in!",
                duration: 4000})
            return
        }

        // create ProcedureObject + step in Backend
        let response_create = { payload: { status: 400 } }
        let response_step = { payload: { status: 400 } }
        if(props.type === ProcedureTypes.TextPage) {
            // create object
            response_create = await dispatch(createText(content))
            // create step
            response_step = await dispatch(createSingleProcedureConfigStep({
                "procedureConfigId": props.rootBackendId,
                "procedureConfigStep" : {
                    "counterbalance" : props.counterbalance,
                    "text_id" : response_create.payload.body.id
                }
            }))
        }
        else if(props.type === ProcedureTypes.Condition) {
            response_create = await dispatch(createCondition(content))
            response_step = await dispatch(createSingleProcedureConfigStep({
                "procedureConfigId": props.rootBackendId,
                "procedureConfigStep" : {
                    "counterbalance" : props.counterbalance,
                    "condition_id" : response_create.payload.body.id
                }
            }))
        }
        else if(props.type === ProcedureTypes.Questionnaire) {
            response_create = await dispatch(createQuestionnaire(content))
            response_step = await dispatch(createSingleProcedureConfigStep({
                "procedureConfigId": props.rootBackendId,
                "procedureConfigStep" : {
                    "counterbalance" : props.counterbalance,
                    "questionnaire_id" : response_create.payload.body.id
                }
            }))
        }
        else if(props.type === ProcedureTypes.Pause) {
            response_create = await dispatch(createPause(content))
            response_step = await dispatch(createSingleProcedureConfigStep({
                "procedureConfigId": props.rootBackendId,
                "procedureConfigStep" : {
                    "counterbalance" : props.counterbalance,
                    "pause_id" : response_create.payload.body.id
                }
            }))
        }

        // if response successful status 200
        if (response_create.payload.status === 200 && response_step.payload.status === 200) {
            // set backendId
            setBackendId(response_create.payload.body.id)
            // set stepId
            setStepId(response_step.payload.body.id)
            // set stored to update frontend
            setStored(true)
            props.setMessage({ type: "success", text: "Procedure-Object created" })
        } else {
            props.setMessage({ type: "danger", text: "Error while creating Procedure-Object" })
            setUpdated(true)
        }
    }

    const updateContent = async () => {
        setUpdated(false)

        if (!stored) {
            storeContent().then(r => { })
            return
        }

        if (!contentComplete()) {
            props.setMessage({
                type: "danger",
                text: "There are still some fields missing that need to be filled in!",
                duration: 4000})
            return
        }

        // create ProcedureObject in Backend
        let response = { payload: { status: 400 } }
        if (props.type === ProcedureTypes.TextPage) {
            response = await dispatch(updateText({textId: backendId, text: {
                    "title": content.title,
                    "body": content.body
                }}))
        }
        else if (props.type === ProcedureTypes.Condition) {
            response = await dispatch(updateCondition({conditionId: backendId, condition: {
                    "name": content.name,
                    "config": content.config,
                    "url": content.url
                }}))
        }
        else if (props.type === ProcedureTypes.Questionnaire) {
            response = await dispatch(updateQuestionnaire({questionnaireId: backendId, questionnaire: {
                    "url": content.url,
                    "system": content.system,
                    "ext_id": content.ext_id,
                    "api_url": content.api_url,
                    "api_username": content.api_username,
                    "api_password": content.api_password,
                }}))
        }
        else if (props.type === ProcedureTypes.Pause) {
            response = await dispatch(updatePause({pauseId: backendId, pause: {
                    "title": content.title,
                    "body": content.body,
                    "proceed_body": content.proceed_body,
                    "type": content.type,
                    "config": content.config
                }}))
        }
        // if response successful status 204
        if (response.payload.status === 204) {
            props.setMessage({type: "success", text: "Procedure-Object updated"})
        } else {
            props.setMessage({ type: "danger", text: "Error while updating Procedure-Object" })
            setUpdated(true)
        }
    }

    // Sector: update ProcedureObject backend: End --------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------

    
    
    
    // -------------------------------------------------------------------------------------------------------------------
    // Sector: ProcedureObject FrontEnd interactions: Start --------------------------------------------------------------

    const handleSave = (event) => {
        event.preventDefault()
        if (updated) {
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
                header = !content.title ? procedureType.label : content.title + " - " + procedureType.label
                break
            case ProcedureTypes.Condition:
                header = !content.name ? procedureType.label : content.name + " - " + procedureType.label
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

    // Sector: ProcedureObject FrontEnd interactions: End --------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    
    
    
    return (
        <div className={styles.procedureElement}>
            <DragHandleComponent className={styles.dragHandle}>
                {dotsSVG}
            </DragHandleComponent>


            <Accordion.Item eventKey={props.id} className={styles.accordionItem}>
                <Accordion.Header>{getHeader(props.type, content)}</Accordion.Header>
                <Accordion.Body>
                    {getForm(props.type, content, editContent)}
                </Accordion.Body>
            </Accordion.Item>

            <Button size="sm" onClick={handleSave} disabled={!updated} className={styles.saveButton}>
                <DeviceSsd/>
            </Button>

            <Button variant="danger" size="sm" onClick={() => props.deleteProcedureObject(props.id)} className={styles.deleteButton}>
                <Trash3 />
            </Button>

        </div>
    )
})
export default ProcedureObject