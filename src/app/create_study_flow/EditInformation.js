import React, { useState, useEffect, useRef } from "react";
import { Button, Col, Row, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import {
    updateStudy,
    selectStudy,
    selectStudySetupInfo,
    getStudy,
    getStudySetupInfo,
    addParticipants
} from "../../redux/reducers/studySlice";

import HtmlEditor from "./procedure_editors/HtmlEditor";

import LoadingScreen from "../../components/LoadingScreen";
import StudyCreationLayout, { CreationSteps, StudyStatus } from "./navigation_logic/StudyCreationLayout";

export default function EditInformation(props) {

    const { status } = props

    const { study_id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [disabled] = useState(status === StudyStatus.Active ? true : false)
    const [title, setTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [amountParticipants, setAmountParticipants] = useState('')
    const [description, setDescription] = useState('')
    const [consent, setConsent] = useState('')
    const [privateStudy, setPrivateStudy] = useState(false)

    const endDateRef = useRef('')
    const amountParticipantsRef = useRef('')

    const study = useSelector(selectStudy)
    const studySetupInfo = useSelector(selectStudySetupInfo)

    useEffect(() => {
        dispatch(getStudy(study_id))
        dispatch(getStudySetupInfo(study_id))
    }, [])

    useEffect(() => {
        if (study && studySetupInfo) {
            setTitle(study.name)
            setStartDate(study.startDate.split('T')[0])
            setEndDate(study.endDate.split('T')[0])
            endDateRef.current = study.endDate.split('T')[0]
            let amount;
            if (studySetupInfo.state === "setup") {
                amount = studySetupInfo.planned_number_participants
            } else {
                amount = study.total_participants
            }
            setAmountParticipants(amount)
            amountParticipantsRef.current = amount
            setDescription(study.description)
            setConsent(study.consent)
            setPrivateStudy(study.invite_only)
        }
    }, [study, studySetupInfo])

    if (study == null || studySetupInfo == null) {
        return <LoadingScreen />
    }

    const handleTitle = (event) => {
        setTitle(event.target.value)
    }

    const handleStartDate = (event) => {
        setStartDate(event.target.value)
    }

    const handleEndDate = (event) => {
        setEndDate(event.target.value)
    }

    const handleParticipants = (event) => {
        setAmountParticipants(event.target.value)
    }

    const handlePrivateStudy = (event) => {
        setPrivateStudy(event.target.checked)
    }

    const handleDescription = (_, value) => {
        setDescription(value)
    }

    const handleConsent = (_, value) => {
        setConsent(value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (disabled && amountParticipants > amountParticipantsRef.current) {
            await dispatch(addParticipants({
                "studyId": study_id,
                "amount": amountParticipants - amountParticipantsRef.current
            }))
        }
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "name": title,
                "startDate": startDate + "T15:08:50.161Z",
                "endDate": endDate + "T15:08:50.161Z",
                "invite_only": privateStudy,
                "description": description,
                "consent": consent,
                "planned_number_participants": amountParticipants,
                "current_setup_step": "information"
            }
        }))
        await dispatch(getStudySetupInfo(study_id))
        if (studySetupInfo.state === "setup") {
            navigate("/create/" + study_id + "/procedure")
        } else {
            navigate("/edit/" + study_id + "/procedure")
        }
    }

    return(
        <StudyCreationLayout step={CreationSteps.Information}>

            <Container>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control required type="text" placeholder="Title" value={title} onChange={handleTitle}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formStartDate">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control disabled={disabled} required type="date" placeholder="Start Date" value={startDate} onChange={handleStartDate}
                                    min={disabled ? null : (new Date()).toISOString().split('T')[0]} />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formEndDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control min={disabled ? (new Date(endDateRef.current) > new Date() ? (new Date()).toISOString().split('T')[0] : endDateRef.current) : startDate}
                                    required type="date" placeholder="End Date" value={endDate} onChange={handleEndDate}/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Form.Group as={Row} className="mb-3 align-items-center" controlId="formPrivateStudy">
                            <Form.Label column sm={2}>Private Study</Form.Label>
                            <Col sm={10}>
                                <Form.Check
                                    type="checkbox"
                                    name="is_active"
                                    checked={privateStudy}
                                    onChange={handlePrivateStudy}
                                    className="me-2"
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row>
                        {/* <Col xs="auto">
                            <Form.Group className="mb-3" controlId="formPrivateStudy">
                                <Form.Label>Private Study</Form.Label>
                                <Form.Check type="checkbox" checked={privateStudy} onChange={handlePrivateStudy} />
                            </Form.Group>
                        </Col> */}
                        <Form.Group className="mb-3" controlId="formParticipants">
                            <Form.Label>Number of Participants</Form.Label>
                            <Form.Control min={disabled ? amountParticipantsRef.current : 0} required type="number" placeholder="Number of Participants" value={amountParticipants} onChange={handleParticipants}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <HtmlEditor value={description} onChange={(value) => handleDescription('description', value)}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formConsent">
                            <Form.Label>Consent</Form.Label>
                            <HtmlEditor value={consent} onChange={(value) => handleConsent('consent', value)}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Col> <Button type="submit">Update and Continue</Button> </Col>
                    </Row>
                </Form>
            </Container>

        </StudyCreationLayout>
    )
}