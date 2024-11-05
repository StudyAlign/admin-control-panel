import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { ArrowLeft } from 'react-bootstrap-icons';
import { Link } from "react-router-dom";

import Logo from "./Logo";

export default function ForgotPW(props) {

    const [email, setEmail] = useState("")

    const handleMail = (event) => {
        setEmail(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("[Reset Password] " + this.state.email)
    }

    return (
        <div className="login-box">
            <Logo />
            <Card className={"shadow"}>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <div className="d-grid">
                                <Form.Label>Reset Password</Form.Label>
                                <Form.Text>
                                    We will send you an email to reset your password. If you cannot remember your email  please contact an administrator.
                                </Form.Text>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control required type="text" placeholder="Email" value={email} onChange={handleMail}/>
                        </Form.Group>
                        <div className="d-grid">
                            <Button type="submit" size="lg">Reset Password</Button>
                            <Form.Text>
                                <Link to="/login"><ArrowLeft /> Back to Login</Link>
                            </Form.Text>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )

}
