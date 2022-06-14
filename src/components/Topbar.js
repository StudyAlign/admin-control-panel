import {Container, Nav, NavDropdown, Navbar} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "./Components.css"
import React from "react";

export default function Topbar() {
    return(
        <Navbar className="top-bar">
            <Container fluid>
                <Navbar.Brand href="#home" className="top-bar-logo">StudyAlign</Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link href="#users" className="top-bar-item">Users</Nav.Link>
                    <NavDropdown title="My Name" id="top-bar-dropdown" >
                        <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
                        <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    )
}
