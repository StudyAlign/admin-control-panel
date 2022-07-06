import React from "react";
import {Button} from "react-bootstrap";
import "./Dashboard.css";
import {useNavigate} from "react-router";

export default function EmptyDashboard() {
    const navigate = useNavigate();

    const handleClickCreateStudy = (event) => {
        event.preventDefault()
        navigate("/create")
    }

    return (
        <div className="emptyDashboard">
            <div className="center">
                <div className="text-button-box">
                    <div className="headline"> There are no studies yet </div>
                    <Button className="button1" onClick={handleClickCreateStudy}> Create Study </Button>
                </div>
                <div className="text-button-box">
                    <div className="headline"> Invite your colleagues </div>
                    <Button className="button1"> Add Users </Button>
                </div>
            </div>
        </div>
    )
}