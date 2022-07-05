import React, {useEffect, useState} from "react";
import {Button, Card, Form} from "react-bootstrap";
import "./Login.css";
import {Link, Navigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {authSlice, me, userLogin} from "../../redux/reducers/authSlice";
import {useAuth} from "../../components/Auth";

export default function Login(props) {
    //useDispatch to dispatch redux actions
    const dispatch = useDispatch()
    const auth = useAuth()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const logoutUser = props.logout;

    useEffect(( ) => {
        console.log("login use effect")
    }, [])

    useEffect(() => {
        if (logoutUser) {
            dispatch(authSlice.actions.logout())
        }
    }, [logoutUser])

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

    if (auth.isAuthenticated) {
        return <Navigate to="/" replace />
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
            </Card.Body>
        </Card>
    </div>
}
