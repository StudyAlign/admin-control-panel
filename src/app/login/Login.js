import React, {useEffect, useState} from "react";
import {Button, Card, Form} from "react-bootstrap";
import "./login.css";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {authSlice, me, userLogin} from "../../redux/reducers/authSlice";

export default function Login(props) {
    //useDispatch to dispatch redux actions
    const dispatch = useDispatch()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    useEffect(( ) => {
        console.log("login use effect")
    }, [])

    const handleUsername = (event) => {
        setUsername(event.target.value)
    }

    const handlePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("[Login] " + username + " - " + password)
        dispatch(userLogin({username: username, password: password}));
    }

    const handleClick = (event) => {
        event.preventDefault();
        dispatch(me())
    }

    const handleLogout = (event) => {
        event.preventDefault();
        dispatch(authSlice.actions.logout())
    }

    return <div className="login-box">
        <Card>
            <Card.Body>
                <Card.Title>StudyAlign</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control required type="text" placeholder="Username" value={username} onChange={handleUsername}/>
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
                <Button onClick={handleClick}>Me</Button>
                <Button onClick={handleLogout}>Logout</Button>
                <Link to="/">Dashboard</Link>
            </Card.Body>
        </Card>
    </div>
}
