import React, {useState} from "react";
import {Button, Card, Form} from "react-bootstrap";
import "./login.css";
import {Link} from "react-router-dom";

export default function Login(props) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleMail = (event) => {
        setEmail(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("[Login] " + email + " - " + password)
    }

    return <div className="login-box">
        <Card>
            <Card.Body>
                <Card.Title>StudyAlign</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control required type="email" placeholder="name@example.com" value={email} onChange={handleMail}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type="password" placeholder="Password" value={password} onChange={handlePassword}/>
                        </Form.Group>
                        <div className="d-grid">
                            <Button type="submit" size="lg">Login</Button>
                            <Form.Text>
                                <Link to="/login/forgot">Forgot Password</Link>
                            </Form.Text>
                        </div>
                    </Form>
            </Card.Body>
        </Card>
    </div>
}
