import {useParams} from "react-router";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import React from "react";

export default function CreateCheck() {
    const { study_id } = useParams()

    return (
        <StudyCreationLayout step={CreationSteps.Check}>


        </StudyCreationLayout>
    )
}