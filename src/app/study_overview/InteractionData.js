import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Tabs, Tab, Modal, Table } from "react-bootstrap";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "../../components/LoadingScreen";
import { LOADING } from "../../redux/apiStates";

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
    getInteractionExport,
    selectExportInteraction,
    selectStatus,
} from "../../redux/reducers/interactionSlice";

import PaginatedSortableTable from "../../components/PaginatedSortableTable";

import "./StudyOverview.css";
import "../SidebarAndReactStyles.scss";

// Helper component to render nested object values as a table.
const NestedTable = ({ data }) => {
    return (
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    <th className="font-weight-bold">Key</th>
                    <th className="font-weight-bold">Value</th>
                </tr>
            </thead>
            <tbody>
                {Object.entries(data).map(([key, value], idx) => (
                    <tr key={idx}>
                        <td className="font-weight-bold">{key}</td>
                        <td className="nested-value-td">{value !== undefined ? JSON.stringify(value) : ""}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default function InteractionData() {
    const { study_id } = useParams();
    const dispatch = useDispatch();

    // Export-related state
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [autoTriggered, setAutoTriggered] = useState(false);

    // Always mount all tabs initially so that the API calls are triggered.
    // activeTab will later be adjusted based on available data.
    const [activeTab, setActiveTab] = useState("generic");

    // Global API status from Redux (LOADING, etc.)
    const apiStatus = useSelector(selectStatus);

    // Interaction data from Redux.
    // The initial state is { items: null, count: null }.
    // After the API call, if no data is available, it becomes { items: null, count: 0 }.
    const genericData = useSelector(selectGenericInteraction);
    const dragData = useSelector(selectDragInteraction);
    const keyboardData = useSelector(selectKeyboardInteraction);
    const mouseData = useSelector(selectMouseInteraction);
    const touchData = useSelector(selectTouchInteraction);

    // Export data from Redux.
    const exportData = useSelector(selectExportInteraction);

    const triggerSaveBlob = useCallback(() => {
        const blob = exportData.data;
        if (blob) {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `interaction_export_${study_id}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    }, [exportData.data, study_id]);

    // Trigger automatic export download when ready.
    useEffect(() => {
        if (
            exportModalOpen &&
            exportData.status !== LOADING &&
            exportData.data &&
            !autoTriggered
        ) {
            triggerSaveBlob();
            setAutoTriggered(true);
        }
    }, [exportModalOpen, exportData.status, exportData.data, autoTriggered, triggerSaveBlob]);

    // Map each interaction type to its Redux data.
    const interactionDataMap = useMemo(() => ({
        generic: genericData,
        drag: dragData,
        keyboard: keyboardData,
        mouse: mouseData,
        touch: touchData,
    }), [genericData, dragData, keyboardData, mouseData, touchData]);
    // Compute the tabs to display.
    // While any tab is still loading (count === null), return all keys so that
    // each PaginatedSortableTable mounts and triggers its API call.
    // Once all API calls are complete (none have count === null),
    // only include keys where count > 0.
    const computedAvailableTabs = useMemo(() => {
        const keys = Object.keys(interactionDataMap);
        const anyLoading = keys.some((key) => {
            const data = interactionDataMap[key];
            return data && data.count === null;
        });
        return anyLoading
            ? keys
            : keys.filter((key) => interactionDataMap[key] && interactionDataMap[key].count > 0);
    }, [interactionDataMap]);

    // Adjust activeTab if it is no longer in the list.
    useEffect(() => {
        if (computedAvailableTabs.length > 0 && !computedAvailableTabs.includes(activeTab)) {
            setActiveTab(computedAvailableTabs[0]);
        }
    }, [computedAvailableTabs, activeTab]);

    // Mapping of interaction types to their dispatch functions.
    const dispatchFunctions = useMemo(() => ({
        generic: getGenericInteractions,
        drag: getDragInteractions,
        keyboard: getKeyboardInteractions,
        mouse: getMouseInteractions,
        touch: getTouchInteractions,
    }), []);

    // Create stable fetch callbacks for each interaction type.
    const fetchCallbacks = useMemo(() => {
        return {
            generic: (params) =>
                dispatch(dispatchFunctions.generic({ studyId: study_id, ...params })),
            drag: (params) =>
                dispatch(dispatchFunctions.drag({ studyId: study_id, ...params })),
            keyboard: (params) =>
                dispatch(dispatchFunctions.keyboard({ studyId: study_id, ...params })),
            mouse: (params) =>
                dispatch(dispatchFunctions.mouse({ studyId: study_id, ...params })),
            touch: (params) =>
                dispatch(dispatchFunctions.touch({ studyId: study_id, ...params })),
        };
    }, [dispatch, study_id, dispatchFunctions]);

    // Export handlers.
    const handleExportData = () => {
        setExportModalOpen(true);
        setAutoTriggered(false);
        dispatch(getInteractionExport({ studyId: study_id }));
    };


    // If API calls have completed for all tabs (none are loading)
    // and no tab has any data, show an alert.
    const allLoaded = useMemo(() => {
        return Object.keys(interactionDataMap).every(
            (key) => interactionDataMap[key] && interactionDataMap[key].count !== null
        );
    }, [interactionDataMap]);

    const noDataAvailable = allLoaded && Object.keys(interactionDataMap).every(
        (key) => interactionDataMap[key].count === 0
    );

    return (
        <div>
            <div className="mb-3">
                <Button variant="primary" onClick={handleExportData}>
                    Export Data
                </Button>
            </div>

            {noDataAvailable ? (
                <div className="alert alert-info">
                    No data available for this study.
                </div>
            ) : (
                <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} id="data-tabs" className="mb-3">
                    {computedAvailableTabs.map((tabKey, index) => {
                        const tabData = interactionDataMap[tabKey];
                        // Build column definitions dynamically from the first row of data if available.
                        const columns =
                            tabData.items &&
                                Array.isArray(tabData.items) &&
                                tabData.items.length > 0
                                ? Object.keys(tabData.items[0]).map((col) => ({
                                    key: col,
                                    label: col.charAt(0).toUpperCase() + col.slice(1),
                                    render: (value) =>
                                        typeof value === "object" && value !== null ? (
                                            <NestedTable data={value} />
                                        ) : value !== undefined ? (
                                            value
                                        ) : (
                                            ""
                                        ),
                                }))
                                : [];
                        // Use the stable fetch callback.
                        const fetchData = fetchCallbacks[tabKey];
                        return (
                            <Tab
                                eventKey={tabKey}
                                title={tabKey.charAt(0).toUpperCase() + tabKey.slice(1)}
                                key={index}
                            >
                                <PaginatedSortableTable
                                    columns={columns}
                                    fetchData={fetchData}
                                    data={tabData.items ?? []}
                                    totalCount={tabData.count ?? 0}
                                    loading={apiStatus === LOADING}
                                    initialItemsPerPage={50}
                                    initialSortColumn="id"
                                    initialSortDirection="asc"
                                    loadingText={"Loading Interaction Data (" + tabKey + ") ..."}
                                />
                            </Tab>
                        );
                    })}
                </Tabs>
            )}

            <Modal show={exportModalOpen} onHide={() => setExportModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Export Data</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ minHeight: "100px" }}>
                    {exportData.status === LOADING ? (
                        <LoadingScreen text={"Creating Export File..."} />
                    ) : (
                        <p>
                            Export is ready. The file has been prepared for download. Click "Export" to manually save the file if the automatic save dialog did not open.
                        </p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setExportModalOpen(false)}>
                        Cancel
                    </Button>
                    {exportData.status !== LOADING && (
                        <Button variant="primary" onClick={triggerSaveBlob}>
                            Export
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
}
