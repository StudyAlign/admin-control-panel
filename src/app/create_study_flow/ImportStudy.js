import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { Upload } from "react-bootstrap-icons";

import * as yaml from "js-yaml";

import Topbar from "../../components/Topbar";


const expectedStructure = {
    study: {
        name: '',
        startDate: '',
        endDate: '',
        is_active: false,
        owner_id: 1,
        invite_only: false,
        id: 0,
        description: '',
        consent: '',
        planned_number_participants: 0
    },
    procedure_config_steps: []
}


export default function ImportStudy() {

    const modalStates = {
        WRONG: 0,
        MISSING: 1,
        TOMANY: 2,
        PARSING: 3,
        CORRECT: 4
    }

    const [text, setText] = useState('')
    const [parsedData, setParsedData] = useState(null)
    const [showModal, setShowModal] = useState(modalStates.CORRECT)
    const [isDragging, setIsDragging] = useState(false)
    const [isDraggingOverTextArea, setIsDraggingOverTextArea] = useState(false)
    const [created, setCreated] = useState(false)
    
    const dragCounter = useRef(0)

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
            setText(JSON.stringify(data, null, 2))
            console.log(data)
        } catch (error) {
            setShowModal(modalStates.PARSING)
        }
    }

    const handleMissingData = (importJson) => {
        const missingData = []

        const checkMissing = (expected, actual, path) => {
            for (const key in expected) {
                if (expected.hasOwnProperty(key)) {
                    if (!actual.hasOwnProperty(key)) {
                        missingData.push([...path, key].join('.'))
                    } else if (typeof expected[key] === 'object' && expected[key] !== null) {
                        checkMissing(expected[key], actual[key], [...path, key])
                    }
                }
            }
        }

        checkMissing(expectedStructure, importJson, [])
        return missingData
    }

    const handleCreate = () => {
        const jsonData = JSON.parse(text)
        setParsedData(jsonData)
        const missingData = handleMissingData(jsonData)
        // if missing data length is not 0, show modal
        if (missingData.length > 0) {
            setShowModal(modalStates.MISSING)
        } else {
            // create study
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
                            {handleMissingData(parsedData).map((field, index) => (
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
                        <Button variant="warning" onClick={() => setShowModal(modalStates.CORRECT)}>Try Again</Button>
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
                        height: '200px',
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