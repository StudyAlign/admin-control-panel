import {Container, Nav, NavDropdown, Navbar} from "react-bootstrap";
import React from "react";
import {useNavigate} from "react-router";

import {useAuth} from "./Auth";

import "bootstrap/dist/css/bootstrap.css";
import "./Components.css"

export default function Topbar() {
    const auth = useAuth() // the useAuth hook returns the currently logged in user
    const navigate = useNavigate();

    const handleClickStudyAlign = (event) => {
        event.preventDefault()
        navigate("/")
    }

    const handleClickLogout = (event) => {
        event.preventDefault()
        navigate("/logout")
    }

    const handleClickProfile = (event) => {
        event.preventDefault()
        console.log(auth.user)
        navigate("/profile/" + auth.user.id)
    }

    const handleClickUsers = (event) => {
        event.preventDefault()
        navigate("/users")
    }

    return(
        <Navbar className="top-bar">
            <Container fluid>
                <Navbar.Brand onClick={handleClickStudyAlign} className="top-bar-logo">StudyAlign</Navbar.Brand>
                <Nav className="ml-auto">
                    {auth.user.role_id === 1 && <Nav.Link onClick={handleClickUsers} className="top-bar-item">Users</Nav.Link>}
                    <NavDropdown title={auth.user.name} id="top-bar-dropdown" >
                        <NavDropdown.Item onClick={handleClickProfile}>Profile</NavDropdown.Item>
                        <NavDropdown.Item onClick={handleClickLogout}>Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    )
}
