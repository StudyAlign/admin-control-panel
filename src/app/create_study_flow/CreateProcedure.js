import React, {useEffect, useState, useMemo, useCallback} from "react";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import {useNavigate, useParams} from "react-router";
import {Button, Card, Col, Container, ListGroup, Row, Accordion} from "react-bootstrap";
// import {DragDropContext, Droppable} from "react-beautiful-dnd";
import ProcedureObject, {ProcedureTypes} from "./ProcedureObject";
import {useDispatch, useSelector} from "react-redux";
import {getTexts, selectTexts} from "../../redux/reducers/textSlice";
import {getConditions, selectConditions} from "../../redux/reducers/conditionSlice";
import {getQuestionnaires, selectQuestionnaires} from "../../redux/reducers/questionnaireSlice";
import {getPauses, selectPauses} from "../../redux/reducers/pauseSlice";
import {getStudySetupInfo, selectStudySetupInfo, updateStudy} from "../../redux/reducers/studySlice";
import ProcedureAlert from "./ProcedureAlert";

// new nested logic -----------------------------------------
import { DragHandleComponent, List, Item } from "react-sortful";
import arrayMove from "array-move";
import classnames from "classnames";
import styles from "./CreateProcedure.module.css";
import { Trash3 } from "react-bootstrap-icons";
// import NestedVertical from './NestedVertical.js'

// Root ID
const rootItemId = 'root'

// Initial list map
const initialItemEntitiesMap = new Map([
    [
        rootItemId,
        { id: rootItemId, children: [] },
    ],
])

// Render DropLine
const renderDropLineElement = (injectedProps) => (
    <div
        ref={injectedProps.ref}
        className={styles.dropLine}
        style={injectedProps.style}
    />
)

// new nested logic -----------------------------------------


