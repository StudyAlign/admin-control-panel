import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { ArrowRight, PencilSquare } from "react-bootstrap-icons";

import PaginatedSortableTable from "../../components/PaginatedSortableTable";
import LoadingScreen from "../../components/LoadingScreen";
import {
    studySlice,
    getParticipants,
    selectParticipants,
    selectApiStatus,
    //
    pushParticipantNextStep,
    endParticipantPause
} from "../../redux/reducers/studySlice";
import { LOADING } from "../../redux/apiStates";

import "../SidebarAndReactStyles.scss";

const ProcedureType = {
    text: "title",
    condition: "name",
    questionnaire: "system",
    pause: "title",
};

export default function Participants() {
    const { study_id } = useParams();
    const dispatch = useDispatch();

    const participantsData = useSelector(selectParticipants);
    const loadingStatus = useSelector(selectApiStatus);
    const loading = loadingStatus === LOADING;

    // modalstates
    const modalStates = {
        NEXT: 0,
        PAUSE: 1,
        CORRECT: 2,
    };
    const [showModal, setShowModal] = useState(modalStates.CORRECT);
    const [selectedParticipantToken, setSelectedParticipantToken] = useState(null);
    const [selectedParticipantId, setSelectedParticipantId] = useState(null);
    //
    const [refreshTableFlag, setRefreshTableFlag] = useState(false);

    // inital values
    const initialItemsPerPage = 10;
    const initialSortColumn = "id";
    const initialSortDirection = "asc";

    useEffect(() => {
        dispatch(getParticipants({
            studyId: study_id,
            offset: 0,
            limit: initialItemsPerPage,
            orderBy: initialSortColumn,
            direction: initialSortDirection
        }));
        return () => {
            dispatch(studySlice.actions.resetParticipants());
        };
    }, [dispatch, study_id]);

    const handleCurrentProcedure = (participant) => {
        if (participant.current_procedure_step !== null) {
            for (const key in participant.procedure_step) {
                if (Object.keys(ProcedureType).includes(key)) {
                    if (participant.procedure_step[key] !== null) {
                        return (
                            participant.procedure_step["order"] +
                            1 +
                            " - " +
                            key +
                            " - " +
                            ProcedureType[key] +
                            ": " +
                            participant.procedure_step[key][ProcedureType[key]]
                        );
                    }
                }
            }
        }
        return "No step available";
    };

    const isPauseActive = (participant) => {
        if (participant.current_procedure_step !== null && participant.procedure_step !== null) {
            if (participant.procedure_step["pause"] !== null) {
                return false;
            }
        }
        return true;
    };

    const handleNextStep = (id, token) => {
        setSelectedParticipantToken(token);
        setSelectedParticipantId(id);
        setShowModal(modalStates.NEXT);
    };

    const handlePause = (id, token) => {
        setSelectedParticipantToken(token);
        setSelectedParticipantId(id);
        setShowModal(modalStates.PAUSE);
    };

    // fetchData-Callback for PaginatedSortableTable
    const fetchData = useCallback(
        ({ offset, limit, orderBy, direction }) => {
            dispatch(getParticipants({ studyId: study_id, offset, limit, orderBy, direction }));
        },
        [dispatch, study_id]
    );

    const columns = [
        {
            key: "id",
            label: "ID",
        },
        {
            key: "state",
            label: "State",
        },
        {
            key: "current_procedure_step",
            label: "Current Procedure",
            render: (_, row) => handleCurrentProcedure(row),
        },
        {
            key: "actions",
            label: "Actions",
            render: (_, row) => (
                <div className="action-gap">
                    <Button
                        variant="danger"
                        size="sm"
                        disabled={row.state !== "in_progress"}
                        onClick={() => handleNextStep(row.id, row.token)}
                        className="mr-2"
                    >
                        <ArrowRight /> Next Step
                    </Button>
                    <Button
                        variant="warning"
                        size="sm"
                        disabled={isPauseActive(row)}
                        onClick={() => handlePause(row.id, row.token)}
                        className="mr-2"
                    >
                        <PencilSquare /> End Pause
                    </Button>
                </div>
            ),
        },
    ];

    if (!participantsData || !participantsData.items) {
        return <LoadingScreen />;
    }

    const returnModal = () => {
        if (showModal !== modalStates.CORRECT) {
            let title = "";
            let idText = "";
            // let tokenText = "";
            let buttonText = "";
            let buttonVariant = "";
            if (showModal === modalStates.NEXT) {
                title = "Push participant to next procedure Step?";
                idText = "Your about to push Participant " + selectedParticipantId + " to the next step.";
                // tokenText = "Participant Token: " + selectedParticipantToken;
                buttonText = "Next Step";
                buttonVariant = "danger";
            } else if (showModal === modalStates.PAUSE) {
                title = "End Pause of participant?";
                idText = "Your about to end the pause of participant " + selectedParticipantId + ".";
                // tokenText = "Participant Token: " + selectedParticipantToken;
                buttonText = "End Pause";
                buttonVariant = "warning";
            }

            return (
                <Modal show={true} onHide={() => setShowModal(modalStates.CORRECT)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{idText}</Modal.Body>
                    {/* <Modal.Body>{tokenText}</Modal.Body> */}
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(modalStates.CORRECT)}>
                            Close
                        </Button>
                        <Button
                            variant={buttonVariant}
                            onClick={() => {
                                // check if modalState is NEXT or PAUSE
                                if (showModal === modalStates.NEXT) {
                                    dispatch(pushParticipantNextStep(selectedParticipantToken))
                                        .then(() => {
                                            setRefreshTableFlag((prev) => !prev);
                                        });
                                } else if (showModal === modalStates.PAUSE) {
                                    dispatch(endParticipantPause(selectedParticipantToken))
                                        .then(() => {
                                            setRefreshTableFlag((prev) => !prev);
                                        });
                                }
                                setShowModal(modalStates.CORRECT);
                            }}
                        >
                            {buttonText}
                        </Button>
                    </Modal.Footer>
                </Modal>
            );
        }
        return null;
    };

    return (
        <>
            <div xs={10} id="participant-content-wrapper" className="flex-column" style={{ padding: "10px" }}>
                <h3 className="headline">Participants Overview</h3>
                <PaginatedSortableTable
                    columns={columns}
                    fetchData={fetchData}
                    data={participantsData.items}
                    totalCount={participantsData.count}
                    loading={loading}
                    initialItemsPerPage={initialItemsPerPage}
                    initialSortColumn={initialSortColumn}
                    initialSortDirection={initialSortDirection}
                    loadingText={"Loading Participant Data ..."}
                    excludeSortingColumns={["actions"]} // column "actions" is not sortable
                    refreshFlag={refreshTableFlag}
                />
            </div>
            {returnModal()}
        </>
    );
}