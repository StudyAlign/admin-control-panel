import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Pagination, Button, Dropdown, ButtonGroup } from "react-bootstrap";
import { ArrowUp, ArrowDown, Trash, PencilSquare } from "react-bootstrap-icons";

import {
    userSlice,
    getUsers,
    selectUsers,
} from "../../redux/reducers/userSlice";

import LoadingScreen from "../../components/LoadingScreen";
import Topbar from "../../components/Topbar";

import "../SidebarAndReactStyles.css";
import "./UserOverview.css";

export default function UserOverview() {
    const dispatch = useDispatch()
    const users = useSelector(selectUsers)

    const [activePage, setActivePage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortColumn, setSortColumn] = useState('id')
    const [sortDirection, setSortDirection] = useState('asc')

    useEffect(() => {
        dispatch(getUsers())
        return () => {
            dispatch(userSlice.actions.resetAllUsers())
        }
    }, [dispatch])

    if (users === null) {
        return (
            <>
                <Topbar />
                <LoadingScreen />
            </>
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

    const handleDelete = (id) => {
        console.log(`Delete action for user with ID: ${id}`)
    }

    const handleEdit = (id) => {
        console.log(`Edit action for user with ID: ${id}`)
    }

    const handleNewUser = () => {
        console.log('Create new user action')
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
                            {['id', 'firstname', 'lastname', 'role_id'].map((col, colIndex) => (
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
                                <td>{user.firstname}</td>
                                <td>{user.lastname}</td>
                                <td>{user.role_id}</td>
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
                                    >
                                        <PencilSquare /> Edit
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
        </>
    )
}