export default function CreateProcedure() {

    // nested state
    const [itemEntitiesMapState, setItemEntitiesMapState] = useState(initialItemEntitiesMap)

    // old logic -----------------------------------------
    const dispatch = useDispatch()
    const { study_id } = useParams()
    const navigate = useNavigate()

    const [notStoredSteps, setNotStoredSteps] = useState([])
    const [idCounter, setIdCounter] = useState(0)
    const [message, setMessage] = useState({
        type: "none", // "success"/"danger"/"warning"/"info"
        text: "..."
    })

    const texts = useSelector(selectTexts)
    const conditions = useSelector(selectConditions)
    const pauses = useSelector(selectPauses)
    const questions = useSelector(selectQuestionnaires)
    const studySetupInfo = useSelector(selectStudySetupInfo)

    useEffect(  () => {
        dispatch(getTexts(study_id))
        dispatch(getConditions(study_id))
        dispatch(getQuestionnaires(study_id))
        dispatch(getPauses(study_id))
        dispatch(getStudySetupInfo(study_id))
    }, [])

    let procedure = []
    if (texts != null && questions != null && pauses != null && conditions != null) {
        let texts_c = [...texts]
        let conditions_c = [...conditions]
        let pauses_c = [...pauses]
        let questions_c = [...questions]

        if (studySetupInfo.planned_procedure != null) {
            for (let step of studySetupInfo.planned_procedure) {
                if (step["text_id"] != null) {
                    let idx = texts_c.findIndex(obj => {
                        return obj.id === step["text_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "t" + step["text_id"].toString(),
                            type: ProcedureTypes.TextPage,
                            content: texts_c[idx],
                            stored: true
                        })
                        texts_c.splice(idx, 1)
                    }
                }
                else if (step["condition_id"] != null) {
                    let idx = conditions_c.findIndex(obj => {
                        return obj.id === step["condition_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "c" + step["condition_id"].toString(),
                            type: ProcedureTypes.Condition,
                            content: conditions_c[idx],
                            stored: true
                        })
                        conditions_c.splice(idx, 1)
                    }
                }
                else if (step["questionnaire_id"] != null) {
                    let idx = questions_c.findIndex(obj => {
                        return obj.id === step["questionnaire_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "q" + step["questionnaire_id"].toString(),
                            type: ProcedureTypes.Questionnaire,
                            content: questions_c[idx],
                            stored: true
                        })
                        questions_c.splice(idx, 1)
                    }
                }
                else if (step["pause_id"] != null) {
                    let idx = pauses_c.findIndex(obj => {
                        return obj.id === step["pause_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "p" + step["pause_id"].toString(),
                            type: ProcedureTypes.Pause,
                            content: pauses_c[idx],
                            stored: true
                        })
                        pauses_c.splice(idx, 1)
                    }
                }
            }
        }

        for (let text of texts_c) {
            procedure.push({id: "t" + text.id.toString(), type: ProcedureTypes.TextPage, content: text, stored: true})
        }
        for (let cond of conditions_c) {
            procedure.push({id: "c" + cond.id.toString(), type: ProcedureTypes.Condition, content: cond, stored: true})
        }
        for (let quest of questions_c) {
            procedure.push({id: "q" + quest.id.toString(), type: ProcedureTypes.Questionnaire, content: quest, stored: true})
        }
        for (let pause of pauses_c) {
            procedure.push({id: "p" + pause.id.toString(), type: ProcedureTypes.Pause, content: pause, stored: true})
        }

        procedure.push(...notStoredSteps)
    }

    const getPlannedProcedure = () => {
        let planned_procedure = []
        for (const step of procedure) {
            if (step.stored) {
                let obj = {}
                obj[step.type.key + "_id"] = step.content.id
                planned_procedure.push(obj)
            }
        }
        return planned_procedure
    }

    // old logic -----------------------------------------

    // new nested logic -----------------------------------------

    // Delete ProcedureObject + nested children
    const deleteItem = (itemId) => {
        const newMap = new Map(itemEntitiesMapState)

        // recursive delete dependent children
        const deleteRecursively = (id) => {
            const item = newMap.get(id)
            if (item) {
                if (item.children) {
                    item.children.forEach(childId => deleteRecursively(childId))
                }
                newMap.delete(id)
            }
        }
        deleteRecursively(itemId)

        // delete child from superior element
        for (let [key, value] of newMap) {
            if (value.children && value.children.includes(itemId)) {
                value.children = value.children.filter(id => id !== itemId)
            }
        }

        setItemEntitiesMapState(newMap)
    }

    // ProcedureObject List
    const itemElements = useMemo(() => {

        // Get top level procudure objects
        const topLevelItems = itemEntitiesMapState
            .get(rootItemId)
            .children.map((itemId) => itemEntitiesMapState.get(itemId))

        // recursive create procedure objects
        const createItemElement = (item, index) => {
            if (item.children !== undefined) {
                const childItems = item.children.map((itemId) =>
                    itemEntitiesMapState.get(itemId)
                )
                const childItemElements = childItems.map(createItemElement)

                return (
                    <Item
                        key={item.id}
                        identifier={item.id}
                        index={index}
                        isGroup
                        isUsedCustomDragHandlers
                    >
                        <div className={styles.group}>
                            <div className={styles.groupHeader}>
                                <DragHandleComponent className={styles.dragHandleBlock}>
                                    <div className={styles.heading}>
                                        {item.type.label}
                                    </div>
                                </DragHandleComponent>
                                <Button
                                    className={styles.deleteButton}
                                    onClick={() => deleteItem(item.id)}
                                    variant="danger"
                                    size="sm"                                    
                                >
                                    <Trash3 />
                                </Button>
                            </div>
                            {childItemElements}
                        </div>
                    </Item>

                )
            }

            return (
                <Item
                    key={item.id}
                    identifier={item.id}
                    index={index}
                    isUsedCustomDragHandlers
                >
                    <ProcedureObject
                        id={item.id}
                        content={item.content}
                        type={item.type}
                        stored={item.stored}
                        deleteItem={deleteItem}
                    />
                </Item>
            )
        }

        return topLevelItems.map(createItemElement)
    }, [itemEntitiesMapState])

    // render preview of dragged element
    const renderGhostElement = useCallback(
        ({ identifier, isGroup }) => {
            const item = itemEntitiesMapState.get(identifier)
            if (item === undefined) return

            // TODO maybe change div content
            if (isGroup) {
                return (
                    <div className={classnames(styles.group, styles.ghost)}>
                        <div className={styles.heading}>
                            {item.type.label}
                        </div>
                    </div>
                )
            }

            return (
                <div className={classnames(styles.item, styles.ghost)}>
                    {item.type.label + " - " + item.id}
                </div>
            )
        },
        [itemEntitiesMapState]
    )

    // render preview for block element while dragging
    const renderStackedGroupElement = useCallback(
        (injectedProps, { identifier }) => {
            const item = itemEntitiesMapState.get(identifier)

            return (
                <div
                    className={classnames(styles.group, styles.stacked)}
                    style={injectedProps.style}
                >
                    <div className={styles.heading}>{item.type.label}</div>
                </div>
            )
        },
        [itemEntitiesMapState]
    )

    // new nested logic -----------------------------------------

    // updated nested logic -----------------------------------------
    const onDragEnd = useCallback(
        (meta) => {

            // Prevent group items from being moved to other group items
            const targetGroupItem = itemEntitiesMapState.get(meta.nextGroupIdentifier ?? rootItemId)
            if (targetGroupItem && targetGroupItem.children !== undefined && targetGroupItem.id !== rootItemId) {
                const draggedItem = itemEntitiesMapState.get(meta.identifier)
                if (draggedItem && draggedItem.children !== undefined) {
                    console.error('Gruppenelemente können nicht in andere Gruppenelemente verschoben werden.')
                    return;
                }
            }

            // Check whether the element was moved to the same position within the same group
            if (meta.groupIdentifier === meta.nextGroupIdentifier && meta.index === meta.nextIndex) return

            // Element does not exist
            const newMap = new Map(itemEntitiesMapState.entries())
            const item = newMap.get(meta.identifier)
            if (item === undefined) return

            // Group does not exist
            const groupItem = newMap.get(meta.groupIdentifier ?? rootItemId)
            if (groupItem === undefined) return
            if (groupItem.children === undefined) return

            // Move element within the same group
            if (meta.groupIdentifier === meta.nextGroupIdentifier) {
                const nextIndex = meta.nextIndex ?? groupItem.children?.length ?? 0
                groupItem.children = arrayMove(
                    groupItem.children,
                    meta.index,
                    nextIndex
                )
            } else {
                // Move item to another group
                const nextGroupItem = newMap.get(meta.nextGroupIdentifier ?? rootItemId)
                if (nextGroupItem === undefined) return
                if (nextGroupItem.children === undefined) return

                groupItem.children.splice(meta.index, 1)
                if (meta.nextIndex === undefined) {
                    // Adds element to group without elements
                    nextGroupItem.children.push(meta.identifier)
                } else {
                    // Adds element to group of elements
                    nextGroupItem.children.splice(meta.nextIndex, 0, item.id)
                }
            }

            setItemEntitiesMapState(newMap)

            console.log(itemEntitiesMapState)
        },
        [itemEntitiesMapState]
    )

    const createProcedureStep = (event, procedureType) => {
        event.preventDefault()
        // let empty_content = procedureType.emptyContent
        // empty_content.study_id = study_id
        // let n_steps = [...notStoredSteps]
        // let step = {
        //     id: "x" + idCounter,
        //     type: procedureType,
        //     content: empty_content,
        //     stored: false,
        // }

        // React Button event => disable, bcause buggy
        const button = event.target
        button.disabled = true

        // Procedure ID depends on current time
        const newId = Date.now()

        let initChildren = procedureType === ProcedureTypes.BlockElement ? [] : undefined
        const newItem = {
            id: newId,
            title: procedureType.label + " - " + newId,
            type: procedureType,
            content: procedureType.emptyContent,
            stored: false,
            children: initChildren
        }

        // Add to list
        const newMap = new Map(itemEntitiesMapState)
        newMap.set(newId, newItem)
        const rootItem = newMap.get(rootItemId)
        rootItem.children.push(newId)
        setItemEntitiesMapState(newMap)

        // Activate button again
        setTimeout(() => {
            button.disabled = false
        }, 300)

        // setIdCounter(idCounter+1)
        // n_steps.push(step)
        // setNotStoredSteps(n_steps)
    }

    // updated nested logic -----------------------------------------

    // old logic -----------------------------------------
    const removeFromNotStored = async (id) => {
        let idx = notStoredSteps.findIndex(obj => {
            return obj.id === id
        })

        if (idx > -1) {
            let nss = [...notStoredSteps]
            nss.splice(idx, 1)
            setNotStoredSteps(nss)
        }
    }
    // old logic -----------------------------------------

    // updated nested logic -----------------------------------------

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

    // updated nested logic -----------------------------------------

    // old logic -----------------------------------------
    const handleProceed = async (event) => {
        event.preventDefault()
        let planned_procedure = getPlannedProcedure()
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "planned_procedure": planned_procedure,
                "current_setup_step": "procedure"
            }
        }))
        await dispatch(getStudySetupInfo(study_id))
        navigate("/create/"+study_id+"/integrations")
    }
    // old logic -----------------------------------------

    return (
        <StudyCreationLayout step={CreationSteps.Procedure}>
            <Container>

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
                                >
                                    <Accordion defaultActiveKey="0" flush>
                                        {itemElements}
                                    </Accordion>
                                </List>
                            </div>
                        </Card.Body>
                    </Card>
                </Row>

            </Container>
        </StudyCreationLayout>
    )
    
    // old return statement
    // return (
    //     <StudyCreationLayout step={CreationSteps.Procedure}>

    //         <Container>
    //             <Row className='mt-3'>
    //                 <ProcedureAlert message={message}/>
    //             </Row>

    //             <Row className='mt-3'>
    //                 { procedureStepButtons() }
    //             </Row>

    //             <Row className='mt-3'>
    //                 <Col>
    //                 <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
    //                     <Card>
    //                         <Card.Header> Procedure Order </Card.Header>
    //                         <Card.Body>

    //                             <Accordion>
    //                             <Droppable droppableId={"procedure-0"}>
    //                                 {provided => (
    //                                     <div ref={provided.innerRef} {...provided.droppableProps}>
    //                                         <ListGroup>
    //                                             {
    //                                                 procedure.map((ps, index) => (
    //                                                 <ProcedureObject key={ps.id}
    //                                                                  id={ps.id}
    //                                                                  //
    //                                                                  elemCounter={ps.elemCounter}
    //                                                                  index={index}
    //                                                                  content={ps.content}
    //                                                                  type={ps.type}
    //                                                                  stored={ps.stored}
    //                                                                  setMessage={setMessage}
    //                                                                  removeFromNotStored={removeFromNotStored}
    //                                                 />
    //                                             ))
    //                                             }
    //                                         </ListGroup>
    //                                         {provided.placeholder}
    //                                     </div>
    //                                 )}
    //                             </Droppable>
    //                             </Accordion>

    //                         </Card.Body>
    //                     </Card>
    //                 </DragDropContext>
    //                 </Col>
    //             </Row>

    //             <Row className='mt-3'>
    //                 <Col> <Button size="lg" onClick={handleProceed}>Save and Proceed</Button> </Col>
    //             </Row>
    //         </Container>

    //     </StudyCreationLayout>
    // )
}