import React, {useState} from "react";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import {Button, Col, Row, Container, Form} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {useAuth} from "../../components/Auth";
import {createStudy} from "../../redux/reducers/studySlice";
import {useNavigate} from "react-router";

export default function CreateInformation() {
    const dispatch = useDispatch()
    const auth = useAuth()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [amountParticipants, setAmountParticipants] = useState('')
    const [description, setDescription] = useState('')
    const [consent, setConsent] = useState('')

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
        const study = {
            "name": title,
            "startDate": startDate + "T15:08:50.161Z",
            "endDate": endDate  + "T15:08:50.161Z",
            "is_active": false, // TODO how to initialize study? As active or not active
            "owner_id": auth.user.id,
            "invite_only": false, // TODO how to indicate if invite_only or not? Checkbox?
            "description": description,
            "consent": consent,
        }
        await dispatch(createStudy(study))
        // TODO what to do with the entered amount of participants?
        navigate("/")  // TODO get id of created study and navigate to procedure creating
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
                                <Form.Control required type="date" placeholder="Start Date" value={startDate} onChange={handleStartDate}/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formEndDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control required type="date" placeholder="End Date" value={endDate} onChange={handleEndDate}/>
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