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
} from "../../redux/reducers/studySlice";


// TODO Maybe refactor layout so that the use is similar to the CreateStudyLayout
export default function StudyOverviewLayout() {

    const editEnum = {
        Closed: 0,
        Running: 1,
        NotOpen: 2,
    }

    const { study_id, page } = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [deleteModal, setDeleteModal] = useState(false)
    const [exportModal, setExportModal] = useState(false)
    const [editState, setEditState] = useState(-1)

    const study = useSelector(selectStudy)
    const studySetupInfo = useSelector(selectStudySetupInfo)
    const procedureConfigOverview = useSelector(selectStudyProcedureOverview)

    useEffect(() => {
        dispatch(getStudy(study_id))
        dispatch(getStudySetupInfo(study_id))
        dispatch(getProcedureConfig(study_id)).then((response) => {
            if (response.payload.body.id) {
                dispatch(getProcedureConfigOverview(response.payload.body.id))
            }
        })
        return () => {
            dispatch(studySlice.actions.resetStudySetupInfo())
            dispatch(studySlice.actions.resetProcedureOverview())
        }
    }, [])

    useEffect(() => {
        if (study) {
            if (study.is_active) {
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

    if (study == null || studySetupInfo == null || procedureConfigOverview == null) {
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

    const handleDuplicate = (event) => {
        event.preventDefault()
        console.log("[Duplicate] Not implemented yet")
        //TODO Duplicate
    }

    const handleExport = (event, type) => {
        event.preventDefault()
        // gather study
        const updatedStudy = { 
            ...study,
            planned_number_participants: studySetupInfo.planned_number_participants
        }
        const studyExport = {
            study: updatedStudy,
            procedure_config_steps: procedureConfigOverview.procedure_config_steps
        }
        
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
        setExportModal(false)

        // Create a blob and trigger download
        const blob = new Blob([data], { type: mimeType })
        saveAs(blob, fileName)
    }

    const handleDelete = async (event) => {
        event.preventDefault()
        await dispatch(deleteStudy(study_id))
        navigate("/")
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
                                <Dropdown.Item onClick={() => setExportModal(true)}>Export Study</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item onClick={() => setDeleteModal(true)} style={{color: "red"}}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                {getContent(page)}
            </SidebarLayout>

            <Modal show={exportModal}>
                <Modal.Header>
                    <Modal.Title> Export Study </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Decide export format for "{study.name}"!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={(event) => handleExport(event, 0)}>
                        JSON
                    </Button>
                    <Button variant="success" onClick={(event) => handleExport(event, 1)}>
                        YAML
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={deleteModal}>
                <Modal.Header>
                    <Modal.Title> Delete Study </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the study "{study.name}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}