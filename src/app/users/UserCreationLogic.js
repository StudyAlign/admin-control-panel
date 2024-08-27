import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { userSlice, getUser, selectUser, selectUserState } from "../../redux/reducers/userSlice";

import Topbar from "../../components/Topbar";
import LoadingScreen from "../../components/LoadingScreen";
import { UserOrder } from "./UserCreationLayout";

export default function UserCreationLogic(props) {
    const dispatch = useDispatch()
    const { user_id } = useParams()
    const location = useLocation()

    const user = useSelector(selectUser)
    const userState = useSelector(selectUserState)

    useEffect( () => {
        dispatch(getUser(user_id))
        return () => {
            dispatch(userSlice.actions.resetUser())
            dispatch(userSlice.actions.resetAllUsers())
            dispatch(userSlice.actions.setUserProcess(null))
        }
    }, [])

    const next_step = (current_step) => {
        let idx = UserOrder.indexOf(current_step)
        return UserOrder[idx+1]
    }

    const get_step = (path) => {
        const path_split = path.split('/')
        if(path_split.size < 4) {
            return ''
        }
        else {
            return path_split.slice(3).join('/')
        }
    }

    if(user === null) {
        return (
            <>
                <Topbar/>
                <LoadingScreen/>
            </>
        )
    }

    if (userState === "done" || next_step(userState) === "done") {
        // If creation is done, navigate to user overview
        return <Navigate to={"/users"} replace state={{ from: location }} />
    }
    else if (get_step(location.pathname) === next_step(userState)) {
        return <Outlet/>
    }
    else {
        return <Navigate to={next_step(userState)} replace state={{ from: location }} />
    }
}