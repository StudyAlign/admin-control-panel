import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Card, Col, Container, Row, Accordion } from "react-bootstrap";
import { Trash3 } from "react-bootstrap-icons";
import { DragHandleComponent, List, Item } from "react-sortful";
import { useDispatch, useSelector } from "react-redux";
import arrayMove from "array-move";
import classnames from "classnames";

import { getTexts, selectTexts, deleteText } from "../../redux/reducers/textSlice";
import { getConditions, selectConditions, deleteCondition } from "../../redux/reducers/conditionSlice";
import { getQuestionnaires, selectQuestionnaires, deleteQuestionnaire } from "../../redux/reducers/questionnaireSlice";
import { getPauses, selectPauses, deletePause } from "../../redux/reducers/pauseSlice";
import { getStudySetupInfo, selectStudySetupInfo, updateStudy, getProcedureConfig, selectStudyProcedure, createSingleProcedureConfigStep, updateProcedure } from "../../redux/reducers/studySlice";
import { createBlock, deleteBlock } from "../../redux/reducers/blockSlice";

import StudyCreationLayout, { CreationSteps } from "./StudyCreationLayout";
import ProcedureAlert from "./ProcedureAlert";
import ProcedureObject, { ProcedureTypes } from "./ProcedureObject";

import styles from "./CreateProcedure.module.css";




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




