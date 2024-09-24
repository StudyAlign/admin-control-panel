import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Table, Pagination, Button, Dropdown, ButtonGroup, Modal } from "react-bootstrap";
import { ArrowUp, ArrowDown, Trash, PencilSquare, ToggleOn, ToggleOff, Display } from "react-bootstrap-icons";

import {
    userSlice,
    getUsers,
    selectUsers,
    updateUser,
    deleteUser,
    getRoles,
    selectRoles
} from "../../redux/reducers/userSlice";

import LoadingScreen from "../../components/LoadingScreen";
import Topbar from "../../components/Topbar";

import "../SidebarAndReactStyles.css";
import "./UserOverview.css";

export default function UserOverview() {

    const dispatch = useDispatch()
    const users = useSelector(selectUsers)
    const roles = useSelector(selectRoles)

    const navigate = useNavigate()

    const [activePage, setActivePage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortColumn, setSortColumn] = useState('id')
    const [sortDirection, setSortDirection] = useState('asc')
    // modalstates
    const modalStates = {
        DELETE: 0,
        ACTIVATED: 1,
        DEACTIVATED: 2,
        CORRECT: 3
    }
    const [showModal, setShowModal] = useState(modalStates.CORRECT)
    const [selectedUser, setSelectedUser] = useState(null)

    useEffect(() => {
        dispatch(getUsers())
        dispatch(getRoles())
        return () => {
            dispatch(userSlice.actions.resetAllUsers())
        }
    }, [])

    if (users === null || roles === null) {
        return (
            <>
                <Topbar />
                <LoadingScreen />
            </>
        )
    }

    const roleNames = roles.reduce((acc, role) => {
        acc[role.id] = role.name
        return acc
    }, {})


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

    const handleDelete = (id) => {
        setSelectedUser(id)
        setShowModal(modalStates.DELETE)
    }

    const handleEdit = (id) => {
        dispatch(userSlice.actions.setUserProcess("edit/information"))
        navigate('/users/' + id + '/edit') 
    }

    const handleShow = (id) => {
        dispatch(userSlice.actions.setUserProcess("create"))
        navigate('/users/' + id + '/information') 
    }

    const handleNewUser = () => {
        navigate('/users/create')
    }

    const handleToggleActive = (id, isActive) => {
        setSelectedUser(id)
        const action = isActive ? setShowModal(modalStates.ACTIVATED) : setShowModal(modalStates.DEACTIVATED)
    }

    const returnModal = () => {
        if (showModal !== modalStates.CORRECT) {
            let title = ''
            let body = ''
            let buttonText = ''
            let buttonType = ''
            let active = true
            if (showModal === modalStates.DELETE) {
                title = 'Delete user ' + selectedUser + '?'
                body = 'Are you sure you want to delete user ' + selectedUser + '?'
                buttonText = 'Delete'
                buttonType = 'danger'
            } else if (showModal === modalStates.ACTIVATED) {
                title = 'Deactivate user ' + selectedUser + '?'
                body = 'Are you sure you want to deactivate user ' + selectedUser + '?'
                buttonText = 'Deactivate'
                buttonType = 'warning'
                active = false
            } else if (showModal === modalStates.DEACTIVATED) {
                title = 'Activate user ' + selectedUser + '?'
                body = 'Are you sure you want to activate user ' + selectedUser + '?'
                buttonText = 'Activate'
                buttonType = 'success'
            }

            return (
                <Modal show={true} onHide={() => setShowModal(modalStates.CORRECT)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{body}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {
                            setShowModal(modalStates.CORRECT)
                        }}>Close</Button>
                        <Button variant={buttonType} onClick={() => {
                            setShowModal(modalStates.CORRECT)
                            if (showModal === modalStates.DELETE) {
                                dispatch(deleteUser(selectedUser)).then(() => {
                                    dispatch(getUsers())
                                })
                            } else {
                                const user = { "user": { is_active: active }, "userId": selectedUser }
                                dispatch(updateUser(user)).then(() => {
                                    dispatch(getUsers())
                                })
                            }
                        }}>{buttonText}</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    }

    const sortedData = sortData(users)
    const paginatedData = paginateData(sortedData, activePage, itemsPerPage)

    return (
        <>
            <Topbar />
            <div xs={10} id="page-content-wrapper" style={{ padding: "10px" }}>

                <h1 className="page-title">Overview Users</h1>

                <div className="mb-3">
                    <Button variant="primary" onClick={handleNewUser}>
                        Create New User
                    </Button>
                </div>

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
                            {['id', 'name', 'role'].map((col, colIndex) => (
                                <th
                                    key={`col-${colIndex}`}
                                    onClick={() => handleSort(col)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {col.charAt(0).toUpperCase() + col.slice(1)}
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
                        {paginatedData.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{roleNames[user.role_id]}</td>
                                <td className="action-gap">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(user.id)}
                                        className="mr-2"
                                    >
                                        <Trash /> Delete
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        onClick={() => handleEdit(user.id)}
                                        className="mr-2"
                                    >
                                        <PencilSquare /> Edit
                                    </Button>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        onClick={() => handleShow(user.id)}
                                        className="mr-2"
                                    >
                                        <Display /> Show
                                    </Button>
                                    <Button
                                        variant={user.is_active ? "secondary" : "success"}
                                        size="sm"
                                        onClick={() => handleToggleActive(user.id, user.is_active)}
                                    >
                                        {user.is_active ? <ToggleOff /> : <ToggleOn />} {user.is_active ? "Deactivate" : "Activate"}
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
                        {[...Array(Math.ceil(users.length / itemsPerPage))].map((_, pageIndex) => (
                            <Pagination.Item
                                key={pageIndex}
                                active={pageIndex + 1 === activePage}
                                onClick={() => setActivePage(pageIndex + 1)}
                            >
                                {pageIndex + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => setActivePage(prevPage => Math.min(prevPage + 1, Math.ceil(users.length / itemsPerPage)))}
                            disabled={activePage === Math.ceil(users.length / itemsPerPage)}
                        />
                    </Pagination>
                </div>
            </div>

            {returnModal()}
        </>
    )
}
