import React, { useState, useEffect } from "react";
import { Button, Tabs, Tab, Pagination, Dropdown } from "react-bootstrap";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUp, ArrowDown } from "react-bootstrap-icons";

import {
    getFirst100GenericInteractions,
    selectGenericInteraction
} from "../../redux/reducers/interactionSlice";

import "./StudyOverview.css"
import "../SidebarAndReactStyles.css";

export default function InteractionData() {
    const { study_id } = useParams()

    const dispatch = useDispatch()
    const interactionData = useSelector(selectGenericInteraction)

    useEffect(() => {
        dispatch(getFirst100GenericInteractions(study_id))
    }, [])

    const [activePage, setActivePage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortColumn, setSortColumn] = useState('id')
    const [sortDirection, setSortDirection] = useState('asc')

    if (interactionData == null) {
        return <h1>No data available</h1>
    } else {

        // copy interactionData to new const
        const interactionDataCopy = [...interactionData]
        // some test data
        const data = [
            { id: 1, name: 'alice', age: 23 },
            { id: 2, name: 'bob', age: 25 },
            { id: 3, name: 'charlie', age: 27 },
            { id: 4, name: 'david', age: 29 },
            { id: 5, name: 'eve', age: 31 },
            { id: 6, name: 'frank', age: 33},
            { id: 7, name: 'george', age: 35 },
            { id: 8, name: 'harry', age: 37 },
            { id: 9, name: 'ian', age: 39 },
            { id: 10, name: 'jane', age: 41 },
            { id: 11, name: 'kate', age: 43 },
            { uuid: '1', interactions: 100, correct: 90, incorrect: 10 },
            { uuid: '2', interactions: 200, correct: 180, incorrect: 20 },
            { uuid: '3', interactions: 300, correct: 270, incorrect: 30 },
            { uuid: '4', interactions: 400, correct: 360, incorrect: 40 },
            { uuid: '5', interactions: 500, correct: 450, incorrect: 50 },
            { uuid: '6', interactions: 600, correct: 540, incorrect: 60 },
            { uuid: '7', interactions: 700, correct: 630, incorrect: 70 },
            { uuid: '8', interactions: 800, correct: 720, incorrect: 80 },
            { uuid: '9', interactions: 900, correct: 810, incorrect: 90 },
            { uuid: '10', interactions: 1000, correct: 900, incorrect: 100 },
            { uuid: '11', interactions: 1100, correct: 990, incorrect: 110 },
            { id: 31, event: 'click', target: 'button', time: '2021-01-01T00:00:00Z' },
            { id: 2, event: 'hover', target: 'div', time: '2021-01-01T00:01:00Z' },
            { id: 3, event: 'scroll', target: 'window', time: '2021-01-01T00:02:00Z'},
            { id: 4, event: 'click', target: 'button', time: '2021-01-01T00:03:00Z' },
            { id: 52, event: 'hover', target: 'div', time: '2021-01-01T00:04:00Z' },
            { id: 6, event: 'scroll', target: 'window', time: '2021-01-01T00:05:00Z'},
            { id: 7, event: 'click', target: 'button', time: '2021-01-01T00:06:00Z' },
            { id: 18, event: 'hover', target: 'div', time: '2021-01-01T00:07:00Z' },
            { id: 9, event: 'scroll', target: 'window', time: '2021-01-01T00:08:00Z'},
            { id: 104, event: 'click', target: 'button', time: '2021-01-01T00:09:00Z' },
            { id: 11, event: 'hover', target: 'div', time: '2021-01-01T00:10:00Z'}
        ]
        // append every object to interactionDataCopy
        data.forEach((obj) => {
            interactionDataCopy.push(obj)
        })

        const interactionDataList = []

        const getKeySignature = (obj) => Object.keys(obj).sort().join(",")
        const groups = {}

        interactionDataCopy.forEach((obj) => {
            const keySignature = getKeySignature(obj)

            if (groups[keySignature]) {
                groups[keySignature].push(obj)
            } else {
                groups[keySignature] = [obj]
            }
        })

        for (const key in groups) {
            interactionDataList.push(
                groups[key].sort((a, b) => {
                    const aValue = a[sortColumn] || ''
                    const bValue = b[sortColumn] || ''

                    if (sortDirection === 'asc') {
                        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
                    } else {
                        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
                    }
                })
            )
        }

        const paginateData = (data, page, perPage) => {
            const startIndex = (page - 1) * perPage
            const endIndex = startIndex + perPage
            return data.slice(startIndex, endIndex)
        }

        const handleExportData = () => {
            alert('Exporting data...')
        }

        const handleSort = (col) => {
            if (sortColumn === col) {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
            } else {
                setSortColumn(col)
                setSortDirection('asc')
            }
        }

        return (
            <div>
                <div className="mb-3">
                    <Button variant="primary" onClick={handleExportData}>
                        Export Data
                    </Button>
                </div>

                <Tabs defaultActiveKey={0} id="data-tabs">
                    {interactionDataList.map((group, index) => {
                        const columns = Object.keys(group[0])
                        const paginatedGroup = paginateData(group, activePage, itemsPerPage)

                        return (
                            <Tab eventKey={index} title={`Page ${index + 1}`} key={index}>
                                <div className="mb-3 dropdown">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary">
                                            Items per page: {itemsPerPage}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            {[10, 25, 50, 100].map((size) => (
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

                                <table className="table table-striped table-bordered table-sm outer-table">
                                    <thead>
                                        <tr>
                                            {columns.map((col, colIndex) => (
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedGroup.map((row, rowIndex) => (
                                            <tr key={`row-${rowIndex}`}>
                                                {columns.map((col, colIndex) => (
                                                    <td key={`row-${rowIndex}-col-${colIndex}`}>
                                                        {typeof row[col] === 'object' && row[col] !== null
                                                            ? (
                                                                <table className="table table-sm table-bordered inner-table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="font-weight-bold">Key</th>
                                                                            <th className="font-weight-bold">Value</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {Object.entries(row[col]).map(([key, value], entryIndex) => (
                                                                            <tr key={`object-${rowIndex}-${entryIndex}`}>
                                                                                <td className="font-weight-bold">{key}</td>
                                                                                <td>{value !== undefined ? value : ''}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            )
                                                            : row[col] !== undefined
                                                                ? row[col]
                                                                : ''}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="d-flex justify-content-center mt-3">
                                    <Pagination>
                                        <Pagination.Prev
                                            onClick={() => setActivePage(prevPage => Math.max(prevPage - 1, 1))}
                                            disabled={activePage === 1}
                                        />
                                        {[...Array(Math.ceil(group.length / itemsPerPage))].map((_, pageIndex) => (
                                            <Pagination.Item
                                                key={pageIndex}
                                                active={pageIndex + 1 === activePage}
                                                onClick={() => setActivePage(pageIndex + 1)}
                                            >
                                                {pageIndex + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next
                                            onClick={() => setActivePage(prevPage => Math.min(prevPage + 1, Math.ceil(group.length / itemsPerPage)))}
                                            disabled={activePage === Math.ceil(group.length / itemsPerPage)}
                                        />
                                    </Pagination>
                                </div>
                            </Tab>
                        )
                    })}
                </Tabs>
            </div>
        )
    }
}
