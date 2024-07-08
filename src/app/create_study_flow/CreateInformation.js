import React, { useState } from "react";
import { Button, Col, Row, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

import { createStudy, selectStudy } from "../../redux/reducers/studySlice";

import { useAuth } from "../../components/Auth";
import LoadingScreen from "../../components/LoadingScreen";
import StudyCreationLayout, { CreationSteps } from "./navigation_logic/StudyCreationLayout";

export default function CreateInformation() {
    const dispatch = useDispatch()
    const auth = useAuth()
    const location = useLocation()

    const [title, setTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [amountParticipants, setAmountParticipants] = useState('')
    const [description, setDescription] = useState('')
    const [consent, setConsent] = useState('')

    const [created, setCreated] = useState(false)

    const study = useSelector(selectStudy)

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
        let study = {
            "name": title,
            "startDate": startDate + "T15:08:50.161Z",
            "endDate": endDate  + "T15:08:50.161Z",
            "is_active": false, // TODO how to initialize study? As active or not active
            "owner_id": auth.user.id,
            "invite_only": false, // TODO how to indicate if invite_only or not? Checkbox?
            "description": description,
            "consent": consent,
            "planned_number_participants": amountParticipants,
            "planned_procedure": null,
            "current_setup_step": "information" // jump to procedure after creating
        }
        await dispatch(createStudy(study))
        setCreated(true)
    }

    if (created) {
        if (study == null) {
            return <LoadingScreen/>
        }
        else {
            return <Navigate to={"/create/" + study.id + "/procedure"} replace state={{ from: location }}/>
        }
    }

    return(
        <StudyCreationLayout step={CreationSteps.Information} static={true}>

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
                                <Form.Control required type="date" placeholder="Start Date" value={startDate} onChange={handleStartDate}
                                    min={(new Date()).toISOString().split('T')[0]}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formEndDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control required type="date" placeholder="End Date" min={startDate} value={endDate} onChange={handleEndDate}/>
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
                        <Col> <Button type="submit" size="lg">Save and Proceed</Button> </Col>
                    </Row>
                </Form>
            </Container>

        </StudyCreationLayout>
    )
}