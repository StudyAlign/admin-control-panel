import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Dropdown, Modal, Row } from "react-bootstrap";
import { ThreeDots } from "react-bootstrap-icons";

import Topbar from "../../components/Topbar";
import SidebarLayout from "./SidebarLayout";
import Overview from "./Overview";
import Procedure from "./Procedure";
import InteractionData from "./InteractionData";

import {
    studySlice,
    deleteStudy,
    getStudy,
    updateStudy,
    getStudySetupInfo,
    selectStudy
} from "../../redux/reducers/studySlice";


// TODO Maybe refactor layout so that the use is similar to the CreateStudyLayout
export default function StudyOverviewLayout() {
    const dispatch = useDispatch()
    const { study_id, page } = useParams()
    const navigate = useNavigate()
    const [deleteModal, setDeleteModal] = useState(false)

    const study = useSelector(selectStudy)
    useEffect(() => {
        dispatch(getStudy(study_id));
        return () => {
            dispatch(studySlice.actions.resetStudySetupInfo())
            dispatch(studySlice.actions.resetProcedureOverview())
        }
    }, [])

    if(study === null) {
        return (
            <>
                <Topbar/>
                <h2> ERROR 404 - Study not found </h2>
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
        navigate("/edit/" + study_id + "/information")
    }

    const handleDuplicate = (event) => {
        event.preventDefault()
        console.log("[Duplicate] Not implemented yet")
        //TODO Duplicate
    }

    const handleExport = (event) => {
        event.preventDefault()
        console.log("[Export] Not implemented yet")
        //TODO Export
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
                                <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
                                <Dropdown.Item onClick={handleDuplicate}>Duplicate</Dropdown.Item>
                                <Dropdown.Item onClick={handleExport}>Export</Dropdown.Item>
                                <Dropdown.Divider/>
                                <Dropdown.Item onClick={() => setDeleteModal(true)} style={{color: "red"}}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
                {getContent(page)}
            </SidebarLayout>

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