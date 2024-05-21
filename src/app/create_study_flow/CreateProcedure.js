import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Card, Col, Container, Row, Accordion } from "react-bootstrap";
import { Trash3 } from "react-bootstrap-icons";
import { DragHandleComponent, List, Item } from "react-sortful";
import { useDispatch, useSelector } from "react-redux";
import arrayMove from "array-move";
import classnames from "classnames";

import { getTexts, selectTexts } from "../../redux/reducers/textSlice";
import { getConditions, selectConditions } from "../../redux/reducers/conditionSlice";
import { getQuestionnaires, selectQuestionnaires } from "../../redux/reducers/questionnaireSlice";
import { getPauses, selectPauses } from "../../redux/reducers/pauseSlice";
import { getStudySetupInfo, selectStudySetupInfo, updateStudy, getProcedureConfig, selectStudyProcedure } from "../../redux/reducers/studySlice";

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
    // Sector: TODO / Backend: Start --------------------------------------------------------------
    
    // TODO
    const dispatch = useDispatch()
    const { study_id } = useParams()
    const navigate = useNavigate()

    // TODO
    const texts = useSelector(selectTexts)
    const conditions = useSelector(selectConditions)
    const pauses = useSelector(selectPauses)
    const questions = useSelector(selectQuestionnaires)
    const studySetupInfo = useSelector(selectStudySetupInfo)
    const procedureConfig = useSelector(selectStudyProcedure)

    // TODO
    useEffect(  () => {
        dispatch(getTexts(study_id))
        dispatch(getConditions(study_id))
        dispatch(getQuestionnaires(study_id))
        dispatch(getPauses(study_id))
        dispatch(getStudySetupInfo(study_id))
        dispatch(getProcedureConfig(study_id))
    }, [])

    // Set Backend ID to root element
    const hasRunRef = useRef(false);
    useEffect(() => {
        if (procedureConfig != null && !hasRunRef.current) {
            let newMap = new Map(procedureObjectMapState)
            newMap.get(rootMapId).backendId = procedureConfig.id
            setProcedureObjectMapState(newMap)
            // delete later
            console.log(procedureConfig)
            // Mark that the code has run
            hasRunRef.current = true;
        }
    }, [procedureConfig])

    // Sector: TODO / Backend: End --------------------------------------------------------------
    // ------------------------------------------------------------------------------------------




    // -------------------------------------------------------------------------------------------------------
    // Sector: Modify ProcedureObjectMap: Start --------------------------------------------------------------

    // Update ProcedureObject after Input
    const updateProcedureMap = (id, content, stored) => {
        const newMap = new Map(procedureObjectMapState)
        const procedureObject = newMap.get(id)
        if (procedureObject) {
            procedureObject.content = content
            procedureObject.stored = stored
        }
        setProcedureObjectMapState(newMap)
    }

    // Delete ProcedureObject + nested children
    const deleteProcedureObject = (procedureObjectId) => {
        const newMap = new Map(procedureObjectMapState)

        // recursive delete dependent children
        const deleteRecursively = (id) => {
            const procedureObject = newMap.get(id)
            if (procedureObject) {
                if (procedureObject.children) {
                    procedureObject.children.forEach(childId => deleteRecursively(childId))
                }
                newMap.delete(id)
                // delete ref from procedureObjectRefs
                procedureObjectRefs.current.delete(id)
            }
        }
        deleteRecursively(procedureObjectId)

        // delete child from superior element
        for (let [, value] of newMap) {
            if (value.children && value.children.includes(procedureObjectId)) {
                value.children = value.children.filter(id => id !== procedureObjectId)
            }
        }

        setProcedureObjectMapState(newMap)

        // TODO: delete from backend

        // Show success
        setMessage({type: "success", text: "Procedure-Object deleted"})
    }

    // Sector: Modify ProcedureObjectMap: End --------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------




    // ----------------------------------------------------------------------------------------------------------------
    // Sector: Render and create ProcedureObjects: Start --------------------------------------------------------------

    const createProcedureStep = (event, procedureType) => {
        event.preventDefault()

        // React Button event => disable, bcause buggy
        const button = event.target
        button.disabled = true

        // Procedure ID depends on current time
        const newId = Date.now()

        let isBlockElement = procedureType === ProcedureTypes.BlockElement
        const newProcedureObject = {
            id: newId,
            title: procedureType.label + " - " + newId,
            type: procedureType,
            content: procedureType.emptyContent,
            stored: isBlockElement ? true : false,
            children: isBlockElement ? [] : undefined
        }

        if (isBlockElement) {
            // TODO add to backend
        }

        // Add to list
        const newMap = new Map(procedureObjectMapState)
        newMap.set(newId, newProcedureObject)
        const rootItem = newMap.get(rootMapId)
        rootItem.children.push(newId)
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
            console.log(procedureObjectMapState)
            console.log(getPlannedProcedure())
            // TODO update backend
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

    const getPlannedProcedure = () => {
        let planned_procedure = []
        const newMap = new Map(procedureObjectMapState)
        const root = newMap.get(rootMapId)
        if (root.children) {
            for (let childId of root.children) {
                const procedureObject = newMap.get(childId)
                if (procedureObject && procedureObject.stored) {
                    let obj = {}
                    if(procedureObject.type.key === ProcedureTypes.BlockElement.key){
                        const innerBlockProcedureObjects = procedureObject.children.map((procedureObjectId) => newMap.get(procedureObjectId))
                        let inner_procedure = []
                        for(let innerProcedureObject of innerBlockProcedureObjects){
                            if(innerProcedureObject && innerProcedureObject.stored){
                                let inner_obj = {}
                                inner_obj[innerProcedureObject.type.key + "_id"] = innerProcedureObject.content
                                inner_procedure.push(inner_obj)
                            }
                        }
                        obj[procedureObject.type.key + "_id"] = inner_procedure
                    }else{
                        obj[procedureObject.type.key + "_id"] = procedureObject.content
                    }
                    planned_procedure.push(obj)
                }
            }
        }
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
        let planned_procedure = getPlannedProcedure()
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