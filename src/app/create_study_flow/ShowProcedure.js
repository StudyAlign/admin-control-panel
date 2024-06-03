import React, { useEffect, useState, useMemo } from "react";
import { Accordion, Form } from "react-bootstrap";
import { List, Item } from "react-sortful";
import { useDispatch, useSelector } from "react-redux";

import { getTexts, selectTexts } from "../../redux/reducers/textSlice";
import { getConditions, selectConditions } from "../../redux/reducers/conditionSlice";
import { getQuestionnaires, selectQuestionnaires } from "../../redux/reducers/questionnaireSlice";
import { getPauses, selectPauses } from "../../redux/reducers/pauseSlice";
import { getProcedureConfig, selectStudyProcedure } from "../../redux/reducers/studySlice";

import { ProcedureTypes } from "./ProcedureObject";

import styles from "./CreateProcedure.module.css";

function ShowProdecureObject(props) {

    // -----------------------------------------------------------------------------------------------------------
    // Sector: ProcedureObject content forms: Start --------------------------------------------------------------

    function TextPageForm(props) {

        return (
            <Form>
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
            <Form>
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
            <Form>
                <Form.Group className="mb-3" controlId="url">
                    <Form.Label> URL </Form.Label>
                    <Form.Control type="url" value={props.content.url} readOnly/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="system">
                    <Form.Label> System </Form.Label>
                    <Form.Control type="text" value={props.content.system} readOnly/>
                </Form.Group>
            </Form>
        )
    }

    function PauseForm(props) {

        return (
            <Form>
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
                    <Form.Control type="text" value={props.content.type} readOnly/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="config">
                    <Form.Label> Config </Form.Label>
                    <Form.Control as="textarea" rows={3} value={props.content.config} readOnly/>
                </Form.Group>
            </Form>
        )
    }

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
                header = !content.title ? procedureType.label : content.title + " - " + procedureType.label
                break
            case ProcedureTypes.Condition:
                header = !content.name ? procedureType.label : content.name + " - " + procedureType.label
                break
            case ProcedureTypes.Questionnaire:
                header = procedureType.label
                break
        }
        return header
    }

    // Sector: ProcedureObject content forms: End --------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------

    return (
        <div className={styles.procedureElement}>
            <Accordion.Item eventKey={props.id} className={styles.accordionItem}>
                <Accordion.Header>{getHeader(props.type, props.content)}</Accordion.Header>
                <Accordion.Body>
                    {getForm(props.type, props.content)}
                </Accordion.Body>
            </Accordion.Item>
        </div>
    )
}

// ---------------------------------------------------------------------------------------------------
// Sector: Initial Procedure Map: Start --------------------------------------------------------------

// Root ID
const rootMapId = 'root'

// Initial list map
const initialProcedureMap = new Map([
    [
        rootMapId,
        { id: rootMapId, backendId: undefined, children: [] },
    ],
])

// Sector: Initial Procedure Map: End --------------------------------------------------------------
// -------------------------------------------------------------------------------------------------


