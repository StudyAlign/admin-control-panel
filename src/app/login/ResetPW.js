import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import Logo from "./Logo";

export default function ResetPW(props) {

    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")

    //TODO: check for reset token!
    const resetToken = props.resetToken

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleRepeatedPassword = (event) => {
        setPasswordRepeat(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("[Confirm Password] " + password + " - " + passwordRepeat)
    }

    return (
        <div className="login-box">
            <Logo />
            <Card className={"shadow"}>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <div className="d-grid">
                                <Form.Label>Enter new password</Form.Label>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required type="password" placeholder="Password" value={password} onChange={handlePassword}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formRepeatPassword">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control required type="password" placeholder="Repeat Password" value={passwordRepeat} onChange={handleRepeatedPassword}/>
                        </Form.Group>
                        <div className="d-grid">
                            <Button type="submit" size="lg">Confirm Password</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    )

}