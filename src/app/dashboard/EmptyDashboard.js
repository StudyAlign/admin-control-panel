import React from "react";
import "./Dashboard.css";

export default function EmptyDashboard() {
    return (
        <div className="emptyDashboard">
            <div className="center">
                <div className="text-button-box">
                    <div className="headline"> There are no studies yet </div>
                    <button className="button1"> Create Study </button>
                </div>
                <div className="text-button-box">
                    <div className="headline"> Invite your colleagues </div>
                    <button className="button1"> Add Users </button>
                </div>
            </div>
        </div>
    )
}