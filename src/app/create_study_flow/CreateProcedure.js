import React, { useEffect, useState, useMemo, useCallback, useRef, createContext, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Card, Col, Container, Row, Accordion, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Trash3 } from "react-bootstrap-icons";
import { DragHandleComponent, List, Item } from "react-sortful";
import { useDispatch, useSelector } from "react-redux";
import arrayMove from "array-move";

import classnames from "classnames";

import { deleteText } from "../../redux/reducers/textSlice";
import { deleteCondition } from "../../redux/reducers/conditionSlice";
import { deleteQuestionnaire } from "../../redux/reducers/questionnaireSlice";
import { deletePause } from "../../redux/reducers/pauseSlice";
import {
    studySlice,
    getProcedureConfig,
    selectStudyProcedure,
    createSingleProcedureConfigStep,
    updateProcedure,
    updateStudy,
    getStudySetupInfo,
    selectStudySetupInfo,
    getProcedureConfigOverview,
    selectStudyProcedureOverview
} from "../../redux/reducers/studySlice";
import { createBlock, deleteBlock } from "../../redux/reducers/blockSlice";

import StudyCreationLayout, { CreationSteps, StudyStatus } from "./navigation_logic/StudyCreationLayout";
import ProcedureAlert from "./ProcedureAlert";
import ProcedureObject, { ProcedureTypes } from "./ProcedureObject";

import styles from "./CreateProcedure.module.scss";

// ---------------------------------------------------------------------------------------------------
// Sector: Empty Procedure Order: Start --------------------------------------------------------------

export const CreateProcedureContext = createContext()

export const CreateProcedureContextProvider = ({ children }) => {
    // EmptyProcedure
    const [emptyOrder, setEmptyOrder] = useState(false)
    const [emptyOrderListener, setEmptyOrderListener] = useState(true)
    // QuestionnaireSystem
    const [questionnaireUpdateList, setQuestionnaireUpdateList] = useState([])
    const [currentSystem, setCurrentSystem] = useState("")
    const [questionnaireModalContent, setQuestionnaireModalContent] = useState([])
    const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false)

    const NO_QUESTIONNAIRE_SYSTEM = ""

    const addToQuestionnaireUpdateList = (questionnaireId) => {
        // check if questionnaireId is already in list
        if (questionnaireUpdateList.includes(questionnaireId)) return
        setQuestionnaireUpdateList([...questionnaireUpdateList, questionnaireId])
    }

    const removeFromQuestionnaireUpdateList = (questionnaireId) => {
        const filteredList = questionnaireUpdateList.filter(id => id !== questionnaireId)
        if (filteredList.length === 0) {
            setCurrentSystem(NO_QUESTIONNAIRE_SYSTEM)
        }
        setQuestionnaireUpdateList(filteredList)
    }

    const resetQuestionnaireUpdateList = () => {
        setQuestionnaireUpdateList([])
        setCurrentSystem(NO_QUESTIONNAIRE_SYSTEM)
    }

    return (
        <CreateProcedureContext.Provider value={{
            emptyOrder,
            setEmptyOrder,
            emptyOrderListener,
            setEmptyOrderListener,
            //
            addToQuestionnaireUpdateList,
            removeFromQuestionnaireUpdateList,
            resetQuestionnaireUpdateList,
            questionnaireUpdateList,
            currentSystem,
            setCurrentSystem,
            questionnaireModalContent,
            setQuestionnaireModalContent,
            showQuestionnaireModal,
            setShowQuestionnaireModal,
            NO_QUESTIONNAIRE_SYSTEM
        }}>
            {children}
        </CreateProcedureContext.Provider>
    )
}

// Sector: Empty Procedure Order: End --------------------------------------------------------------
// -------------------------------------------------------------------------------------------------




// ---------------------------------------------------------------------------------------------------
// Sector: Initial Procedure Map: Start --------------------------------------------------------------

// Root ID
const rootMapId = 'root'

// Initial list map
const createInitialProcedureMap = () => new Map([
    [
        rootMapId,
        { id: rootMapId, backendId: undefined, children: [] },
    ],
])

// Sector: Initial Procedure Map: End --------------------------------------------------------------
// -------------------------------------------------------------------------------------------------

