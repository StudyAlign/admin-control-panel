import React, { useState, useEffect } from "react";
import { Form, Button, Col, Row, Container, Modal } from "react-bootstrap";
import { Eye, EyeSlash, PencilSquare } from "react-bootstrap-icons";
import UserCreationLayout, { UserSteps } from "./UserCreationLayout";
import { userSlice, getUser, selectUser, updateUser } from "../../redux/reducers/userSlice";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import LoadingScreen from "../../components/LoadingScreen";

export default function UserInformation(props) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user_id } = useParams()
    const user = useSelector(selectUser)

    useEffect(() => {
        dispatch(getUser(user_id))
    }, [])

    const [editable, setEditable] = useState(props.editable)
    const [formData, setFormData] = useState({
        name: user.name || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        role_id: user.role_id || 1,
        is_active: user.is_active || true,
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)

    // modalstates
    const modalStates = {
        WRONG: 1,
        NOTMATCHING: 2,
        CORRECT: 3
    }
    const [showModal, setShowModal] = useState(modalStates.CORRECT)

    if (user === null) {
        return <LoadingScreen />
    } else {
        dispatch(getUser(user_id))
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        })
    }

    const handleSubmit = (e) => {
        if (editable) {
            e.preventDefault()
            if (formData.password !== formData.confirmPassword) {
                setShowModal(modalStates.NOTMATCHING)
                return
            } else {
                const new_Data = {
                    name: formData.name,
                    firstname: formData.firstname,
                    lastname: formData.lastname,
                    email: formData.email,
                    role_id: formData.role_id,
                    is_active: formData.is_active,
                    password: formData.password    
                }
                dispatch(updateUser({ "userId": user_id, "user": new_Data })).then(() => {
                    dispatch(getUser(user_id))
                })
            }
            setEditable(false)
        }
    }

    const returnToUsers = (e) => {
        e.preventDefault()
        dispatch(userSlice.actions.setUserProcess("information"))
        navigate("/users")
    }

    const toggleEditable = () => {
        setEditable(!editable)
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

    return (
        <UserCreationLayout step={UserSteps.Information}>
            <Container>
                <Row className="mb-3">
                    <Col>
                        <Button variant="outline-secondary" onClick={toggleEditable}>
                            <PencilSquare /> {editable ? "Cancel" : "Edit"}
                        </Button>
                    </Col>
                </Row>
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
                                disabled={!editable}
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
                                    disabled={!editable}
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
                                    disabled={!editable}
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
                                disabled={!editable}
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
                                disabled={!editable}
                            >
                                <option value={1}>Admin</option>
                                <option value={2}>Owner</option>
                                <option value={3}>Collaborator</option>
                            </Form.Select>
                        </Form.Group>
                    </Row>

                    {editable && (
                        <>
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
                                            disabled={!editable}
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
                                        disabled={!editable}
                                    />
                                </Form.Group>
                            </Row>
                        </>
                    )}

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
                                    disabled={!editable}
                                />
                            </Col>
                        </Form.Group>
                    </Row>

                    {editable ? (
                        <Row>
                            <Col>
                                <Button type="submit" size="lg">
                                    Update
                                </Button>
                            </Col>
                        </Row>
                    ) : (
                        <Row>
                            <Col>
                                <Button variant="success" size="lg" onClick={returnToUsers}>
                                    Done
                                </Button>
                            </Col>
                        </Row>
                    
                    )}
                </Form>
            </Container>

            {returnModal()}
        </UserCreationLayout>
    )
}
