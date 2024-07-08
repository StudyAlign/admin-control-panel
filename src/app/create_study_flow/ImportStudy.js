import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { Upload } from "react-bootstrap-icons";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import * as yaml from "js-yaml";

import {
    createStudy,
    importStudySchema,
    selectStudy
} from "../../redux/reducers/studySlice";

import { useAuth } from "../../components/Auth";
import LoadingScreen from "../../components/LoadingScreen";
import Topbar from "../../components/Topbar";

import { ProcedureTypes } from "./ProcedureObject";


export default function ImportStudy() {

    const modalStates = {
        WRONG: 0,
        MISSING: 1,
        TOMANY: 2,
        PARSING: 3,
        CORRECT: 4
    }

    const dispatch = useDispatch()
    const auth = useAuth()
    const location = useLocation()

    const [text, setText] = useState('')
    const [parsedData, setParsedData] = useState(null)
    const [showModal, setShowModal] = useState(modalStates.CORRECT)
    const [apiErrorText, setApiErrorText] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [isDraggingOverTextArea, setIsDraggingOverTextArea] = useState(false)
    const [created, setCreated] = useState(false)

    const dragCounter = useRef(0)

    const study = useSelector(selectStudy)

    useEffect(() => {
        const handleDragOver = (e) => {
            e.preventDefault()
        }

        const handleDragEnter = (e) => {
            e.preventDefault()
            dragCounter.current++
            setIsDragging(true)
        }

        const handleDragLeave = (e) => {
            e.preventDefault()
            dragCounter.current--
            if (dragCounter.current === 0) {
                setIsDragging(false)
                setIsDraggingOverTextArea(false)
            }
        }

        document.addEventListener('dragover', handleDragOver)
        document.addEventListener('dragenter', handleDragEnter)
        document.addEventListener('dragleave', handleDragLeave)

        return () => {
            document.removeEventListener('dragover', handleDragOver)
            document.removeEventListener('dragenter', handleDragEnter)
            document.removeEventListener('dragleave', handleDragLeave)
        }
    }, [])

    useEffect(() => {
        if (apiErrorText.length > 0) {
            setShowModal(modalStates.MISSING)
        }
    }, [apiErrorText])

    const handleTextChange = (e) => {
        setText(e.target.value)
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        readFile(file)
    }

    const handleDragOverTextArea = (e) => {
        e.preventDefault()
        setIsDraggingOverTextArea(true)
    }

    const handleDragLeaveTextArea = () => {
        setIsDraggingOverTextArea(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        setIsDraggingOverTextArea(false)
        dragCounter.current = 0
        const files = e.dataTransfer.files
        if (files.length !== 1) {
            setShowModal(modalStates.TOMANY)
            return
        }
        const file = files[0]
        readFile(file)
    }

    const readFile = (file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            const fileContent = event.target.result
            if (isValidJsonOrYaml(fileContent)) {
                parseContent(fileContent)
            } else {
                setShowModal(modalStates.WRONG)
            }
        }
        reader.readAsText(file)
    }

    const isValidJsonOrYaml = (content) => {
        try {
            JSON.parse(content)
            return true
        } catch (jsonError) {
            try {
                yaml.load(content)
                return true
            } catch (yamlError) {
                return false
            }
        }
    }

    const parseContent = (content) => {
        try {
            const data = content.trim().startsWith('{') ? JSON.parse(content) : yaml.load(content)
            setParsedData(data)
            console.log(data)
            setText(JSON.stringify(data, null, 2))
        } catch (error) {
            setShowModal(modalStates.PARSING)
        }
    }

    const handleRejectedCall = (response) => {
        const responseList = []
        if(response.detail) {
            response.detail.forEach(error => {
                if(error.loc) {
                    responseList.push(error.loc.join(' -> '))
                }
            })
        }
        setApiErrorText(responseList)
    }

    const handleCreate = async (event) => {
        event.preventDefault()

        let studySchema = ''
        try {
            studySchema = JSON.parse(text)
            // for each condition, check if it is a valid condition
            if(studySchema?.procedure_config?.procedure_config_steps){
                let mainIndex = 0
                studySchema.procedure_config.procedure_config_steps.forEach(step => {
                    console.log(step)
                    if(step?.condition) {
                        studySchema.procedure_config.procedure_config_steps[mainIndex].condition = JSON.parse(JSON.stringify(studySchema.procedure_config.procedure_config_steps[mainIndex].condition))
                    } else if(step?.block) {
                        let blockIndex = 0
                        step.block.procedure_config_steps.forEach(blockStep => {
                            if(blockStep?.condition) {
                                studySchema.procedure_config.procedure_config_steps[mainIndex].block.procedure_config_steps[blockIndex].condition = JSON.parse(JSON.stringify(studySchema.procedure_config.procedure_config_steps[mainIndex].block.procedure_config_steps[blockIndex].condition))
                            }
                            blockIndex++
                        })
                    }
                    mainIndex++
                })
            }
        } catch (error) {
            setShowModal(modalStates.PARSING)
            return
        }

        const response = await dispatch(importStudySchema(studySchema))
        if (response.payload.status === 200) {
            setCreated(true)
        } else {
            handleRejectedCall(response.payload.response)
        }
    }

    if (created) {
        if (study == null) {
            return <LoadingScreen/>
        }
        else {
            return <Navigate to={"/create/" + study.id + "/information"} replace state={{ from: location }}/>
        }
    }

    const returnModal = () => {
        if (showModal !== modalStates.CORRECT) {
            let title = ''
            let body = ''
            if (showModal === modalStates.WRONG) {
                title = 'Invalid file'
                body = 'The file you uploaded is not a valid JSON or YAML file.'
            } else if (showModal === modalStates.MISSING) {
                title = 'Missing data'
                body = (
                    <div>
                        <p>The file you uploaded does not contain the necessary data to create a study. The following fields are missing:</p>
                        <ul>
                            {apiErrorText.map((field, index) => (
                                <li key={index}>{field}</li>
                            ))}
                        </ul>
                    </div>
                )
            } else if (showModal === modalStates.TOMANY) {
                title = 'Too many files'
                body = 'Please upload only one file.'
            } else if (showModal === modalStates.PARSING) {
                title = 'Parsing error'
                body = 'There was an error while parsing the file.'
            }

            return (
                <Modal show={true} onHide={() => setShowModal(modalStates.CORRECT)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{body}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="warning" onClick={() => {
                            setShowModal(modalStates.CORRECT)
                            setApiErrorText([])
                        }}>Try Again</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    }

    return (
        <>
            <Topbar />
            <div style={{ position: 'relative', padding: '20px' }}>
                <h1 className="page-title"> Import Study </h1>
                {isDragging && !isDraggingOverTextArea && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', fontSize: '24px', color: '#aaa' }}>
                        Drop file here
                    </div>
                )}
                <textarea
                    value={text}
                    onChange={handleTextChange}
                    placeholder={isDragging ? "" : "Write/Drop Json/Yaml here"}
                    onDragOver={handleDragOverTextArea}
                    onDragLeave={handleDragLeaveTextArea}
                    onDrop={handleDrop}
                    style={{
                        width: '100%',
                        height: '500px',
                        border: isDraggingOverTextArea ? '2px solid #00f' : (isDragging ? '2px dashed #000' : '1px solid #ccc'),
                        borderRadius: '5px',
                        backgroundColor: isDraggingOverTextArea ? '#e0f7ff' : '#fff',
                    }}
                />
                {text === '' && !isDragging && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}>
                        <Upload />
                    </div>
                )}
                <input
                    type="file"
                    accept=".json,.yaml,.yml"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    id="fileUpload"
                />
                <Button onClick={() => document.getElementById('fileUpload').click()}>Upload</Button>
                <Button onClick={handleCreate} disabled={!text}>Create</Button>
            </div>

            {returnModal()}
        </>
    )
}