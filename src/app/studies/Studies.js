import React, {useEffect} from "react";
import Topbar from "../../components/Topbar";
import {useDispatch, useSelector} from "react-redux";
import {selectUserTokens} from "../../redux/reducers/authSlice";
import {createStudy, getStudies, getStudy, selectStudies, selectStudy} from "../../redux/reducers/studySlice";
import {Bucket} from "react-bootstrap-icons";
import {Button} from "react-bootstrap";
import {useAuth} from "../../components/Auth";

export default function Studies() {
    const dispatch = useDispatch() // Dispatch is needed to fire redux actions
    const auth = useAuth() // the useAuth hook returns the currently logged in user

    // With selectors we read the data from the central redux store
    const studies = useSelector(selectStudies)
    const study = useSelector(selectStudy)

    // For dummy purpose: Sending a data object to our backend via the createStudy Action
    const handleClick = async () => {
        const dummyStudy = {
            "name": "This is another dummy study",
            "startDate": "2022-07-04T15:08:50.161Z",
            "endDate": "2022-08-04T15:08:50.161Z",
            "is_active": true,
            "owner_id": auth.user.id,
            "invite_only": false,
            "description": "Description about a dummy study can only be nonsense.",
            "consent": "<strong>There is only a dummy to accept</strong>"
        }
        await dispatch(createStudy(dummyStudy));
    }

    const handleGetStudy = async () => {
        await dispatch(getStudy(1));
    }

    // Currently, this effect is only called after the initial rendering
    useEffect(( ) => {
        dispatch(getStudies()); //Dispatching getStudies Action from studySlice
    }, [])

    console.log("Studies", studies);
    console.log("Study", study);

    // If studies exist, we are going to generate an array of list elements (visual representation of the API's response)
    const studyList = studies && studies.map((study) =>
        <li key={study.id}>{study.name}; Consent: {study.consent}</li>
    );

    const firstStudy = study && <strong>{study.id} - {study.name}</strong>

    return (
        <div>
            <Topbar/>
            Studies
            <ul>
                {studyList}
            </ul>

            <hr />

            Create Study
            <Button type="submit" size="lg" onClick={handleClick}>Create Dummy Study</Button>

            <hr />

            Get Study with id 1:
            <Button type="submit" size="lg" onClick={handleGetStudy}>Get Study with ID 1</Button>
            {firstStudy}
        </div>
    )
}