import React from "react";
import StudyCreationLayout, {CreationSteps} from "./StudyCreationLayout";
import {useParams} from "react-router";


export default function CreateIntegrations() {
    const { study_id } = useParams()

    return (
        <StudyCreationLayout step={CreationSteps.Integrations}>


        </StudyCreationLayout>
    )
}