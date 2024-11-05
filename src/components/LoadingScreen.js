import React from "react";
import { Spinner } from "react-bootstrap";

import "./Loadingscreen.scss";

export default function LoadingScreen(props) {
    const text = props.text || "Loading ...";
    return (
        <div className="center-box">
            <Spinner animation="grow" variant="sal-darkgold" />
            <div>{text}</div>
        </div>
    )
}