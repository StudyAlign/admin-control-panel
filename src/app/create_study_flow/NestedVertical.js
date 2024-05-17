import { useState, useMemo, useCallback } from 'react'
import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap"
import { DragHandleComponent, List, Item } from 'react-sortful'
import arrayMove from 'array-move'
import classnames from 'classnames'
import styles from './CreateProcedure.module.css'
import SingleItem from './SingleItem'
import { ProcedureTypes } from "./SingleItem"
import { Trash3 } from 'react-bootstrap-icons'

// ID Wurzel
const rootItemId = 'root'

// Initiale list map
const initialItemEntitiesMap = new Map([
    [
        rootItemId,
        { id: rootItemId, children: [] },
    ],
])

// Rendern der DropLine
const renderDropLineElement = (injectedProps) => (
    <div
        ref={injectedProps.ref}
        className={styles.dropLine}
        style={injectedProps.style}
    />
)

export default function NestedVertical() {

    // Initiale Map als start State fuer alle Elemente
    const [itemEntitiesMapState, setItemEntitiesMapState] = useState(initialItemEntitiesMap)

    // Loeschen eines Items + evtl. Kinder
    const deleteItem = (itemId) => {
        const newMap = new Map(itemEntitiesMapState)

        // Rekursive zum loeschen untergeordneten Elemente
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

        // Entferne Item-ID aus children der uebergeordneten Elemente
        for (let [key, value] of newMap) {
            if (value.children && value.children.includes(itemId)) {
                value.children = value.children.filter(id => id !== itemId)
            }
        }

        setItemEntitiesMapState(newMap)
    }

    // Erstellen der Elemente
    const itemElements = useMemo(() => {

        // Top-Level-Elemente abrufen
        const topLevelItems = itemEntitiesMapState
            .get(rootItemId)
            .children.map((itemId) => itemEntitiesMapState.get(itemId))

        // Rekursives Erstellen der Elemente
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
                    <SingleItem
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

    // Rendert Vorschau fuer Procedures beim Drag & Drop
    const renderGhostElement = useCallback(
        ({ identifier, isGroup }) => {
            const item = itemEntitiesMapState.get(identifier)
            if (item === undefined) return

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

    // Render Vorschau fuer Gruppenelemente beim Drag & Drop
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

    // Drag & Drop Handler
    const onDragEnd = useCallback(
        (meta) => {

            // Verhindern, dass Gruppenelemente in andere Gruppenelemente verschoben werden
            const targetGroupItem = itemEntitiesMapState.get(meta.nextGroupIdentifier ?? rootItemId)
            if (targetGroupItem && targetGroupItem.children !== undefined && targetGroupItem.id !== rootItemId) {
                const draggedItem = itemEntitiesMapState.get(meta.identifier)
                if (draggedItem && draggedItem.children !== undefined) {
                    console.error('Gruppenelemente können nicht in andere Gruppenelemente verschoben werden.')
                    return;
                }
            }

            // Ueberpruefen, ob das Element innerhalb der gleichen Gruppe an die gleiche Position verschoben wurde
            if (meta.groupIdentifier === meta.nextGroupIdentifier && meta.index === meta.nextIndex) return

            // Element existiert nicht
            const newMap = new Map(itemEntitiesMapState.entries())
            const item = newMap.get(meta.identifier)
            if (item === undefined) return

            // Gruppe existiert nicht
            const groupItem = newMap.get(meta.groupIdentifier ?? rootItemId)
            if (groupItem === undefined) return
            if (groupItem.children === undefined) return

            // Element innerhalb der gleichen Gruppe verschieben
            if (meta.groupIdentifier === meta.nextGroupIdentifier) {
                const nextIndex = meta.nextIndex ?? groupItem.children?.length ?? 0
                groupItem.children = arrayMove(
                    groupItem.children,
                    meta.index,
                    nextIndex
                )
            } else {
                // Element in eine andere Gruppe verschieben
                const nextGroupItem = newMap.get(meta.nextGroupIdentifier ?? rootItemId)
                if (nextGroupItem === undefined) return
                if (nextGroupItem.children === undefined) return

                groupItem.children.splice(meta.index, 1)
                if (meta.nextIndex === undefined) {
                    // Fuegt Element zu Gruppe ohne Elemente hinzu
                    nextGroupItem.children.push(meta.identifier)
                } else {
                    // Fuegt Element zu Gruppe mit Elementen hinzu
                    nextGroupItem.children.splice(meta.nextIndex, 0, item.id)
                }
            }

            setItemEntitiesMapState(newMap)

            console.log(itemEntitiesMapState)
        },
        [itemEntitiesMapState]
    )
    
    // Procedure hinzufuegen
    const addProcedureToList = (event, procedureType) => {
        event.preventDefault()

        // React Button event, da buggy
        const button = event.target
        button.disabled = true

        // Procedure ID abhaengig von aktueller Zeit
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

        // In Liste einfuegen
        const newMap = new Map(itemEntitiesMapState)
        newMap.set(newId, newItem)
        const rootItem = newMap.get(rootItemId)
        rootItem.children.push(newId)
        setItemEntitiesMapState(newMap)

        // Button wieder aktivieren
        setTimeout(() => {
            button.disabled = false
        }, 300)
    }

    // Buttons fuer neue Elemente
    const procedureStepButtons = () => {
        let buttons = []
        for (let t in ProcedureTypes) {
            buttons.push(
                <Col xs={'auto'} key={ProcedureTypes[t].id}>
                    <Button
                        type="button"
                        style={{ backgroundColor: ProcedureTypes[t].color, borderColor: ProcedureTypes[t].color }}
                        onClick={(event) => addProcedureToList(event, ProcedureTypes[t])}> {ProcedureTypes[t].label} </Button>
                </Col>
            )
        }
        return buttons
    }

    return (
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
    )
}