export default function CreateProcedure() {




    // ---------------------------------------------------------------------------------------------------------
    // Sector: React States and References: Start --------------------------------------------------------------

    // States
    const [procedureObjectMapState, setProcedureObjectMapState] = useState(initialProcedureMap) // nested state   
    const [selectedAccordionKey, setSelectedAccordionKey] = useState(null) // Collapse Reference State
    const [isSetupDone, setIsSetupDone] = useState(false) // Setup State

    // Message State
    const [message, setMessage] = useState({
        type: "none", // "success"/"danger"/"warning"/"info"
        text: "..."
    })

    // reference to ProcedureObject elements
    const procedureObjectRefs = useRef(new Map())

    // Sector: React States and References: End --------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------

    
    
    
    // --------------------------------------------------------------------------------------------
    // Sector: Backend: Start --------------------------------------------------------------
    
    const dispatch = useDispatch()
    const { study_id } = useParams()
    const navigate = useNavigate()

    const texts = useSelector(selectTexts)
    const conditions = useSelector(selectConditions)
    const pauses = useSelector(selectPauses)
    const questions = useSelector(selectQuestionnaires)
    const studySetupInfo = useSelector(selectStudySetupInfo)
    const procedureConfig = useSelector(selectStudyProcedure)

    useEffect(  () => {
        dispatch(getTexts(study_id))
        dispatch(getConditions(study_id))
        dispatch(getQuestionnaires(study_id))
        dispatch(getPauses(study_id))
        dispatch(getStudySetupInfo(study_id))
        dispatch(getProcedureConfig(study_id))
    }, [])

    // After everything is loaded
    useEffect(() => {
        if (!isSetupDone && texts != null && questions != null && pauses != null && conditions != null && procedureConfig != null){

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
                for(let step of steps){
                    console.log("Step", step["id"], ProcedureTypes)
                    // structure obj
                    let newContent = {
                        id: undefined,
                        title: undefined,
                        type: undefined,
                        backendId: undefined,
                        stepId: step["id"],
                        counterbalance: step["counterbalance"],
                        content: undefined,
                        stored: true,
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
                            newContent.backendId = step["text_id"]
                            let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.TextPage.emptyContent))
                            for(let [key,] of Object.entries(ProcedureTypes.TextPage.emptyContent)){
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
                            newContent.backendId = step["condition_id"]
                            let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.Condition.emptyContent))
                            for(let [key,] of Object.entries(ProcedureTypes.Condition.emptyContent)){
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
                            newContent.backendId = step["questionnaire_id"]
                            let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.Questionnaire.emptyContent))
                            for(let [key,] of Object.entries(ProcedureTypes.Questionnaire.emptyContent)){
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
                            newContent.backendId = step["pause_id"]
                            let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.Pause.emptyContent))
                            for(let [key,] of Object.entries(ProcedureTypes.Pause.emptyContent)){
                                empty_content[key] = pauses_c[idx][key]
                            }
                            newContent.content = JSON.parse(JSON.stringify(empty_content))
                            // push new content
                            procedure.push(newContent)
                            pauses_c.splice(idx, 1)
                        }
                    }
                    else if (step["block_id"] != null) {
                        if(step["block_id"] > -1){
                            newContent.id = "b" + step["block_id"].toString()
                            newContent.title = ProcedureTypes.BlockElement.label + " - " + newContent.id
                            newContent.type = ProcedureTypes.BlockElement
                            newContent.backendId = step["block_id"]
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

            for(let blockElement of blockElements){
                let childrenIds = []
                for(let childElement of blockElement.children){
                    childrenIds.push(childElement.id)
                    childElements.push(childElement)
                }
                // replace children with childrenIds
                blockElement.children = childrenIds
            }

            // set root ProcedureObjects
            for(let rootElement of rootElements){
                if(rootElement.type === ProcedureTypes.BlockElement){
                    // set BlockElement instead of rootElement
                    newMap.set(rootElement.id, blockElements[0])
                    blockElements.shift()
                }else{
                    newMap.set(rootElement.id, rootElement)
                }
                rootItem.children.push(rootElement.id)
            }

            // set all nested ProcedureObjects
            for(let childElement of childElements){
                newMap.set(childElement.id, childElement)
            }

            // update initial map
            setProcedureObjectMapState(newMap)
            // Set isSetupDone to true after the setup is done
            setIsSetupDone(true)
            // Show success
            setMessage({ type: "success", text: "Procedure is loaded" })
        }
    }, [texts, questions, pauses, conditions, procedureConfig, isSetupDone])

    const updateProcedureBackend = async (config) => {
        console.log("Update Procedure Backend", config)
        let response = await dispatch(updateProcedure({
            "procedureConfigId": procedureObjectMapState.get(rootMapId).backendId,
            "procedureConfigSteps": { "procedure_config_steps": config }
        }))
        console.log("Update Procedure Backend", response)
    }

    // Sector: Backend: End --------------------------------------------------------------
    // ------------------------------------------------------------------------------------------




    // -------------------------------------------------------------------------------------------------------
    // Sector: Modify ProcedureObjectMap: Start --------------------------------------------------------------

    // Update ProcedureObject after Input
    const updateProcedureMap = (id, backendId, stepId, content, stored) => {
        const newMap = new Map(procedureObjectMapState)
        const procedureObject = newMap.get(id)
        if (procedureObject) {
            procedureObject.content = content
            procedureObject.stored = stored
            procedureObject.backendId = backendId
            procedureObject.stepId = stepId
        }
        setProcedureObjectMapState(newMap)
    }

    // Delete ProcedureObject + nested children
    const deleteProcedureObject = (procedureObjectId) => {
        const newMap = new Map(procedureObjectMapState)

        // delete procedureObject from backend
        const deleteBackend = async (backendId, type) => {
            if (backendId) {
                let response = { payload: { status: 400 } }
                if (type === ProcedureTypes.BlockElement) {
                    response = await dispatch(deleteBlock(backendId))
                } else if (type === ProcedureTypes.TextPage) {
                    response = await dispatch(deleteText(backendId))
                }
                else if (type === ProcedureTypes.Condition) {
                    response = await dispatch(deleteCondition(backendId))
                }
                else if (type === ProcedureTypes.Questionnaire) {
                    response = await dispatch(deleteQuestionnaire(backendId))
                }
                else if (type === ProcedureTypes.Pause) {
                    response = await dispatch(deletePause(backendId))
                }
                // delete later
                console.log("Delete Backend", response)
                if (response.payload.status !== 204) {
                    return false
                }
            }
            return true
        }

        // recursive delete dependent children
        const deleteRecursively = async (id) => {
            const procedureObject = newMap.get(id)
            if (procedureObject) {
                if (procedureObject.children) {
                    for (let childId of procedureObject.children) {
                        await deleteRecursively(childId)
                    }
                }

                let success = await deleteBackend(procedureObject.backendId, procedureObject.type)

                // Only delete from frontend if deleteBackend was successful
                if (success) {
                    newMap.delete(id)
                    // delete ref from procedureObjectRefs
                    procedureObjectRefs.current.delete(id)

                    // delete child from superior element
                    for (let [, value] of newMap) {
                        if (value.children && value.children.includes(id)) {
                            value.children = value.children.filter(childId => childId !== id)
                        }
                    }

                    // Show success
                    setMessage({ type: "success", text: "Procedure-Object deleted" })
                } else {
                    setMessage({ type: "danger", text: "Error while deleting Procedure-Object" })
                }
            }
        }

        // Wait for deleteRecursively to finish before updating state
        deleteRecursively(procedureObjectId).then(() => {
            setProcedureObjectMapState(newMap)
        })

    }

    // Sector: Modify ProcedureObjectMap: End --------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------




    // ----------------------------------------------------------------------------------------------------------------
    // Sector: Render and create ProcedureObjects: Start --------------------------------------------------------------

    const createProcedureStep = async (event, procedureType) => {
        event.preventDefault()

        // React Button event => disable, bcause buggy
        const button = event.target
        button.disabled = true

        // Procedure ID depends on current time
        const newId = Date.now()
        
        // Set study id
        let empty_content = JSON.parse(JSON.stringify(procedureType.emptyContent))
        empty_content.study_id = study_id

        // Create new ProcedureObject
        let isBlockElement = procedureType === ProcedureTypes.BlockElement
        const newProcedureObject = {
            id: newId,
            title: procedureType.label + " - " + newId,
            type: procedureType,
            backendId: undefined,
            stepId: undefined,
            counterbalance: false,
            content: empty_content,
            stored: isBlockElement ? true : false,
            children: isBlockElement ? [] : undefined
        }

        console.log("Create Procedure Step Type", ProcedureTypes)
        console.log("Create Procedure Step Type now", procedureType)
        console.log("Create Procedure Step", newProcedureObject)

        // Add to list
        const newMap = new Map(procedureObjectMapState)
        const rootItem = newMap.get(rootMapId)

        if (isBlockElement) {
            // create BlockProcedure + step in Backend
            let response_create = { payload: { status: 400 } }
            response_create = await dispatch(createBlock(newProcedureObject.content))
            let response_step = { payload: { status: 400 } }
            response_step = await dispatch(createSingleProcedureConfigStep({
                "procedureConfigId": procedureObjectMapState.get(rootMapId).backendId,
                "procedureConfigStep": {
                    "counterbalance": newProcedureObject.counterbalance,
                    "block_id": response_create.payload.body.id
                }
            }))
            console.log("Create Block", response_create, response_step)
            // if response successful status 200
            if (response_create.payload.status === 200 && response_step.payload.status === 200) {
                // set backendId
                newProcedureObject.backendId = response_create.payload.body.id
                newProcedureObject.stepId = response_step.payload.body.id
                setMessage({ type: "success", text: "Procedure-Object created" })
                newMap.set(newId, newProcedureObject)
                rootItem.children.push(newId)
            } else {
                setMessage({ type: "danger", text: "Error while creating Procedure-Object" })
            }
        } else {
            newMap.set(newId, newProcedureObject)
            rootItem.children.push(newId)
        }

        setProcedureObjectMapState(newMap)

        // Activate button again
        setTimeout(() => {
            button.disabled = false
        }, 300)
    }

    const procedureStepButtons = () => {
        let buttons = []
        for (let t in ProcedureTypes) {
            buttons.push(
                <Col xs={'auto'} key={ProcedureTypes[t].id}>
                    <Button
                        type="button"
                        style={{ backgroundColor: ProcedureTypes[t].color, borderColor: ProcedureTypes[t].color }}
                        onClick={(event) => createProcedureStep(event, ProcedureTypes[t])}> {ProcedureTypes[t].label} </Button>
                </Col>
            )
        }
        return buttons
    }

    const procedureObjects = useMemo(() => {

        // Get top level procudure objects
        const topLevelProcedureObjects = procedureObjectMapState
            .get(rootMapId)
            .children.map((procedureObjectId) => procedureObjectMapState.get(procedureObjectId))

        // recursive create procedure objects
        const createBlock = (procedureObject, index) => {
            // Create reference to element
            let ref = procedureObjectRefs.current.get(procedureObject.id)
            if (!ref) {
                ref = React.createRef()
                procedureObjectRefs.current.set(procedureObject.id, ref)
            }

            if (procedureObject.children !== undefined) {
                const childProcedureObjects = procedureObject.children.map((procedureObjectId) => procedureObjectMapState.get(procedureObjectId))
                const blockProcedureChildren = childProcedureObjects.map(createBlock)

                return (
                    <Item
                        key={procedureObject.id}
                        identifier={procedureObject.id}
                        index={index}
                        isGroup
                        isUsedCustomDragHandlers
                    >
                        <div className={styles.block}>
                            <div className={styles.blockHeader}>
                                <DragHandleComponent className={styles.dragHandleBlock}>
                                    <div className={styles.heading}>
                                        {procedureObject.type.label}
                                    </div>
                                </DragHandleComponent>
                                <Button
                                    className={styles.deleteButton}
                                    onClick={() => deleteProcedureObject(procedureObject.id)}
                                    variant="danger"
                                    size="sm"                                    
                                >
                                    <Trash3 />
                                </Button>
                            </div>
                            {blockProcedureChildren}
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
                    <ProcedureObject
                        ref={ref}
                        id={procedureObject.id}
                        backendId={procedureObject.backendId}
                        stepId={procedureObject.stepId}
                        rootBackendId={procedureObjectMapState.get(rootMapId).backendId}
                        counterbalance={procedureObject.counterbalance}
                        content={procedureObject.content}
                        type={procedureObject.type}
                        stored={procedureObject.stored}
                        setMessage={setMessage}
                        deleteProcedureObject={deleteProcedureObject}
                        updateProcedureMap={updateProcedureMap}
                    />
                </Item>
            )
        }

        return topLevelProcedureObjects.map(createBlock)
    }, [procedureObjectMapState])

    // Sector: Render and create ProcedureObjects: End --------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------




    // -------------------------------------------------------------------------------------------
    // Sector: Drag and drop: Start --------------------------------------------------------------

    // update cursor while dragging
    const toggleCursorStyles = (disable) => {
        // deactivate pointer events on accordion to show ghost render
        let elementsWithCursorStyle = document.querySelectorAll('.accordion-header')
        elementsWithCursorStyle.forEach(element => {
            if (disable) {
                element.style.pointerEvents = 'none'
            } else {
                element.style.pointerEvents = 'auto'
            }
        })
        // change cursor style on svg and body
        elementsWithCursorStyle = document.querySelectorAll('svg')
        elementsWithCursorStyle.forEach(element => {
            if (disable) {
                element.style.cursor = 'grabbing'
            } else {
                element.style.cursor = 'grab'
            }
        })
        let body = document.querySelector('body')
        if (disable) {
            body.style.cursor = 'grabbing'
        } else {
            body.style.cursor = 'auto'
        }

    }

    const onDragStart = () => {
        // deactivate cursor styles
        toggleCursorStyles(true)
    }

    const onDragEnd = useCallback(
        (meta) => {
            // activate cursor styles
            toggleCursorStyles(false)

            // Prevent Block procedures from being moved to other Block procedures
            const targetBlock = procedureObjectMapState.get(meta.nextGroupIdentifier ?? rootMapId)
            if (targetBlock && targetBlock.children !== undefined && targetBlock.id !== rootMapId) {
                const draggedBlock = procedureObjectMapState.get(meta.identifier)
                if (draggedBlock && draggedBlock.children !== undefined) {
                    setMessage({
                        type: "danger",
                        text: "You can't nest Block Elements within other Block Elements.",
                        duration: 4000})
                    return;
                }
            }

            // Check whether the ProcedureObject was moved to the same position within the same Block
            if (meta.groupIdentifier === meta.nextGroupIdentifier && meta.index === meta.nextIndex) return

            // ProcedureObject does not exist
            const newMap = new Map(procedureObjectMapState.entries())
            const procedureObject = newMap.get(meta.identifier)
            if (procedureObject === undefined) return

            // Block does not exist
            const blockProcedureObject = newMap.get(meta.groupIdentifier ?? rootMapId)
            if (blockProcedureObject === undefined) return
            if (blockProcedureObject.children === undefined) return

            // Move ProcedureObject within the same ProcedureObject
            if (meta.groupIdentifier === meta.nextGroupIdentifier) {
                const nextIndex = meta.nextIndex ?? blockProcedureObject.children?.length ?? 0
                blockProcedureObject.children = arrayMove(
                    blockProcedureObject.children,
                    meta.index,
                    nextIndex
                )
            } else {
                // Move ProcedureObject to another Block
                const nextBlockProcedureObject = newMap.get(meta.nextGroupIdentifier ?? rootMapId)
                if (nextBlockProcedureObject === undefined) return
                if (nextBlockProcedureObject.children === undefined) return

                blockProcedureObject.children.splice(meta.index, 1)
                if (meta.nextIndex === undefined) {
                    // Adds ProcedureObject to Block without ProcedureObjects
                    nextBlockProcedureObject.children.push(meta.identifier)
                } else {
                    // Adds ProcedureObject to Block of ProcedureObjects
                    nextBlockProcedureObject.children.splice(meta.nextIndex, 0, procedureObject.id)
                }
            }

            setProcedureObjectMapState(newMap)
            console.log("DragEnd")
            // update backend
            updateProcedureBackend(getPlannedProcedure(newMap))
        },
        [procedureObjectMapState]
    )

    // Render DropLine
    const renderDropLineElement = (injectedProps) => (
        <div
            ref={injectedProps.ref}
            className={styles.dropLine}
            style={injectedProps.style}
        />
    )

    // render preview of dragged element
    const renderGhostElement = useCallback(
        ({ identifier, isGroup }) => {
            const procedureObject = procedureObjectMapState.get(identifier)
            if (procedureObject === undefined) return

            // TODO maybe change div content
            if (isGroup) {
                return (
                    <div className={classnames(styles.block, styles.ghost)}>
                        <div className={styles.heading}>
                            {procedureObject.type.label}
                        </div>
                    </div>
                )
            }

            return (
                <div className={classnames(styles.procedureElement, styles.ghost)}>
                    {procedureObject.type.label + " - " + procedureObject.id}
                </div>
            )
        },
        [procedureObjectMapState]
    )

    // render preview for block element while dragging
    const renderStackedGroupElement = useCallback(
        (injectedProps, { identifier }) => {
            const procedureObject = procedureObjectMapState.get(identifier)

            return (
                <div
                    className={classnames(styles.block, styles.stacked)}
                    style={injectedProps.style}
                >
                    <div className={styles.heading}>{procedureObject.type.label}</div>
                </div>
            )
        },
        [procedureObjectMapState]
    )

    // Sector: Drag and drop: End --------------------------------------------------------------
    // -----------------------------------------------------------------------------------------




    // ---------------------------------------------------------------------------------------------------
    // Sector: Evaluate ProcedureMap: Start --------------------------------------------------------------

    const getPlannedProcedure = (newMap) => {
        let planned_procedure = []
        const root = newMap.get(rootMapId)
        if (root.children) {
            for (let childId of root.children) {
                const procedureObject = newMap.get(childId)
                if (procedureObject && procedureObject.stored) {
                    let obj = {}
                    // set main id
                    // obj[procedureObject.type.key + "_id"] = procedureObject.backendId
                    obj["id"] = procedureObject.stepId
                    if(procedureObject.type.key === ProcedureTypes.BlockElement.key){
                        obj[procedureObject.type.key + "_id"] = procedureObject.backendId
                        const innerBlockProcedureObjects = procedureObject.children.map((procedureObjectId) => newMap.get(procedureObjectId))
                        let inner_procedure = []
                        for(let innerProcedureObject of innerBlockProcedureObjects){
                            if(innerProcedureObject && innerProcedureObject.stored){
                                let inner_obj = {}
                                // set child id
                                // inner_obj[innerProcedureObject.type.key + "_id"] = innerProcedureObject.backendId
                                inner_obj["id"] = innerProcedureObject.stepId
                                inner_procedure.push(inner_obj)
                            }
                        }
                        obj[procedureObject.type.key] = inner_procedure
                    }
                    planned_procedure.push(obj)
                }
            }
        }
        // Convert the array to an object
        return planned_procedure
    }

    const getNotStoredSteps = () => {
        let notStored = []
        const newMap = new Map(procedureObjectMapState)
        const root = newMap.get(rootMapId)
        if (root.children) {
            for (let childId of root.children) {
                const procedureObject = newMap.get(childId)
                if (procedureObject && !procedureObject.stored) {
                    notStored.push(procedureObject)
                }
                if (procedureObject && procedureObject.type.key === ProcedureTypes.BlockElement.key) {
                    const innerBlockProcedureObjects = procedureObject.children.map((procedureObjectId) => newMap.get(procedureObjectId))
                    for (let innerProcedureObject of innerBlockProcedureObjects) {
                        if (innerProcedureObject && !innerProcedureObject.stored) {
                            notStored.push(innerProcedureObject)
                        }
                    }
                }
            }
        }
        return notStored
    }

    const onCollapseListener = (eventKey) => {
        // if event key = null => Accordion is closed => current state is last closed Accordion
        // if event key is not state and both are not null => current state represents last closed Accordion
        let closedEvent = eventKey === null || (selectedAccordionKey !== eventKey && selectedAccordionKey !== null && eventKey !== null)

        if(closedEvent && selectedAccordionKey !== null){
            const ref = procedureObjectRefs.current.get(selectedAccordionKey);
            if (ref && ref.current) {
                ref.current.handleClose();
            }
        }

        // check if the selected Accordion is already open
        const isAlreadyOpen = selectedAccordionKey === eventKey;
    
        // update state with selected Accordion key
        setSelectedAccordionKey(isAlreadyOpen ? null : eventKey);
    }

    // Sector: Evaluate ProcedureMap: End --------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------

    
    
    
    // ---------------------------------------------------------------------------------------------------------------
    // Sector: Handle leave CreateProcedure Page: Start --------------------------------------------------------------

    // Navigate currently deactivated
    const handleProceed = async (event) => {
        event.preventDefault()
        let planned_procedure = getPlannedProcedure(procedureObjectMapState)
        let stillNotStored = getNotStoredSteps()
        // await dispatch(updateStudy({
        //     "studyId": study_id,
        //     "study": {
        //         "planned_procedure": planned_procedure,
        //         "current_setup_step": "procedure"
        //     }
        // }))
        // await dispatch(getStudySetupInfo(study_id))
        // navigate("/create/"+study_id+"/integrations")
        console.log("Proceed to Integrations")
        console.log("Not Stored Steps", stillNotStored)
        console.log(procedureObjectMapState)
        console.log(planned_procedure)
        updateProcedureBackend(planned_procedure)
    }

    // Sector: Handle leave CreateProcedure Page: End --------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------



    
    return (
        <StudyCreationLayout step={CreationSteps.Procedure}>
            <Container>

                <Row className='mt-3'>
                    <div style={{ height: 50, width: '100%' }}>
                        <ProcedureAlert message={message}/>
                    </div>
                </Row>

                <Row className='mt-3'>
                    {procedureStepButtons()}
                </Row>

                <Row className='mt-3'>
                    <Card>
                        <Card.Header> Procedure Order </Card.Header>
                        <Card.Body>
                            <div className={styles.ProcedureOrder}>
                                <List
                                    className={styles.wrapper}
                                    renderDropLine={renderDropLineElement}
                                    renderGhost={renderGhostElement}
                                    renderStackedGroup={renderStackedGroupElement}
                                    onDragEnd={onDragEnd}
                                    onDragStart={onDragStart}
                                >
                                    <Accordion
                                        onSelect={(eventKey) => onCollapseListener(eventKey)}
                                        defaultActiveKey="0"
                                        flush 
                                    >
                                        {procedureObjects}
                                    </Accordion>
                                </List>
                            </div>
                        </Card.Body>
                    </Card>
                </Row>

                <Row className='mt-3'>
                    <Col> <Button size="lg" onClick={handleProceed}>Save and Proceed</Button> </Col>
                </Row>

            </Container>
        </StudyCreationLayout>
    )
}