export default function CreateProcedure(props) {

    const { status } = props

    // ---------------------------------------------------------------------------------------------------------
    // Sector: React States and References: Start --------------------------------------------------------------

    const {
        emptyOrder,
        setEmptyOrder,
        emptyOrderListener,
        setEmptyOrderListener,
        //
        addToQuestionnaireUpdateList,
        removeFromQuestionnaireUpdateList,
        resetQuestionnaireUpdateList,
        questionnaireUpdateList,
        currentSystem,
        setCurrentSystem,
        questionnaireModalContent,
        setQuestionnaireModalContent,
        showQuestionnaireModal,
        setShowQuestionnaireModal,
        NO_QUESTIONNAIRE_SYSTEM
    } = useContext(CreateProcedureContext)

    // States
    const [disabled] = useState(status === StudyStatus.Active ? true : false)
    const [procedureObjectMapState, setProcedureObjectMapState] = useState(createInitialProcedureMap) // nested state  
    const [selectedAccordionKey, setSelectedAccordionKey] = useState(null) // Collapse Reference State
    const [isSetupDone, setIsSetupDone] = useState(false) // Setup State
    const [isDispatched, setIsDispatched] = useState(false) // Dispatch State
    const [showModal, setShowModal] = useState(false) // Modal State

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

    const procedureConfig = useSelector(selectStudyProcedure)
    const procedureConfigOverview = useSelector(selectStudyProcedureOverview)
    const studySetupInfo = useSelector(selectStudySetupInfo)

    useEffect(() => {
        Promise.all([
            dispatch(getProcedureConfig(study_id)),
        ]).then(() => {
            resetQuestionnaireUpdateList()
            setIsDispatched(true)
        })
    }, [])

    useEffect(() => {
        // set empty order listener
        if(getPlannedProcedure(procedureObjectMapState).length === 0){
            if(!emptyOrderListener) setEmptyOrderListener(true)
        } else {
            if(emptyOrderListener) setEmptyOrderListener(false)
        }
    }, [procedureObjectMapState])

    useEffect(() => {
        if (!isSetupDone && procedureConfigOverview != null) {
            // set rootId
            const newMap = new Map(procedureObjectMapState)
            const rootItem = newMap.get(rootMapId)
            rootItem.backendId = procedureConfig.id

            const gatherArray = (steps) => {
                let procedure = []
                for (let step of steps) {
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
                    if (step["text_id"]) {
                        newContent.id = "t" + step["text_id"].toString()
                        newContent.title = ProcedureTypes.TextPage.label + " - " + newContent.id
                        newContent.type = ProcedureTypes.TextPage
                        newContent.backendId = step["text_id"]
                        let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.TextPage.emptyContent))
                        for (let [key,] of Object.entries(ProcedureTypes.TextPage.emptyContent)) {
                            empty_content[key] = step["text"][key]
                        }
                        newContent.content = JSON.parse(JSON.stringify(empty_content))
                        // push new content
                        procedure.push(newContent)
                    } else if (step["condition_id"]) {
                        newContent.id = "c" + step["condition_id"].toString()
                        newContent.title = ProcedureTypes.Condition.label + " - " + newContent.id
                        newContent.type = ProcedureTypes.Condition
                        newContent.backendId = step["condition_id"]
                        let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.Condition.emptyContent))
                        for (let [key,] of Object.entries(ProcedureTypes.Condition.emptyContent)) {
                            empty_content[key] = typeof step["condition"][key] === 'object' ? JSON.stringify(step["condition"][key]) : step["condition"][key]
                        }
                        newContent.content = JSON.parse(JSON.stringify(empty_content))
                        // push new content
                        procedure.push(newContent)
                    } else if (step["questionnaire_id"]) {
                        newContent.id = "q" + step["questionnaire_id"].toString()
                        newContent.title = ProcedureTypes.Questionnaire.label + " - " + newContent.id
                        newContent.type = ProcedureTypes.Questionnaire
                        newContent.backendId = step["questionnaire_id"]
                        let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.Questionnaire.emptyContent))
                        for (let [key,] of Object.entries(ProcedureTypes.Questionnaire.emptyContent)) {
                            empty_content[key] = step["questionnaire"][key]
                        }
                        newContent.content = JSON.parse(JSON.stringify(empty_content))
                        // add to update list
                        addToQuestionnaireUpdateList(newContent.id)
                        setCurrentSystem(empty_content.system)
                        // push new content
                        procedure.push(newContent)
                    } else if (step["pause_id"]) {
                        newContent.id = "p" + step["pause_id"].toString()
                        newContent.title = ProcedureTypes.Pause.label + " - " + newContent.id
                        newContent.type = ProcedureTypes.Pause
                        newContent.backendId = step["pause_id"]
                        let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.Pause.emptyContent))
                        for (let [key,] of Object.entries(ProcedureTypes.Pause.emptyContent)) {
                            empty_content[key] = step["pause"][key]
                        }
                        newContent.content = JSON.parse(JSON.stringify(empty_content))
                        // push new content
                        procedure.push(newContent)
                    } else if (step["block_id"]) {
                        newContent.id = "b" + step["block_id"].toString()
                        newContent.title = ProcedureTypes.BlockElement.label + " - " + newContent.id
                        newContent.type = ProcedureTypes.BlockElement
                        newContent.backendId = step["block_id"]
                        let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.BlockElement.emptyContent))
                        empty_content.study_id = step["block"]["study_id"]
                        newContent.content = JSON.parse(JSON.stringify(empty_content))
                        newContent.children = gatherArray(step["block"]["procedure_config_steps"])
                        // push new content
                        procedure.push(newContent)
                    }
                }
                return procedure
            }

            let rootElements = gatherArray(procedureConfigOverview.procedure_config_steps)
            
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
            // Show success
            setMessage({ type: "success", text: "Procedure is loaded" })
        }
    }, [procedureConfigOverview])

    useEffect(() => {
        if (isDispatched && procedureConfig != null){
            dispatch(getProcedureConfigOverview(procedureConfig.id))
        }
    }, [procedureConfig, isSetupDone, isDispatched])

    const updateProcedureBackend = async (config) => {
        let response = await dispatch(updateProcedure({
            "procedureConfigId": procedureObjectMapState.get(rootMapId).backendId,
            "procedureConfigSteps": { "procedure_config_steps": config }
        }))
        // Status
    }

    const updateOnCreate = () => {
        updateProcedureBackend(getPlannedProcedure(procedureObjectMapState))
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
                    // if questionnaire remove from update list
                    if (procedureObject.type === ProcedureTypes.Questionnaire) {
                        removeFromQuestionnaireUpdateList(id)
                    }

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

    // change counterbalance state
    const changeCounterbalance = (event, id) => {
        event.preventDefault()
        const newMap = new Map(procedureObjectMapState)
        const procedureObject = newMap.get(id)
        if (procedureObject) {
            procedureObject.counterbalance = !procedureObject.counterbalance
        }
        setProcedureObjectMapState(newMap)
        // update backend if stored
        if (procedureObject.stored) updateProcedureBackend(getPlannedProcedure(newMap))
    }

    // Sector: Modify ProcedureObjectMap: End --------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------


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
                    obj["id"] = procedureObject.stepId
                    obj["counterbalance"] = procedureObject.counterbalance
                    if(procedureObject.type.key === ProcedureTypes.BlockElement.key){
                        obj[procedureObject.type.key + "_id"] = procedureObject.backendId
                        const innerBlockProcedureObjects = procedureObject.children.map((procedureObjectId) => newMap.get(procedureObjectId))
                        let inner_procedure = []
                        for(let innerProcedureObject of innerBlockProcedureObjects){
                            if(innerProcedureObject && innerProcedureObject.stored){
                                let inner_obj = {}
                                // set child id
                                inner_obj["id"] = innerProcedureObject.stepId
                                inner_obj["counterbalance"] = false // inside block elements counterbalance is not possible
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

    const onQuestionnaireSystemChange = () => {
        const newMap = new Map(procedureObjectMapState)
        // for each questionaireUpdateList in procedureObjectRefs.current
        for (let questionnaireId of questionnaireUpdateList) {
            const ref = procedureObjectRefs.current.get(questionnaireId)
            if (ref && ref.current) {
                ref.current.changeQuestionnaireSystem(questionnaireId, questionnaireModalContent[1])
            }
            // update frontend state
            const procedureObject = newMap.get(questionnaireId)
            if (procedureObject) {
                procedureObject.content.system = questionnaireModalContent[1]
            }
        }
        setProcedureObjectMapState(newMap)
        setCurrentSystem(questionnaireModalContent[1])
        onQuestionnaireModalClose()
    }

    const onQuestionnaireModalClose = () => {
        setQuestionnaireModalContent([])
        setShowQuestionnaireModal(false)
    }

    const questionnaireModalBody = () => {
        if (questionnaireModalContent.length === 0) {
            return (
                <>
                    <Modal.Body>
                        You have different Systems in your Questionnaires. Please choose one System for all Questionnaires.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => onQuestionnaireModalClose()}>
                            Cancel
                        </Button>
                    </Modal.Footer>
                </>
            )
        } else {
            return (
                <>
                    <Modal.Body>
                        You have different Systems in your Questionnaires. Do you want to change all Systems from "{questionnaireModalContent[0]}" to "{questionnaireModalContent[1]}"?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => onQuestionnaireModalClose()}>
                            Cancel
                        </Button>
                        <Button variant="warning" onClick={() => onQuestionnaireSystemChange()}>
                            Change
                        </Button>
                    </Modal.Footer>
                </>
            )
        }
    }

    const onCollapseListener = (eventKey) => {
        // if event key = null => Accordion is closed => current state is last closed Accordion
        // if event key is not state and both are not null => current state represents last closed Accordion
        let closedEvent = eventKey === null || (selectedAccordionKey !== eventKey && selectedAccordionKey !== null && eventKey !== null)

        if(closedEvent && selectedAccordionKey !== null){
            const ref = procedureObjectRefs.current.get(selectedAccordionKey)
            if (ref && ref.current) {
                ref.current.handleClose()
            }
        }

        // check if the selected Accordion is already open
        const isAlreadyOpen = selectedAccordionKey === eventKey
    
        // update state with selected Accordion key
        setSelectedAccordionKey(isAlreadyOpen ? null : eventKey)
    }

    // Sector: Evaluate ProcedureMap: End --------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------



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
        if (procedureType === ProcedureTypes.Questionnaire) {
            addToQuestionnaireUpdateList(newId)
            if (currentSystem !== NO_QUESTIONNAIRE_SYSTEM) {
                empty_content.system = currentSystem
            }
        }

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
                        className={`${styles[ProcedureTypes[t].btnclass]}`}
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
        const createBlock = (procedureObject, index, isChild = false) => {
            if(!procedureObject) return

            // Create reference to element
            let ref = React.createRef()
            procedureObjectRefs.current.set(procedureObject.id, ref)

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
                                    <DragHandleComponent className={disabled ? styles.dragHandleBlockNotAllowed : styles.dragHandleBlock}>
                                        <div className={styles.heading}>
                                            {procedureObject.type.label}
                                        </div>
                                    </DragHandleComponent>
                                    {!disabled &&
                                        <Button
                                            className={styles.deleteButtonBlock}
                                            onClick={() => deleteProcedureObject(procedureObject.id)}
                                            variant="danger"
                                            size="sm"
                                        >
                                            <Trash3 />
                                        </Button>
                                    }
                                </div>
                                {blockProcedureChildren}
                            </div>
                            
                            <OverlayTrigger
                                    placement="top"
                                    overlay={
                                        <Tooltip id={"tooltip-top"}>
                                            Counterbalance
                                        </Tooltip>
                                    }
                                >
                                    <Form.Check
                                        className={styles.checkBox}
                                        type="checkbox"
                                        checked={procedureObject.counterbalance}
                                        onChange={(event) => changeCounterbalance(event, procedureObject.id)}
                                        disabled={disabled}
                                    />
                            </OverlayTrigger>
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
                            updateOnCreate={updateOnCreate}
                            disabled={disabled}
                        // reloaded={/^[a-zA-Z]/.test(((procedureObject.id).toString()).charAt(0))} // check if reloaded element
                        />
                        {true && !isChild &&
                            <OverlayTrigger
                                placement="top"
                                overlay={
                                    <Tooltip id={"tooltip-top"}>
                                        Counterbalance
                                    </Tooltip>
                                }
                            >
                                <Form.Check
                                    className={styles.checkBox}
                                    type="checkbox"
                                    checked={procedureObject.counterbalance}
                                    onChange={(event) => changeCounterbalance(event, procedureObject.id)}
                                    disabled={disabled}
                                />
                            </OverlayTrigger>
                        }
                    </div>
                </Item>
            )
        }

        return topLevelProcedureObjects.map((procedureObject, index) => createBlock(procedureObject, index))
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
                    return
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
            // update backend if dragged block is stored
            if (procedureObject.stored) updateProcedureBackend(getPlannedProcedure(newMap))
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

            if (isGroup) {
                ///console.log(procedureObject, procedureConfig)
                let childrenContent = []
                if(procedureObject.children.length > 0) {
                    // get all children content
                    for (let childId of procedureObject.children) {
                        const childProcedureObject = procedureObjectMapState.get(childId)
                        if(childProcedureObject){
                            let showString = childProcedureObject.type.label
                            switch (childProcedureObject.type.key) {
                                case ProcedureTypes.TextPage.key:
                                case ProcedureTypes.Pause.key:
                                    if(childProcedureObject.content.title.length !== 0) showString = childProcedureObject.content.title + ` - ${showString}`
                                    break
                                case ProcedureTypes.Condition.key:
                                    if(childProcedureObject.content.name.length !== 0) showString = childProcedureObject.content.name + ` - ${showString}`
                                break
                            }
                            childrenContent.push(
                                <div key={childId} className={styles.procedureElementInBlockGhost}>
                                    {showString}
                                </div>
                            )
                        }
                    }
                }
                return (
                    <div className={classnames(styles.block, styles.ghost)}>
                        <div className={styles.heading}>
                            {procedureObject.type.label}
                        </div>
                        {childrenContent.length > 0 ? childrenContent : null}
                    </div>
                )
            }
            
            let showString = procedureObject.type.label
            switch (procedureObject.type.key) {
                case ProcedureTypes.TextPage.key:
                case ProcedureTypes.Pause.key:
                    if(procedureObject.content.title.length !== 0) showString = procedureObject.content.title + ` - ${showString}`
                    break
                case ProcedureTypes.Condition.key:
                    if(procedureObject.content.name.length !== 0) showString = procedureObject.content.name + ` - ${showString}`
                    break
            }
            return (
                <div className={classnames(styles.procedureElement, styles.ghost)}>
                    {showString}
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

    
    
    
    // ---------------------------------------------------------------------------------------------------------------
    // Sector: Handle leave CreateProcedure Page: Start --------------------------------------------------------------

    const navigateForward = async () => {
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "current_setup_step": "procedure"
            }
        }))
        await dispatch(getStudySetupInfo(study_id))
        setEmptyOrderListener(false)
        if (studySetupInfo.state === "setup") {
            navigate("/create/" + study_id + "/integrations")
        } else {
            navigate("/edit/" + study_id + "/integrations")
        }
    }

    // Navigate currently deactivated
    const handleProceed = async (event) => {
        event.preventDefault()
        // save in Backend
        dispatch(studySlice.actions.resetProcedureOverview())
        const plannedOrder = getPlannedProcedure(procedureObjectMapState)
        await updateProcedureBackend(plannedOrder)
        // if not stored steps is not empty
        if (getNotStoredSteps().length > 0) {
            setShowModal(true)
        } else {
            if (plannedOrder.length === 0) {
                setEmptyOrder(true)
            } else {
                await navigateForward()
            }
        } 
    }

    // Sector: Handle leave CreateProcedure Page: End --------------------------------------------------------------
    // -------------------------------------------------------------------------------------------------------------

    
    return (
        <>
            <StudyCreationLayout step={CreationSteps.Procedure}>
                <Container>

                    <Row className='mt-3'>
                        <ProcedureAlert message={message} />
                        {disabled ? (
                            <p style={{ color: 'red' }}>*You can only change the content in the existing order</p>
                        ) : (
                            procedureStepButtons()
                        )}
                    </Row>


                    <Row className='mt-3'>
                        <Container>
                            <Card>
                                <Card.Header>Procedure Order</Card.Header>
                                <Card.Body>
                                    <div className={styles.ProcedureOrder}>
                                        <List
                                            className={styles.wrapper}
                                            renderDropLine={renderDropLineElement}
                                            renderGhost={renderGhostElement}
                                            renderStackedGroup={renderStackedGroupElement}
                                            onDragEnd={onDragEnd}
                                            onDragStart={onDragStart}
                                            isDisabled={disabled}
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
                        </Container>
                    </Row>

                    <Row className='mt-3'>
                        <Col> <Button onClick={handleProceed}>Save and Continue</Button> </Col>
                    </Row>

                </Container>
            </StudyCreationLayout>

            <Modal show={emptyOrder}>
                <Modal.Header>
                    <Modal.Title> Cannot proceed! </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You need at least one Procedure-Object in the procedure order
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={() => setEmptyOrder(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showQuestionnaireModal}>
                <Modal.Header>
                    <Modal.Title> Questionnaire System Mismatch </Modal.Title>
                </Modal.Header>
                {questionnaireModalBody()}
            </Modal>

            <Modal show={showModal}>
                <Modal.Header>
                    <Modal.Title> Still proceed? </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You have not saved procedure objects
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="success" onClick={async () => await navigateForward()}>
                        Proceed
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}