export default function ShowProcedure(props) {

    const { study_id } = props
    
    // ---------------------------------------------------------------------------------------------------------
    // Sector: React States: Start --------------------------------------------------------------

    // States
    const [procedureObjectMapState, setProcedureObjectMapState] = useState(initialProcedureMap) // nested state   
    const [isSetupDone, setIsSetupDone] = useState(false) // Setup State
    const [isDispatched, setIsDispatched] = useState(false) // Dispatch State
    const [loading, setLoading] = useState(true)

    // Sector: React States: End --------------------------------------------------------------
    // ------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------
    // Sector: Backend-Calls: Start --------------------------------------------------------------

    const dispatch = useDispatch()

    const texts = useSelector(selectTexts)
    const conditions = useSelector(selectConditions)
    const pauses = useSelector(selectPauses)
    const questions = useSelector(selectQuestionnaires)
    const procedureConfig = useSelector(selectStudyProcedure)

    useEffect(() => {
        Promise.all([
            dispatch(getTexts(study_id)),
            dispatch(getConditions(study_id)),
            dispatch(getQuestionnaires(study_id)),
            dispatch(getPauses(study_id)),
            dispatch(getProcedureConfig(study_id))
        ]).then(() => {
            // All dispatch calls are done
            setIsDispatched(true)
        })
    }, [])

    // After everything is loaded
    useEffect(() => {
        if (isDispatched && !isSetupDone && texts != null && questions != null && pauses != null && conditions != null && procedureConfig != null) {

            // set rootId
            const newMap = new Map(procedureObjectMapState)
            const rootItem = newMap.get(rootMapId)
            rootItem.backendId = procedureConfig.id

            // load saved procedure steps
            const gatherSteps = (steps) => {
                let procedure = []
                let texts_c = [...texts]
                let conditions_c = [...conditions]
                let pauses_c = [...pauses]
                let questions_c = [...questions]
                for (let step of steps) {
                    // structure obj
                    let newContent = {
                        id: undefined,
                        title: undefined,
                        type: undefined,
                        counterbalance: step["counterbalance"],
                        content: undefined,
                        children: undefined
                    }
                    if (step["text_id"] != null) {
                        let idx = texts_c.findIndex(obj => {
                            return obj.id === step["text_id"]
                        })
                        if (idx > -1) {
                            newContent.id = "t" + step["text_id"].toString()
                            newContent.title = ProcedureTypes.TextPage.label + " - " + newContent.id
                            newContent.type = ProcedureTypes.TextPage
                            let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.TextPage.emptyContent))
                            for (let [key,] of Object.entries(ProcedureTypes.TextPage.emptyContent)) {
                                empty_content[key] = texts_c[idx][key]
                            }
                            newContent.content = JSON.parse(JSON.stringify(empty_content))
                            // push new content
                            procedure.push(newContent)
                            texts_c.splice(idx, 1)
                        }
                    }
                    else if (step["condition_id"] != null) {
                        let idx = conditions_c.findIndex(obj => {
                            return obj.id === step["condition_id"]
                        })
                        if (idx > -1) {
                            newContent.id = "c" + step["condition_id"].toString()
                            newContent.title = ProcedureTypes.Condition.label + " - " + newContent.id
                            newContent.type = ProcedureTypes.Condition
                            let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.Condition.emptyContent))
                            for (let [key,] of Object.entries(ProcedureTypes.Condition.emptyContent)) {
                                empty_content[key] = conditions_c[idx][key]
                            }
                            newContent.content = JSON.parse(JSON.stringify(empty_content))
                            // push new content
                            procedure.push(newContent)
                            conditions_c.splice(idx, 1)
                        }
                    }
                    else if (step["questionnaire_id"] != null) {
                        let idx = questions_c.findIndex(obj => {
                            return obj.id === step["questionnaire_id"]
                        })
                        if (idx > -1) {
                            newContent.id = "q" + step["questionnaire_id"].toString()
                            newContent.title = ProcedureTypes.Questionnaire.label + " - " + newContent.id
                            newContent.type = ProcedureTypes.Questionnaire
                            let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.Questionnaire.emptyContent))
                            for (let [key,] of Object.entries(ProcedureTypes.Questionnaire.emptyContent)) {
                                empty_content[key] = questions_c[idx][key]
                            }
                            newContent.content = JSON.parse(JSON.stringify(empty_content))
                            // push new content
                            procedure.push(newContent)
                            questions_c.splice(idx, 1)
                        }
                    }
                    else if (step["pause_id"] != null) {
                        let idx = pauses_c.findIndex(obj => {
                            return obj.id === step["pause_id"]
                        })
                        if (idx > -1) {
                            newContent.id = "p" + step["pause_id"].toString()
                            newContent.title = ProcedureTypes.Pause.label + " - " + newContent.id
                            newContent.type = ProcedureTypes.Pause
                            let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.Pause.emptyContent))
                            for (let [key,] of Object.entries(ProcedureTypes.Pause.emptyContent)) {
                                empty_content[key] = pauses_c[idx][key]
                            }
                            newContent.content = JSON.parse(JSON.stringify(empty_content))
                            // push new content
                            procedure.push(newContent)
                            pauses_c.splice(idx, 1)
                        }
                    }
                    else if (step["block_id"] != null) {
                        if (step["block_id"] > -1) {
                            newContent.id = "b" + step["block_id"].toString()
                            newContent.title = ProcedureTypes.BlockElement.label + " - " + newContent.id
                            newContent.type = ProcedureTypes.BlockElement
                            let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.BlockElement.emptyContent))
                            empty_content.study_id = step["block"]["study_id"]
                            newContent.content = JSON.parse(JSON.stringify(empty_content))
                            newContent.children = gatherSteps(step["block"]["procedure_config_steps"])
                            // push new content
                            procedure.push(newContent)
                        }
                    }
                }
                return procedure
            }

            // get every ProcedureObject and nested children
            let rootElements = gatherSteps(procedureConfig.procedure_config_steps)

            // extract blockElements and childElements and childIds
            let blockElements = rootElements.filter(element => element.type === ProcedureTypes.BlockElement)
            let childElements = []

            for (let blockElement of blockElements) {
                let childrenIds = []
                for (let childElement of blockElement.children) {
                    childrenIds.push(childElement.id)
                    childElements.push(childElement)
                }
                // replace children with childrenIds
                blockElement.children = childrenIds
            }

            // set root ProcedureObjects
            for (let rootElement of rootElements) {
                if (rootElement.type === ProcedureTypes.BlockElement) {
                    // set BlockElement instead of rootElement
                    newMap.set(rootElement.id, blockElements[0])
                    blockElements.shift()
                } else {
                    newMap.set(rootElement.id, rootElement)
                }
                rootItem.children.push(rootElement.id)
            }

            // set all nested ProcedureObjects
            for (let childElement of childElements) {
                newMap.set(childElement.id, childElement)
            }

            // update initial map
            setProcedureObjectMapState(newMap)
            // Set isSetupDone to true after the setup is done
            setIsSetupDone(true)
            // Set loading to false after setup is done
            setLoading(false)
        }
    }, [texts, questions, pauses, conditions, procedureConfig, isSetupDone, isDispatched])

    // Sector: Backend-Calls: End --------------------------------------------------------------
    // -----------------------------------------------------------------------------------------


    // ----------------------------------------------------------------------------------------------------------------
    // Sector: Render ProcedureObjects: Start --------------------------------------------------------------

    const procedureObjects = useMemo(() => {

        // Get top level procudure objects
        const topLevelProcedureObjects = procedureObjectMapState
            .get(rootMapId)
            .children.map((procedureObjectId) => procedureObjectMapState.get(procedureObjectId))

        // recursive create procedure objects
        const createBlock = (procedureObject, index, isChild = false) => {
            // Create reference to element

            if (procedureObject.children !== undefined) {
                const childProcedureObjects = procedureObject.children.map((procedureObjectId) => procedureObjectMapState.get(procedureObjectId))
                const blockProcedureChildren = childProcedureObjects.map((childProcedureObject, childIndex) => createBlock(childProcedureObject, childIndex, true))

                return (
                    <Item
                        key={procedureObject.id}
                        identifier={procedureObject.id}
                        index={index}
                        isGroup
                        isUsedCustomDragHandlers
                    >

                        <div className={styles.checkBoxOverlay}>
                            <div className={styles.block}>
                                <div className={styles.blockHeader}>
                                    <div className={styles.heading}>
                                        {procedureObject.type.label}
                                    </div>
                                </div>
                                {blockProcedureChildren}
                            </div>

                            <Form.Check
                                className={styles.checkBox}
                                type="checkbox"
                                checked={procedureObject.counterbalance}
                                disabled={true}
                            />
                        </div>
                    </Item>

                )
            }
            return (
                <Item
                    key={procedureObject.id}
                    identifier={procedureObject.id}
                    index={index}
                    isUsedCustomDragHandlers
                >
                    <div className={styles.checkBoxOverlay}>
                        <ShowProdecureObject
                            id={procedureObject.id}
                            content={procedureObject.content}
                            type={procedureObject.type}
                        />
                        {true && !isChild &&
                            <Form.Check
                                className={styles.checkBox}
                                type="checkbox"
                                checked={procedureObject.counterbalance}
                                disabled={true}
                            />
                        }
                    </div>
                </Item>
            )
        }

        return topLevelProcedureObjects.map((procedureObject, index) => createBlock(procedureObject, index))
    }, [procedureObjectMapState])

    // Sector: Render ProcedureObjects: End --------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------

    const renderDropLineElement = (injectedProps) => (
        <div
            ref={injectedProps.ref}
            className={styles.dropLine}
            style={injectedProps.style}
        />
    )
    
    if(loading) {
        return (
            <div>
                Loading... (Try refreshing the page if this takes too long)
            </div>)
    }
    
    return (
        <div className={styles.ProcedureOrder}>
            <List
                className={styles.wrapper}
                renderDropLine={renderDropLineElement}
                disabled={true}
            >
                <Accordion
                    defaultActiveKey="0"
                    flush
                >
                    {procedureObjects}
                </Accordion>
            </List>
        </div>
    )
}