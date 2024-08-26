import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Tabs, Tab, Pagination, Dropdown } from "react-bootstrap";
import { ArrowUp, ArrowDown } from "react-bootstrap-icons";

import {
    userSlice,
    getUsers,
    selectUsers,
} from "../../redux/reducers/userSlice";

import LoadingScreen from "../../components/LoadingScreen";
import Topbar from "../../components/Topbar";

import "../SidebarAndReactStyles.css";

export default function UserOverview(props) {
    const dispatch = useDispatch()
    const users = useSelector(selectUsers)

    useEffect(() => {
        dispatch(getUsers())
        return () => {
            dispatch(userSlice.actions.resetAllUsers())
        }
    }, [])

    if (users === null) {
        return (
            <>
                <Topbar />
                <LoadingScreen />
            </>
        )
    } else {
        return (
            <h1>Overview Users</h1>
        )
    }
}