import React, { useState, useEffect, useMemo } from "react";
import { Table, Pagination, Dropdown, Form, InputGroup, Button } from "react-bootstrap";
import { ArrowUp, ArrowDown } from "react-bootstrap-icons";
import LoadingScreen from "./LoadingScreen";

const PaginatedSortableTable = ({
    columns,
    fetchData,
    data,
    totalCount,
    loading,
    initialItemsPerPage,
    initialSortColumn,
    initialSortDirection,
    loadingText = "Loading...",
    excludeSortingColumns = [],
    refreshFlag = false,
    filter = {},
}) => {
    const [activePage, setActivePage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);
    const [sortColumn, setSortColumn] = useState(initialSortColumn);
    const [sortDirection, setSortDirection] = useState(initialSortDirection);
    const [jumpPage, setJumpPage] = useState("");

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    useEffect(() => {
        const offset = (activePage - 1) * itemsPerPage;
        fetchData({
            offset,
            limit: itemsPerPage,
            orderBy: sortColumn,
            direction: sortDirection,
        });
    }, [activePage, itemsPerPage, sortColumn, sortDirection, fetchData, refreshFlag]);

    const handleSort = (colKey) => {
        if (sortColumn === colKey) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortColumn(colKey);
            setSortDirection("asc");
        }
        setActivePage(1); // go to page one after sorting
    };

    // Pagination: max 10 pages to show
    const getPaginationRange = (currentPage, totalPages, maxPagesToShow = 10) => {
        let startPage, endPage;
        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const half = Math.floor(maxPagesToShow / 2);
            if (currentPage <= half) {
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (currentPage + half >= totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - half;
                endPage = currentPage + half;
            }
        }
        return { startPage, endPage };
    };

    const { startPage, endPage } = getPaginationRange(activePage, totalPages);
    const paginationItems = [];
    for (let page = startPage; page <= endPage; page++) {
        paginationItems.push(
            <Pagination.Item
                key={page}
                active={page === activePage}
                onClick={() => setActivePage(page)}
            >
                {page}
            </Pagination.Item>
        );
    }

    const handleJumpPage = (e) => {
        e.preventDefault();
        const pageNum = parseInt(jumpPage, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            setActivePage(pageNum);
        }
        setJumpPage("");
    };

    const filteredData = useMemo(() => {
        if (!filter || Object.keys(filter).length === 0) return data;
        return data.filter((row) =>
            Object.entries(filter).every(
                ([key, blockList]) => !blockList.includes(row[key])
            )
        );
    }, [data, filter]);

    if (loading) {
        return (
            <div style={{ position: 'relative', minHeight: '200px' }}>
                <LoadingScreen text={loadingText} />
            </div>
        );
    }

    return (
        <>
            <div className="d-flex justify-content-between mb-3">
                <Dropdown>
                    <Dropdown.Toggle variant="primary">
                        Items per page: {itemsPerPage}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {[10, 25, 50].map((size) => (
                            <Dropdown.Item
                                key={size}
                                onClick={() => {
                                    setItemsPerPage(size);
                                    setActivePage(1);
                                }}
                            >
                                {size}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
                {totalPages > 10 && (
                    <Form onSubmit={handleJumpPage} className="d-flex align-items-center action-gap">
                        <Form.Label className="mb-0 mr-2">Jump to page:</Form.Label>
                        <InputGroup style={{ width: "160px" }}>
                            <Form.Control
                                type="number"
                                min="1"
                                max={totalPages}
                                value={jumpPage}
                                onChange={(e) => setJumpPage(e.target.value)}
                                placeholder={`1 - ${totalPages}`}
                            />
                            <Button type="submit" variant="primary" disabled={!jumpPage}>
                                Go
                            </Button>
                        </InputGroup>
                    </Form>
                )}
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {columns.map((col, idx) => {
                            if(excludeSortingColumns.includes(col.key)) {
                                return (
                                    <th key={idx}>
                                        {col.label}
                                    </th>
                                );
                            }
                            // else
                            return (
                                <th
                                    key={idx}
                                    onClick={() => handleSort(col.key)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {col.label}{" "}
                                    {sortColumn === col.key ? (
                                        sortDirection === "asc" ? (
                                            <ArrowUp color="blue" />
                                        ) : (
                                            <ArrowDown color="blue" />
                                        )
                                    ) : (
                                        <ArrowUp color="grey" />
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} style={{wordBreak: col.key === "event" ? "break-all" : "normal"}}>
                                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? ""}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-3">
                <Pagination>
                    <Pagination.Prev
                        onClick={() => setActivePage((prev) => Math.max(prev - 1, 1))}
                        disabled={activePage === 1}
                    />
                    {paginationItems}
                    <Pagination.Next
                        onClick={() =>
                            setActivePage((prev) => Math.min(prev + 1, totalPages))
                        }
                        disabled={activePage === totalPages}
                    />
                </Pagination>
            </div>
        </>
    );
};

export default PaginatedSortableTable;