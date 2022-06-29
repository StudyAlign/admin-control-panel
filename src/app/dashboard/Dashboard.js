import React from "react";
import Topbar from "../../components/Topbar";
import {useSelector} from "react-redux";
import {selectUser} from "../../redux/reducers/userSlice";

export default function Dashboard() {
    const user = useSelector(selectUser)

    return (
        <div>
            <Topbar/>
            Dashboard
        </div>
    )
}