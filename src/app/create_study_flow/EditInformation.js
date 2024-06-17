import React, { useState, useEffect } from "react";
import { Button, Col, Row, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import {
    updateStudy,
    selectStudy,
    selectStudySetupInfo,
    getStudy,
    getStudySetupInfo
} from "../../redux/reducers/studySlice";

import LoadingScreen from "../../components/LoadingScreen";
import StudyCreationLayout, { CreationSteps, StudyStatus } from "./StudyCreationLayout";

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
            setAmountParticipants(studySetupInfo.planned_number_participants)
            setDescription(study.description)
            setConsent(study.consent)
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

    const handleDescription = (event) => {
        setDescription(event.target.value)
    }

    const handleConsent = (event) => {
        setConsent(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "name": title,
                "startDate": startDate + "T15:08:50.161Z",
                "endDate": endDate + "T15:08:50.161Z",
                "is_active": false, // TODO how to initialize study? As active or not active
                "invite_only": false, // TODO how to indicate if invite_only or not? Checkbox?
                "description": description,
                "consent": consent,
                "planned_number_participants": amountParticipants,
                "planned_procedure": null,
                "current_setup_step": "study" // TODO change to "information" after backend change
            }
        }))
        await dispatch(getStudySetupInfo(study_id))
        navigate("/create/" + study_id + "/procedure")
    }

    return(
        <StudyCreationLayout step={CreationSteps.Information}>

            <Container>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control disabled={disabled} required type="text" placeholder="Title" value={title} onChange={handleTitle}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formStartDate">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control disabled={disabled} required type="date" placeholder="Start Date" value={startDate} onChange={handleStartDate}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formEndDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control disabled={disabled} required type="date" placeholder="End Date" value={endDate} onChange={handleEndDate}/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formParticipants">
                            <Form.Label>Amount Participants</Form.Label>
                            <Form.Control required type="number" placeholder="Amount Participants" value={amountParticipants} onChange={handleParticipants}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control required type="text" as="textarea" rows={4} placeholder="Description" value={description} onChange={handleDescription}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formConsent">
                            <Form.Label>Consent</Form.Label>
                            <Form.Control required type="text" as="textarea" rows={4} placeholder="Consent" value={consent} onChange={handleConsent}/>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Col> <Button type="submit" size="lg">Update and Proceed</Button> </Col>
                    </Row>
                </Form>
            </Container>

        </StudyCreationLayout>
    )
}