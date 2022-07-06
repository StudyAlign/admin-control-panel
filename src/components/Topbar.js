import {Container, Nav, NavDropdown, Navbar} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./Components.css"
import React from "react";
import {useAuth} from "./Auth";
import {useNavigate} from "react-router";

export default function Topbar() {
    const auth = useAuth() // the useAuth hook returns the currently logged in user
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault()
        navigate("/")
    }

    return(
        <Navbar className="top-bar">
            <Container fluid>
                <Navbar.Brand onClick={handleClick} className="top-bar-logo">StudyAlign</Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link href="#users" className="top-bar-item">Users</Nav.Link>
                    <NavDropdown title={auth.user.name} id="top-bar-dropdown" >
                        <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
                        <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    )
}
