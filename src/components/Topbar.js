import { Container, Nav, NavDropdown, Navbar, Image, Badge, Button } from "react-bootstrap";
import React from "react";
import { useNavigate } from "react-router";

import { useAuth } from "./Auth";

import "bootstrap/dist/css/bootstrap.css";
import "./Components.css"
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { PlusCircle, PlusCircleFill } from "react-bootstrap-icons";

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
        navigate("/profile/" + auth.user.id + "/information")
    }

    const handleClickUsers = (event) => {
        event.preventDefault()
        navigate("/users")
    }

    return (
        <Navbar className="top-bar">
            <Container fluid>
                <Navbar.Brand onClick={handleClickStudyAlign} className="top-bar-logo"><Image width="160" src={logo} /></Navbar.Brand>
                {auth && auth.user && (
                    <>
                        <Nav className="me-auto">
                            <Navbar.Text className="me-2"><Link to={"/create"}><Button variant="primary"><PlusCircleFill className="button-icon" /> Create Study</Button></Link></Navbar.Text>
                            <Navbar.Text><Link to={"/import"}><Button variant="link-sal">Import Study</Button></Link></Navbar.Text>
                        </Nav>
                        <Nav >
                            {auth.user.role_id === 1 && <Nav.Link onClick={handleClickUsers} className="top-bar-item">Users</Nav.Link>}
                            <NavDropdown title={auth.user.name} id="top-bar-dropdown" >
                                <NavDropdown.Item onClick={handleClickProfile}>Profile</NavDropdown.Item>
                                <NavDropdown.Item onClick={handleClickLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </>
                )}
            </Container>
        </Navbar>
    )
}