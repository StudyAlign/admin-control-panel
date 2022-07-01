import {Container, Nav, NavDropdown, Navbar} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";

export default function Topbar(props) {
    return(
        <Navbar className="top-bar" variant="light">
            <Container fluid>
                <Navbar.Brand href="#home">StudyAlign</Navbar.Brand>
                <Nav className="ml-auto">
                    <Nav.Link href="#users">Users</Nav.Link>
                    <NavDropdown title="My Name" menuVariant="light">
                        <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
                        <NavDropdown.Item href="/logout">Logout</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    )
}
