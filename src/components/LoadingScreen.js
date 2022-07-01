import React from "react";
import {Spinner} from "react-bootstrap";
import "./loadingscreen.css";

export default function LoadingScreen(props) {
    const text = props.text || "Loading ...";
    return (
        <div className="center-box">
            <Spinner animation="grow" variant="primary" />
            <div>{text}</div>
        </div>
    )
}