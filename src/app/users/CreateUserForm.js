import React, { useState } from "react";
import { Form, Button, Col, Row, Container, Modal } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { Navigate, useLocation } from "react-router-dom";

import UserCreationLayout, { UserSteps } from "./UserCreationLayout";

import { userSlice, getUser, selectUser, createUser } from "../../redux/reducers/userSlice";

import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import LoadingScreen from "../../components/LoadingScreen";

export default function CreateUserForm() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const location = useLocation()

    const user = useSelector(selectUser)

    const [formData, setFormData] = useState({
        name: "",
        firstname: "",
        lastname: "",
        email: "",
        role_id: 1,
        is_active: true,
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)

    const [created, setCreated] = useState(false)

    // modalstates
    const modalStates = {
        WRONG: 1,
        NOTMATCHING: 2,
        CORRECT: 3
    }
    const [showModal, setShowModal] = useState(modalStates.CORRECT)

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setShowModal(modalStates.NOTMATCHING)
            return
        }

        const new_user = {
            name: formData.name,
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            role_id: formData.role_id,
            is_active: formData.is_active,
            password: formData.password
        }

        dispatch(createUser(new_user)).then((response) => {
            if(response?.payload?.body?.id) {
                dispatch(getUser(response.payload.body.id))
                setCreated(true)
            } else {
                setShowModal(modalStates.WRONG)
            }
        })
    }

    const returnModal = () => {
        if (showModal !== modalStates.CORRECT) {
            let title = ''
            let body = ''
            let buttonText = ''
            let buttonType = ''
            if (showModal === modalStates.WRONG) {
                title = 'Something went wrong'
                body = 'Please try again'
                buttonText = 'Try again'
                buttonType = 'warning'
            } else if (showModal === modalStates.NOTMATCHING) {
                title = 'Passwords do not match'
                body = 'Please make sure the passwords match'
                buttonText = 'Ok'
                buttonType = 'warning'
            }

            return (
                <Modal show={true} onHide={() => setShowModal(modalStates.CORRECT)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{body}</Modal.Body>
                    <Modal.Footer>
                        <Button variant={buttonType} onClick={() => {
                            setShowModal(modalStates.CORRECT)
                        }}>{buttonText}</Button>
                    </Modal.Footer>
                </Modal>
            )
        }
    }

    if (created) {
        if (user == null) {
            return <LoadingScreen/>
        }
        else {
            dispatch(userSlice.actions.setUserProcess("create"))
            return <Navigate to={"/users/" + user.id + "/information"} replace state={{ from: location }}/>
        }
    }

    return (
        <UserCreationLayout step={UserSteps.Create}>
            <Container>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="formFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="firstname"
                                    placeholder="First Name"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="formLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastname"
                                    placeholder="Last Name"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="example@gmail.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                name="role_id"
                                value={formData.role_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Researcher</option>
                                {/* <option value={3}>Student</option> */}
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <div className="input-group">
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeSlash /> : <Eye />}
                                </Button>
                            </div>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group className="mb-3" controlId="formPasswordAgain">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group as={Row} className="mb-3 align-items-center" controlId="formActive">
                            <Form.Label column sm={1}>Active</Form.Label>
                            <Col sm={10}>
                                <Form.Check
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleInputChange}
                                    className="me-2"
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Col>
                            <Button type="submit" size="lg">Create User</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>

            {returnModal()}
        </UserCreationLayout>
    )
}