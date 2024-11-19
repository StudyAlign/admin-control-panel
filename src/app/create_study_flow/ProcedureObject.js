import React, { useEffect, useState, useImperativeHandle, forwardRef, useContext } from 'react';
import { DragHandleComponent } from 'react-sortful'
import {Accordion, Form, Button, Tooltip, OverlayTrigger, Badge} from "react-bootstrap";
import { Trash3, Save } from "react-bootstrap-icons";
import { useDispatch} from "react-redux";

import { CreateProcedureContext } from './CreateProcedure';

import HtmlEditor from './procedure_editors/HtmlEditor';
import JsonEditor from './procedure_editors/JsonEditor';

import { createSingleProcedureConfigStep } from "../../redux/reducers/studySlice"
import { createText, updateText } from "../../redux/reducers/textSlice";
import { createCondition, updateCondition } from "../../redux/reducers/conditionSlice";
import { createQuestionnaire, updateQuestionnaire } from "../../redux/reducers/questionnaireSlice";
import { createPause, updatePause } from "../../redux/reducers/pauseSlice";

import styles from './CreateProcedure.module.scss'




// -------------------------------------------------------------------------------------------------------
// Sector: ProcedureObject Structure: Start --------------------------------------------------------------

export const ProcedureTypes = {
    TextPage: {
        id: 0,
        key: "text",
        label: "Text Page",
        class: "procedure-text",
        btnclass: "procedure-text-button",
        color: "rgb(13,4,73)",
        emptyContent: { "title": "", "body": "", "study_id": -1 }
    },
    Condition: {
        id: 1,
        key: "condition",
        label: "Condition",
        class: "procedure-condition",
        btnclass: "procedure-condition-button",
        color: "rgb(191,96,16)",
        emptyContent: { "name": "", "config": "", "url": "", "study_id": -1 }
    },
    Questionnaire: {
        id: 2,
        key: "questionnaire",
        label: "Questionnaire",
        class: "procedure-questionnaire",
        btnclass: "procedure-questionnaire-button",
        color: "rgb(144,30,64)",
        emptyContent: { "url": "", "system": "", "study_id": -1}
    },
    Pause:  {
        id: 3,
        key: "pause",
        label: "Pause",
        class: "procedure-pause",
        btnclass: "procedure-pause-button",
        color: "rgb(81,99,39)",
        emptyContent: { "title": "", "body": "", "proceed_body": "", "type": "time_based", "config": "", "study_id": -1 }
    },
    BlockElement: {
        id: 4,
        key: "block",
        label: "Block Element",
        class: "procedure-block",
        btnclass: "procedure-block-button",
        color: "rgb(173,189,231)",
        emptyContent: { "study_id": -1 }
    },
}

// Sector: ProcedureObject Structure: End --------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------




// -----------------------------------------------------------------------------------------------------------
// Sector: ProcedureObject content forms: Start --------------------------------------------------------------

