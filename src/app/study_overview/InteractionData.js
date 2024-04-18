import React from "react";
import { Button } from "react-bootstrap";
import { useParams } from "react-router";
import { useTable } from "react-table";
import "./StudyOverview.css"

export default function InteractionData() {
    const { study_id } = useParams()

    const data = React.useMemo(
        () => [
            {
                col1: '...',
                col2: '...',
                col3: '...',
            },
            {
                col1: '...',
                col2: '...',
                col3: '...',
            },
            {
                col1: '...',
                col2: '...',
                col3: '...',
            },
            {
                col1: '...',
                col2: '...',
                col3: '...',
            },
        ],
        []
    )

    const columns = React.useMemo(
        () => [
            {
                Header: 'Column 1',
                accessor: 'col1', // accessor is the "key" in the data
            },
            {
                Header: 'Column 2',
                accessor: 'col2',
            },
            {
                Header: 'Column 3',
                accessor: 'col3',
            },
        ],
        []
    )
    // TODO get information from backend

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data })


    return (
        <>
            <table {...getTableProps()} className="data-table">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()} className="data-table-header">
                                    {column.render('Header')}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()} className="data-table-content">
                                            {cell.render('Cell')}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            <Button type="button" className="big-button"> Export Data </Button>
        </>
    )
}