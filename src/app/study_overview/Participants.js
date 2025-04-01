import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Table, Pagination, Button, Dropdown, ButtonGroup, Modal } from "react-bootstrap";
import { ArrowUp, ArrowDown, ArrowRight, PencilSquare, ToggleOn, ToggleOff, Display } from "react-bootstrap-icons";

import {
    studySlice,
    getParticipants,
    selectParticipants,
} from "../../redux/reducers/studySlice";

import LoadingScreen from "../../components/LoadingScreen";

import "../SidebarAndReactStyles.scss";

const ProcedureType = {
    text: "title",
    condition: "name",
    questionnaire: "system",
    pause: "title",
}

export default function Participants() {
    const { study_id } = useParams()

    const dispatch = useDispatch()
    const participants = useSelector(selectParticipants)

    const navigate = useNavigate()

    const [activePage, setActivePage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortColumn, setSortColumn] = useState('id')
    const [sortDirection, setSortDirection] = useState('asc')
    // modalstates
    const modalStates = {
        NEXT: 0,
        PAUSE: 1,
        CORRECT: 2,
    }
    const [showModal, setShowModal] = useState(modalStates.CORRECT)
    const [selectedParticipantToken, setSelectedParticipantToken] = useState(null)
    const [selectedParticipantId, setSelectedParticipantId] = useState(null)

    useEffect(() => {
        dispatch(getParticipants(study_id))
        return () => {
            dispatch(studySlice.actions.resetParticipants())
        }
    }, [])

    if (participants === null) {
        return (
            <LoadingScreen />
        )
    }

    const sortData = (data) => {
        return [...data].sort((a, b) => {
            const aValue = a[sortColumn] || ''
            const bValue = b[sortColumn] || ''
            if (sortDirection === 'asc') {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
            } else {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
            }
        })
    }

    const paginateData = (data, page, perPage) => {
        const startIndex = (page - 1) * perPage
        const endIndex = startIndex + perPage
        return data.slice(startIndex, endIndex)
    }

    const handleSort = (col) => {
        if (sortColumn === col) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(col)
            setSortDirection('asc')
        }
    }

    const handleNextStep = (id, token) => {
        setSelectedParticipantToken(token)
        setSelectedParticipantId(id)
        setShowModal(modalStates.NEXT)
    }

    const handlePause = (id, token) => {
        setSelectedParticipantToken(token)
        setSelectedParticipantId(id)
        setShowModal(modalStates.PAUSE)
    }

    const handleCurrentProcedure = (participant) => {
        if (participant.current_procedure_step !== null) {
            for (const key in participant.procedure_step) {
                if (Object.keys(ProcedureType).includes(key)) {
                    if (participant.procedure_step[key] !== null) {
                        return participant.procedure_step["order"] + 1 + " - " + key + " - " + ProcedureType[key] + ": " + participant.procedure_step[key][ProcedureType[key]]
                    }
                }
            }
        }
        return "No step available"
    }

    const isPauseActive = (participant) => {
        if (participant.current_procedure_step !== null && participant.procedure_step !== null) {
            if (participant.procedure_step["pause"] !== null) {
                console.log(participant.procedure_step["pause"])
                return false
            }
        }
        return true
    }

    const returnModal = () => {
        if (showModal !== modalStates.CORRECT) {
            let title = ''
            let id = ''
            let token = ''
            let buttonText = ''
            let buttonType = ''
            if (showModal === modalStates.NEXT) {
                title = 'Push participant to next procedure Step?'
                id = 'Participant ID: ' + selectedParticipantId
                token = 'Participant Token: ' + selectedParticipantToken
                buttonText = 'Next Step'
                buttonType = 'danger'
            } else if (showModal === modalStates.PAUSE) {
                title = 'End Pause of participant?'
                id = 'Participant ID: ' + selectedParticipantId
                token = 'Participant Token: ' + selectedParticipantToken
                buttonText = 'End Pause'
                buttonType = 'warning'
            }

            return (
                <Modal show={true} onHide={() => setShowModal(modalStates.CORRECT)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{id}</Modal.Body>
                    <Modal.Body>{token}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setShowModal(modalStates.CORRECT)
                        }}>Close</Button>
                        <Button variant={buttonType} onClick={() => {
                            setShowModal(modalStates.CORRECT)
                            if (showModal === modalStates.NEXT) {
                                // TODO
                            } else if (showModal === modalStates.PAUSE) {
                                // TODO
                            }
                        }}>{buttonText}</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    }

    const sortedData = sortData(participants)
    const paginatedData = paginateData(sortedData, activePage, itemsPerPage)

    return (
        <>
            <div xs={10} id="page-content-wrapper" style={{ padding: "10px" }}>

                <h3 className="headline">Participants Overview</h3>

                <div className="mb-3 dropdown-table d-flex justify-content-start">
                    <Dropdown as={ButtonGroup}>
                        <Dropdown.Toggle variant="secondary">
                            Items per page: {itemsPerPage}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {[10, 25, 50].map((size) => (
                                <Dropdown.Item
                                    key={size}
                                    onClick={() => {
                                        setItemsPerPage(size)
                                        setActivePage(1)
                                    }}
                                >
                                    {size}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {['id', 'state', 'current_procedure_step'].map((col, colIndex) => (
                                <th
                                    key={`col-${colIndex}`}
                                    onClick={() => handleSort(col)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {col.replace(/_/g, ' ').charAt(0).toUpperCase() + col.replace(/_/g, ' ').slice(1)}
                                    {' '}
                                    {sortColumn === col ? (
                                        sortDirection === 'asc' ? <ArrowUp color="blue" /> : <ArrowDown color="blue" />
                                    ) : (
                                        <ArrowUp color="grey" />
                                    )}
                                </th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((participants) => (
                            <tr key={participants.id}>
                                <td>{participants.id}</td>
                                <td>{participants.state}</td>
                                <td>{handleCurrentProcedure(participants)}</td>
                                <td className="action-gap">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        disabled={participants.state !== 'in_progress'}
                                        onClick={() => handleNextStep(participants.id, participants.token)}
                                        className="mr-2"
                                    >
                                        <ArrowRight /> Next Step
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        disabled={isPauseActive(participants)}
                                        onClick={() => handlePause(participants.id, participants.token)}
                                        className="mr-2"
                                    >
                                        <PencilSquare /> End Pause
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <div className="d-flex justify-content-center mt-3">
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => setActivePage(prevPage => Math.max(prevPage - 1, 1))}
                            disabled={activePage === 1}
                        />
                        {[...Array(Math.ceil(participants.length / itemsPerPage))].map((_, pageIndex) => (
                            <Pagination.Item
                                key={pageIndex}
                                active={pageIndex + 1 === activePage}
                                onClick={() => setActivePage(pageIndex + 1)}
                            >
                                {pageIndex + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setActivePage(prevPage => Math.min(prevPage + 1, Math.ceil(participants.length / itemsPerPage)))}
                            disabled={activePage === Math.ceil(participants.length / itemsPerPage)}
                        />
                    </Pagination>
                </div>
            </div>

            {returnModal()}
        </>
    )
}