function TextPageForm(props) {

    const [errorObj, setErrorObj] = useState({title: false, body: false})

    useEffect(() => {
        if (props.error) {
            const errorUpdate = {}
            for (let key in props.content) {
                if (key in errorObj) {
                    errorUpdate[key] = switch_case(key, props.content[key], true)
                }
            }
            setErrorObj(errorUpdate)
        }
    }, [props.error])

    const onChange = (id, value) => {
        props.editProcedureStep(id, value)
        switch_case(id, value)
    }

    const switch_case = (id, value, should_return = false) => {
        switch (id) {
            case 'title':
                if (should_return) return !value
                !value ? setErrorObj({...errorObj, title: true}) : setErrorObj({...errorObj, title: false})
            case 'body':
                if (should_return) return isBodyEmpty(value)
                isBodyEmpty(value) ? setErrorObj({...errorObj, body: true}) : setErrorObj({...errorObj, body: false})
                break
        }
    }

    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label className={errorObj.title ? styles.invalidLabel : ''}>
                    {errorObj.title ? 'Title*' : 'Title'}
                </Form.Label>
                <Form.Control
                    type="text"
                    value={props.content.title}
                    onChange={(event) => onChange(event.target.id, event.target.value)}
                />
                {errorObj.title && <div style={{ display: "flex" }} className="invalid-feedback">Title can't be empty</div>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="body">
                <Form.Label className={errorObj.body ? styles.invalidLabel : ''}>
                    {errorObj.body ? 'Body*' : 'Body'}
                </Form.Label>
                <HtmlEditor
                    value={props.content.body}
                    onChange={(value) => onChange('body', value)}
                />
                {errorObj.body && <div style={{display:"flex"}} className="invalid-feedback">Body can't be empty</div>}
            </Form.Group>
        </Form>
    )
}

function ConditionForm(props) {

    const [errorObj, setErrorObj] = useState({name: false, config: false, url: false})

    useEffect(() => {
        if (props.error) {
            const errorUpdate = {}
            for (let key in props.content) {
                if (key in errorObj) {
                    errorUpdate[key] = switch_case(key, props.content[key], true)
                }
            }
            setErrorObj(errorUpdate)
        }
    }, [props.error])

    const onChange = (id, value) => {
        props.editProcedureStep(id, value)
        switch_case(id, value)        
    }

    const switch_case = (id, value, should_return = false) => {
        switch (id) {
            case 'name':
                if (should_return) return !value
                !value ? setErrorObj({...errorObj, name: true}) : setErrorObj({...errorObj, name: false})
                break
            case 'config':
                try {
                    JSON.parse(value)
                    if (should_return) return false
                    setErrorObj({...errorObj, config: false})
                } catch (error) {
                    if (should_return) return true
                    setErrorObj({...errorObj, config: true})
                }
                break
            case 'url':
                if (should_return) return !value
                !value ? setErrorObj({...errorObj, url: true}) : setErrorObj({...errorObj, url: false})
                break
        }
    }

    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="name">
                <Form.Label className={errorObj.name ? styles.invalidLabel : ''}>
                    {errorObj.name ? 'Name*' : 'Name'}
                </Form.Label>
                <Form.Control type="text" value={props.content.name} onChange={(event) => onChange(event.target.id, event.target.value)}/>
                {errorObj.name && <div style={{ display: "flex" }} className="invalid-feedback">Name can't be empty</div>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="config">
                <Form.Label className={errorObj.config ? styles.invalidLabel : ''}>
                    {errorObj.config ? 'Config*' : 'Config'}
                </Form.Label>
                <JsonEditor
                    id="config"
                    value={props.content.config}
                    onChange={onChange}
                />
                {errorObj.config && <div style={{display:"flex"}} className="invalid-feedback">Not a valid JSON.</div>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="url">
                <Form.Label className={errorObj.url ? styles.invalidLabel : ''}>
                    {errorObj.url ? 'Url*' : 'Url'}
                </Form.Label>
                <Form.Control type="url" value={props.content.url} onChange={(event) => onChange(event.target.id, event.target.value)}/>
                {errorObj.url && <div style={{ display: "flex" }} className="invalid-feedback">Url can't be empty</div>}
            </Form.Group>
        </Form>
    )
}

function QuestionnaireForm(props) {

    const [errorObj, setErrorObj] = useState({url: false, system: false})

    useEffect(() => {
        if (props.error) {
            const errorUpdate = {}
            for (let key in props.content) {
                if (key in errorObj) {
                    errorUpdate[key] = switch_case(key, props.content[key], true)
                }
            }
            setErrorObj(errorUpdate)
        }
    }, [props.error])

    // Questionnaire Context
    const {
        questionnaireUpdateList,
        currentSystem,
        setCurrentSystem,
        setQuestionnaireModalContent,
        setShowQuestionnaireModal,
        NO_QUESTIONNAIRE_SYSTEM
    } = useContext(CreateProcedureContext)

    const isValidSystem = (value) => {
        // If no value is set or there is just one questionnaire, return true
        if ( currentSystem === NO_QUESTIONNAIRE_SYSTEM || currentSystem === value || questionnaireUpdateList.length === 1 ) {
            setCurrentSystem(value)
            return true
        } else {
            setQuestionnaireModalContent([currentSystem, value])
            setShowQuestionnaireModal(true)
            return false
        }
    }

    const onChange = (event) => {
        event.preventDefault()
        const { id, value } = event.target

        if (id === "system") {
            if (isValidSystem(value)) {
                props.editProcedureStep(id, value)
            }
        } else {
            props.editProcedureStep(id, value)
        }

        switch_case(id, value)
    }

    const switch_case = (id, value, should_return = false) => {
        switch (id) {
            case 'url':
                if (should_return) return !value
                !value ? setErrorObj({...errorObj, url: true}) : setErrorObj({...errorObj, url: false})
                break
            case 'system':
                if (should_return) return !value
                !value ? setErrorObj({...errorObj, system: true}) : setErrorObj({...errorObj, system: false})
                break
        }
    }

    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="url">
                <Form.Label className={errorObj.url ? styles.invalidLabel : ''}>
                    {errorObj.url ? 'Url*' : 'Url'}
                </Form.Label>
                <Form.Control type="url" value={props.content.url} onChange={onChange}/>
                {errorObj.url && <div style={{ display: "flex" }} className="invalid-feedback">Url can't be empty</div>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="system">
                <Form.Label className={(props.error && errorObj.system) ? styles.invalidLabel : ''}>
                    {(props.error && errorObj.system) ? 'System*' : 'System'}
                </Form.Label>
                <Form.Select value={props.content.system} onChange={onChange}>
                    <option disabled value={""}> -- Select a System -- </option>
                    <option value={"limesurvey"}> Limesurvey </option>
                    <option value={"qualtrics"}> Qualtrics </option>
                    {/* <option value={"surveymonkey"}> Survey Monkey </option>
                    <option value={"googleforms"}> Google Forms </option>
                    <option value={"typeform"}> Typeform </option>
                    <option value={"jotform"}> Jotform </option> */}
                </Form.Select>
                {(props.error && errorObj.system) && <div style={{display:"flex"}} className="invalid-feedback">Please select a system.</div>}
            </Form.Group>
        </Form>
    )
}

function PauseForm(props) {

    const [errorObj, setErrorObj] = useState({title: false, body: false, proceed_body: false, config: false})

    useEffect(() => {
        if (props.error) {
            const errorUpdate = {}
            for (let key in props.content) {
                if (key in errorObj) {
                    errorUpdate[key] = switch_case(key, props.content[key], true)
                }
            }
            setErrorObj(errorUpdate)
        }
    }, [props.error])

    const onChange = (id, value) => {
        props.editProcedureStep(id, value)
        switch_case(id, value)
    }

    const switch_case = (id, value, should_return = false) => {
        switch (id) {
            case 'title':
                if (should_return) return !value
                !value ? setErrorObj({...errorObj, title: true}) : setErrorObj({...errorObj, title: false})
                break
            case 'body':
                if (should_return) return isBodyEmpty(value)
                isBodyEmpty(value) ? setErrorObj({...errorObj, body: true}) : setErrorObj({...errorObj, body: false})
                break
            case 'proceed_body':
                if (should_return) return isBodyEmpty(value)
                isBodyEmpty(value) ? setErrorObj({...errorObj, proceed_body: true}) : setErrorObj({...errorObj, proceed_body: false})
                break
            case 'config':
                try {
                    JSON.parse(value)
                    if (should_return) return false
                    setErrorObj({...errorObj, config: false})
                } catch (error) {
                    if (should_return) return true
                    setErrorObj({...errorObj, config: true})
                }
                break
        }
    }

    return (
        <Form onSubmit={(event) => {event.preventDefault()}}>
            <Form.Group className="mb-3" controlId="title">
                <Form.Label className={errorObj.title ? styles.invalidLabel : ''}>
                    {errorObj.title ? 'Title*' : 'Title'}
                </Form.Label>
                <Form.Control type="text" value={props.content.title} onChange={(event) => onChange(event.target.id, event.target.value)}/>
                {errorObj.title && <div style={{ display: "flex" }} className="invalid-feedback">Title can't be empty</div>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="body">
                <Form.Label className={errorObj.body ? styles.invalidLabel : ''}>
                    {errorObj.body ? 'Body*' : 'Body'}
                </Form.Label>
                <HtmlEditor
                    value={props.content.body}
                    onChange={(value) => onChange('body', value)}
                />
                {errorObj.body && <div style={{display:"flex"}} className="invalid-feedback">Body can't be empty</div>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="proceed_body">
                <Form.Label className={errorObj.proceed_body ? styles.invalidLabel : ''}>
                    {errorObj.proceed_body ? 'Proceed Body*' : 'Proceed Body'}
                </Form.Label>
                <HtmlEditor
                    value={props.content.proceed_body}
                    onChange={(value) => onChange('proceed_body', value)}
                />
                {errorObj.proceed_body && <div style={{display:"flex"}} className="invalid-feedback">Proceed Body can't be empty</div>}
            </Form.Group>

            <Form.Group className="mb-3" controlId="type">
                <Form.Label> Type </Form.Label>
                <Form.Select value={props.content.type} onChange={(event) => onChange(event.target.id, event.target.value)}>
                    <option disabled value={""}> -- Select a Type -- </option>
                    <option value={"time_based"}> Time based </option>
                    <option value={"controlled"}> Controlled </option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="config">
                <Form.Label className={errorObj.config ? styles.invalidLabel : ''}>
                    {errorObj.config ? 'Config*' : 'Config'}
                </Form.Label>
                <JsonEditor
                    id="config"
                    value={props.content.config}
                    onChange={onChange}
                />
                {errorObj.config && <div style={{display:"flex"}} className="invalid-feedback">Not a valid JSON.</div>}
            </Form.Group>
        </Form>
    )
}

const isBodyEmpty = (value) => {
    const emptyParagraphPattern = /^<p>\s*(&nbsp;|\s)*<\/p>$/;
    return !value || emptyParagraphPattern.test(value.trim());
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

    const procedureType = props.type
    // ---------------------------------------------------------------------------------------------------------
    // Sector: React States and References: Start --------------------------------------------------------------

    const dispatch = useDispatch()

    const [disabled] = useState(props.disabled)
    const [content, setContent] = useState(props.content)
    const [backendId, setBackendId] = useState(props.backendId) // BackendId of ProcedureObject
    const [stepId, setStepId] = useState(props.stepId) // StepId of ProcedureObject
    const [stored, setStored] = useState(props.stored) // Indicator if ProcedureObject already got stored in backed
    const [updated, setUpdated] = useState(false) // Indicator if the content got updated
    const [updateError, setUpdateError] = useState(false) // Indicator if there was an error while updating
    const [showTooltip, setShowTooltip] = useState(false)
    const [delayTimeout, setDelayTimeout] = useState(null)

    // onclose logic ref from accordion in createProcedure
    useImperativeHandle(ref, () => ({
        handleClose() {
            if (updated) {
                updateContent()
            }
        },
        changeQuestionnaireSystem(id, newSystem) {
            let newContent = {...content}
            newContent.system = newSystem
            setContent(newContent)
            updateQuestionnaireRef(newContent)
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
                if (k === "system") {
                    props.setMessage({type: "danger", text: "Please select a system!"})
                } else {
                    props.setMessage({type: "danger", text: "There are still some fields missing that need to be filled in!"})
                }
                return false
            }
        }
        return true
    }

    const contentWrong = () => {
        if (props.type === ProcedureTypes.TextPage) {
            if (isBodyEmpty(content.body)) {
                props.setMessage({type: "danger", text: "Body can't be empty"})
                return false
            } else {
                return true
            }
        }
        if (props.type === ProcedureTypes.Condition) {
            try {
                JSON.parse(content.config)
                return true
            } catch (error) {
                props.setMessage({type: "danger", text: "Error while parsing config to JSON"})
                return false
            }
        }
        if (props.type === ProcedureTypes.Pause) {
            const pauseChecklist = {
                body: false,
                proceed_body: false,
                config: false
            }
            if (isBodyEmpty(content.body)) {
                props.setMessage({type: "danger", text: "Body can't be empty"})
                return false
            } else {
                pauseChecklist.body = true
            }
            if (isBodyEmpty(content.proceed_body)) {
                props.setMessage({type: "danger", text: "Proceed Body can't be empty"})
                return false
            } else {
                pauseChecklist.proceed_body = true
            }
            try {
                JSON.parse(content.config)
                pauseChecklist.config = true
            } catch (error) {
                props.setMessage({type: "danger", text: "Error while parsing config to JSON"})
                return false
            }
            for (let key in pauseChecklist) {
                if (!pauseChecklist[key]) {
                    props.setMessage({type: "danger", text: "Something went fatally wrong, ask your developer"})
                    return false
                }
                return true
            }
        }
        return true
    }

    const updateQuestionnaireRef = async (newContent) => {
        // if not stored or not complete return
        if (!stored || !contentComplete()) return

        // update Questionnaire in Backend
        const response = await dispatch(updateQuestionnaire({questionnaireId: backendId, questionnaire: {
            "url": newContent.url,
            "system": newContent.system
        }}))

        // if response successful status 204
        if (response.payload.status === 204) {
            props.setMessage({type: "success", text: "Questionnaire updated"})
        } else {
            props.setMessage({ type: "danger", text: "Error while updating Questionnaire, please reload page!" })
        }
    }

    const storeContent = async () => {
        if (!contentComplete()) {
            setUpdateError(true)
            return
        }

        if (!contentWrong()) {
            setUpdateError(true)
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
            const conditionContent = { ...content }
            conditionContent.config = JSON.parse(content.config)
            response_create = await dispatch(createCondition(conditionContent))
            response_step = await dispatch(createSingleProcedureConfigStep({
                "procedureConfigId": props.rootBackendId,
                "procedureConfigStep": {
                    "counterbalance": props.counterbalance,
                    "condition_id": response_create.payload.body.id
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
            const pauseContent = { ...content }
            pauseContent.config = JSON.parse(content.config)
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
            // update backend
            props.updateOnCreate()
        } else {
            props.setMessage({ type: "danger", text: "Error while creating Procedure-Object" })
            setUpdated(true)
        }
    }

    const updateContent = async () => {
        setUpdated(false)
        setUpdateError(false)

        if (!stored) {
            storeContent().then(r => { })
            return
        }

        if (!contentComplete()) {
            setUpdateError(true)
            return
        }

        if (!contentWrong()) {
            setUpdateError(true)
            return
        }

        // update ProcedureObject in Backend
        let response = { payload: { status: 400 } }
        if (props.type === ProcedureTypes.TextPage) {
            response = await dispatch(updateText({textId: backendId, text: {
                    "title": content.title,
                    "body": content.body
                }}))
        }
        else if (props.type === ProcedureTypes.Condition) {
            const conditionConfig = JSON.parse(content.config)
            response = await dispatch(updateCondition({
                conditionId: backendId, condition: {
                    "name": content.name,
                    "config": conditionConfig,
                    "url": content.url
                }
            }))
        }
        else if (props.type === ProcedureTypes.Questionnaire) {
            response = await dispatch(updateQuestionnaire({questionnaireId: backendId, questionnaire: {
                    "url": content.url,
                    "system": content.system
                }}))
        }
        else if (props.type === ProcedureTypes.Pause) {
            const pauseConfig = JSON.parse(content.config)
            response = await dispatch(updatePause({
                pauseId: backendId, pause: {
                    "title": content.title,
                    "body": content.body,
                    "proceed_body": content.proceed_body,
                    "type": content.type,
                    "config": pauseConfig //
                }
            }))
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

    const handleSave = async (event) => {
        event.preventDefault()
    
        const eventTarget = event.target
        let button
        
        if (eventTarget.nodeName === "BUTTON") {
            button = eventTarget;
        } else {
            button = eventTarget.closest('button');
        }
        
        if (button) {
            button.blur()
        
            if (updated) {
                await updateContent()
            }
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
                return <TextPageForm error={updateError} content={content} editProcedureStep={editProcedureStep}/>
            case ProcedureTypes.Condition:
                return <ConditionForm error={updateError} content={content} editProcedureStep={editProcedureStep}/>
            case ProcedureTypes.Questionnaire:
                return <QuestionnaireForm error={updateError} content={content} editProcedureStep={editProcedureStep}/>
            case ProcedureTypes.Pause:
                return <PauseForm error={updateError} content={content} editProcedureStep={editProcedureStep}/>
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

        const notStoredBadge = !stored && <Badge pill bg="secondary" className="status-pill ms-1">not stored</Badge>
        const updateErrorBadge = (stored && updateError) && <Badge pill bg="danger" className="status-pill ms-1">update error</Badge>
        return <>
            { header } { notStoredBadge } { updateErrorBadge }
        </>
    }

    const getColor = (procedureType) => {
        return procedureType.color
    }

    const handleMouseEnter = () => {
        const timeout = setTimeout(() => { setShowTooltip(true) }, 500)
        setDelayTimeout(timeout)
    }

    const handleMouseLeave = () => {
        clearTimeout(delayTimeout)
        setShowTooltip(false)
    }

    // Sector: ProcedureObject FrontEnd interactions: End --------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------


    return (
        <div className={`${styles.procedureElement} ${styles[procedureType.class]}`}>
            <DragHandleComponent className={disabled ? styles.dragHandleNotAllowed : styles.dragHandle}>
                {dotsSVG}
            </DragHandleComponent>

            <Accordion.Item eventKey={props.id} className={`${styles.accordionItem}`}>
                <Accordion.Header>{getHeader(props.type, content)}</Accordion.Header>
                <Accordion.Body>
                    {getForm(props.type, content, editContent)}
                </Accordion.Body>
            </Accordion.Item>

            <OverlayTrigger
                placement="top"
                show={showTooltip}
                overlay={<Tooltip id="tooltip-top">Manual save</Tooltip>}
            >
                <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!updated}
                    className={styles.saveButton}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Save />
                </Button>
            </OverlayTrigger>

            {!disabled &&
                <Button variant="danger" size="sm" onClick={() => props.deleteProcedureObject(props.id)} className={styles.deleteButton}>
                    <Trash3 />
                </Button>
            }

        </div>
    )
})
export default ProcedureObject