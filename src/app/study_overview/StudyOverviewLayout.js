import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Dropdown, Modal, Row } from "react-bootstrap";
import { ThreeDots } from "react-bootstrap-icons";

import { saveAs } from "file-saver";
import * as yaml from "js-yaml";

import Topbar from "../../components/Topbar";
import SidebarLayout from "./SidebarLayout";
import Overview from "./Overview";
import Procedure from "./Procedure";
import InteractionData from "./InteractionData";
import LoadingScreen from "../../components/LoadingScreen";

import {
    interactionSlice,
    // getFirst100GenericInteractions,
} from "../../redux/reducers/interactionSlice";

import {
    studySlice,
    deleteStudy,
    getProcedureConfig,
    getStudy,
    getStudySetupInfo,
    selectStudy,
    selectStudySetupInfo,
    updateStudy,
    selectStudyProcedureOverview,
    getProcedureConfigOverview,
    exportStudySchema,
    selectStudyExport,
    duplicateStudy,
} from "../../redux/reducers/studySlice";

export const STATES = {
    SETUP: "setup",
    RUNNING: "running",
    FINISHED: "finished"
}

// TODO Maybe refactor layout so that the use is similar to the CreateStudyLayout
export default function StudyOverviewLayout() {

    const editEnum = {
        Closed: 0,
        Running: 1,
        NotOpen: 2,
    }

    const modalStates = {
        DELETE: 0,
        EXPORT: 1,
        CORRECT: 2,
    }

    const { study_id, page } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [showModal, setShowModal] = useState(modalStates.CORRECT)
    const [copyButtonText, setCopyButtonText] = useState('COPY TO CLIPBOARD');
    const [editState, setEditState] = useState(-1)

    const study = useSelector(selectStudy)
    const studyExport = useSelector(selectStudyExport)

    useEffect(() => {
        dispatch(getStudy(study_id))
        dispatch(exportStudySchema(study_id))
        // Interaction Data
        // dispatch(getFirst100GenericInteractions(study_id))
        return () => {
            dispatch(studySlice.actions.resetStudyExport())
            dispatch(studySlice.actions.resetStudySetupInfo())
            dispatch(studySlice.actions.resetProcedureOverview())
            // Interaction Data
            dispatch(interactionSlice.actions.resetAllInteractions())
        }
    }, [])

    useEffect(() => {
        if (study) {
            if (study.state === STATES.RUNNING) {
                setEditState(editEnum.Running)
            } else {
                setEditState(editEnum.Closed)
                // Compare Date
                if(new Date(study.startDate.split('T')[0]) > new Date()) {
                    setEditState(editEnum.NotOpen)
                }
            }
        }
    }, [study])

    if(study === null) {
        return (
            <>
                <Topbar/>
                <h2> ERROR 404 - Study not found </h2>
            </>
        )
    }

    if (study == null || studyExport == null) {
        return (
            <>
                <Topbar/>
                <LoadingScreen/>
            </>
        )
    }



    const getContent = (page) => {
        let content
        if(page === 'overview') {
            content = <Overview study={study}/>
        }
        else if(page === 'procedure') {
            content = <Procedure/>
        }
        else if(page === 'data') {
            content = <InteractionData/>
        }
        else {
            content = "Error - Page not found"
        }
        return content
    }

    const handleEdit = async (event) => {
        event.preventDefault()
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "current_setup_step": "study"
            }
        }))
        await dispatch(getStudySetupInfo(study_id))
        // choose edit path
        if(editState === editEnum.Running) {
            navigate("/edit/" + study_id + "/information")
        } else if (editState === editEnum.NotOpen) {
            navigate("/create/" + study_id + "/information")
        }
    }

    const handleDuplicate = async (event) => {
        event.preventDefault()
        
        await dispatch(duplicateStudy(study_id)).then((newStudy) => {
            navigate("/create/" + newStudy.payload.body.id + "/information")
        })
    }

    const handleCopyToClipboard = (event) => {
        event.preventDefault()
        navigator.clipboard.writeText(JSON.stringify(studyExport, null, 2)).then(() => {
            setCopyButtonText('COPIED!');
            setTimeout(() => {
                setCopyButtonText('COPY TO CLIPBOARD');
            }, 2000);
        }).catch(err => {
            console.error('Copy To Clipboard Error', err);
            setCopyButtonText('ERROR!');
            setTimeout(() => {
                setCopyButtonText('COPY TO CLIPBOARD');
            }, 2000);
        });
    }


    const handleExport = (event, type) => {
        event.preventDefault()
        
        // Export
        let data
        let fileName
        let mimeType

        if (type === 0) { // JSON
            data = JSON.stringify(studyExport, null, 2)
            fileName = "study_export_" + study.name + ".json"
            mimeType = "application/json"
        } else if (type === 1) { // YAML
            data = yaml.dump(studyExport)
            fileName = "study_export_" + study.name + ".yaml"
            mimeType = "application/x-yaml"
        }

        // close modal
        setShowModal(modalStates.CORRECT)

        // Create a blob and trigger download
        const blob = new Blob([data], { type: mimeType })
        saveAs(blob, fileName)
    }

    const handleDelete = async (event) => {
        event.preventDefault()
        await dispatch(deleteStudy(study_id))
        navigate("/")
    }

    const returnModal = () => {
        if (showModal !== modalStates.CORRECT) {
            let title = null
            let body = null
            let footer = null

            if (showModal === modalStates.DELETE) {
                title = "Delete Study"
                body = (
                    <Modal.Body>
                        Are you sure you want to delete study: "{study.name}"!
                    </Modal.Body>
                )
                footer = (
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(modalStates.CORRECT)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                )
            } else if (showModal === modalStates.EXPORT) {
                title = "Export Study"
                body = (
                    <Modal.Body>
                        Export study: "{study.name}"!
                        <textarea
                            value={JSON.stringify(studyExport, null, 2)}
                            readOnly
                            style={{width: '100%', height: '300px', marginTop: '10px'}}
                        />
                    </Modal.Body>
                )
                footer = (
                    <Modal.Footer>
                        <Button variant="primary" onClick={(event) => handleCopyToClipboard(event)}>
                            {copyButtonText}
                        </Button>
                        <Button variant="success" onClick={(event) => handleExport(event, 0)}>
                            DOWNLOAD
                        </Button>
                    </Modal.Footer>
                )
            }

            if (title === null || body === null || footer === null) return

            return (
                <Modal show={true} onHide={() => setShowModal(modalStates.CORRECT)}>
                    <Modal.Header>
                        <Modal.Title> {title} </Modal.Title>
                    </Modal.Header>
                    {body}
                    {footer}
                </Modal>
            )
        }
    }

    return (
        <>
            <Topbar/>
            <SidebarLayout>
                <Row>
                    <Col>
                        <h1 className="study-title"> {study.name} <label className="study-id">(#{study_id})</label> </h1>
                    </Col>
                    <Col xs="auto">
                        <Dropdown className="mt-4">
                            <Dropdown.Toggle variant="link" bsPrefix="p-0" style={{color:'#494949'}}>
                                <ThreeDots size="28"/>
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {editState === editEnum.Running || editState === editEnum.NotOpen ? (
                                    <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
                                ) : null}
                                <Dropdown.Item onClick={handleDuplicate}>Duplicate</Dropdown.Item>
                                <Dropdown.Item onClick={() => setShowModal(modalStates.EXPORT)}>Export Study</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item onClick={() => setShowModal(modalStates.DELETE)} style={{color: "red"}}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                {getContent(page)}
            </SidebarLayout>

            {returnModal()}
        </>
    )
}