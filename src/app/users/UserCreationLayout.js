import React from "react";
import Topbar from "../../components/Topbar";
import SidebarLayout from "./SidebarLayout";

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
            <SidebarLayout step={props.step}>
                <h1 className="page-title"> {getTitle(props.step)} </h1>
                {props.children}
            </SidebarLayout>
        </>
    )
}