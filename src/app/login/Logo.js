import React, {Component} from "react";
import {Col, Image, Row} from "react-bootstrap";
import logo from "../../assets/logo.png";

export default function Logo(props) {
    return (
        <Row className="justify-content-md-center mb-5">
            <Col xs={12} sm={10} md={9}>
                <Image className={"login-logo"} src={logo} />
            </Col>
        </Row>
    );
}