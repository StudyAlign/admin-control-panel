import React, { useState, useEffect } from "react";
import { Button, Tabs, Tab, Pagination, Dropdown } from "react-bootstrap";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUp, ArrowDown } from "react-bootstrap-icons";

import {
    getGenericInteractions,
    getDragInteractions,
    getKeyboardInteractions,
    getMouseInteractions,
    getTouchInteractions,
    selectGenericInteraction,
    selectDragInteraction,
    selectKeyboardInteraction,
    selectMouseInteraction,
    selectTouchInteraction,
} from "../../redux/reducers/interactionSlice";

import "./StudyOverview.css"
import "../SidebarAndReactStyles.css";

export default function InteractionData() {
    const { study_id } = useParams()

    const dispatch = useDispatch()
    const genericInteractionData = useSelector(selectGenericInteraction)
    const dragInteractionData = useSelector(selectDragInteraction)
    const keyboardInteractionData = useSelector(selectKeyboardInteraction)
    const mouseInteractionData = useSelector(selectMouseInteraction)
    const touchInteractionData = useSelector(selectTouchInteraction)

    useEffect(() => {
        dispatch(getGenericInteractions({
            studyId: study_id,
            offset: 0,
            limit: 100
        }))
        dispatch(getDragInteractions({
            studyId: study_id,
            offset: 0,
            limit: 100
        }))
        dispatch(getKeyboardInteractions({
            studyId: study_id,
            offset: 0,
            limit: 100
        }))
        dispatch(getMouseInteractions({
            studyId: study_id,
            offset: 0,
            limit: 100
        }))
        dispatch(getTouchInteractions({
            studyId: study_id,
            offset: 0,
            limit: 100
        }))
    }, [])

    const [activePage, setActivePage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortColumn, setSortColumn] = useState('id')
    const [sortDirection, setSortDirection] = useState('asc')

    const interactionDataObject = {
        generic: genericInteractionData,
        drag: dragInteractionData,
        keyboard: keyboardInteractionData,
        mouse: mouseInteractionData,
        touch: touchInteractionData
    }

    // // Group the data by key signature
    // const interactionDataList = []
    // const getKeySignature = (obj) => Object.keys(obj).sort().join(",")
    // const groups = {}
    // data.forEach((obj) => {
    //     const keySignature = getKeySignature(obj)
    //     if (groups[keySignature]) {
    //         groups[keySignature].push(obj)
    //     } else {
    //         groups[keySignature] = [obj]
    //     }
    // })

    // filter interaction logs
    const availableTabs = Object.keys(interactionDataObject).filter(key => interactionDataObject[key] != null)

    // if no logs return
    if (availableTabs.length === 0) {
        return <h1>No data available</h1>
    }

    const sortData = (data) => {
        const sortedData = [...data]
        return sortedData.sort((a, b) => {
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

    const handleExportData = () => {
        alert('Exporting data...')
    }

    return (
        <div>
            <div className="mb-3">
                <Button variant="primary" onClick={handleExportData}>
                    Export Data
                </Button>
            </div>

            <Tabs defaultActiveKey={availableTabs[0]} id="data-tabs">
                {availableTabs.map((key, index) => {
                    const data = sortData(interactionDataObject[key])
                    const columns = Object.keys(data[0])
                    const paginatedData = paginateData(data, activePage, itemsPerPage)

                    return (
                        <Tab eventKey={key} title={key.charAt(0).toUpperCase() + key.slice(1)} key={index}>
                            <div className="mb-3 dropdown-table">
                                <Dropdown>
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
                                    {paginatedData.map((row, rowIndex) => (
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
                                                                            <td>{value !== undefined ? JSON.stringify(value) : ''}</td>
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
                                    {[...Array(Math.ceil(data.length / itemsPerPage))].map((_, pageIndex) => (
                                        <Pagination.Item
                                            key={pageIndex}
                                            active={pageIndex + 1 === activePage}
                                            onClick={() => setActivePage(pageIndex + 1)}
                                        >
                                            {pageIndex + 1}
                                        </Pagination.Item>
                                    ))}
                                    <Pagination.Next
                                        onClick={() => setActivePage(prevPage => Math.min(prevPage + 1, Math.ceil(data.length / itemsPerPage)))}
                                        disabled={activePage === Math.ceil(data.length / itemsPerPage)}
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
