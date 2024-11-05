import React from "react";
import Topbar from "../../components/Topbar";
import SidebarLayout from "./SidebarLayout";
import {Col, Container, Row} from "react-bootstrap";

export const UserOrder = [
    "create",
    "information",
    "done",
    "edit/information",
    "edit",
    "done"
]

export const UserSteps = {
    Create: 0,
    Information: 1
}

export default function UserCreationLayout(props) {

    const getTitle = (step) => {
        switch (step) {
            case UserSteps.Create:
                return "Create User"
            case UserSteps.Information:
                return "User Information"
            default:
                return "Create User"
        }
    }

    return (
        <>
            <Topbar />
            <Container>
                <Row>
                    <Col id="page-content-wrapper">
                        <h3 className="headline"> {getTitle(props.step)} </h3>
                        {props.children}
                    </Col>
                </Row>
            </Container>

        </>
    )
}