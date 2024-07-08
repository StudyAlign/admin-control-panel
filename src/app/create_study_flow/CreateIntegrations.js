import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { getStudySetupInfo, selectStudySetupInfo, updateStudy, getProcedureConfig, selectStudyProcedure, getProcedureConfigOverview, selectStudyProcedureOverview } from "../../redux/reducers/studySlice";

import StudyCreationLayout, { CreationSteps } from "./navigation_logic/StudyCreationLayout";
import { CreateProcedureContext } from "./CreateProcedure";
import { ProcedureTypes } from "./ProcedureObject";
import LoadingScreen from "../../components/LoadingScreen";
import Topbar from "../../components/Topbar";

const url = process.env.REACT_APP_STUDY_ALIGN_URL || "http://localhost:8000/";

const code = "" +
    "<script type=\"text/javascript\">\n" +
    "   const navigatorUpdate = new Promise( (resolve, reject) => {\n" +
    "\n" +
    "       const limeSurveyAccessCode = \"{TOKEN}\";\n" +
    "       const a = limeSurveyAccessCode.slice(0, 8);\n" +
    "       const b = limeSurveyAccessCode.slice(8, 12);\n" +
    "       const c = limeSurveyAccessCode.slice(12, 16);\n" +
    "       const d = limeSurveyAccessCode.slice(16, 20);\n" +
    "       const e = limeSurveyAccessCode.slice(20);\n" +
    "       const h = \"-\";\n" +
    "       const participantToken = [a, h, b, h, c, h, d, h, e].join('');\n" +
    " \n" +
    "       const surveyId = \"{SID}\";\n" +
    "\n" +
    "       let url = \"" + url + "\";\n" +
    "       const body = {\n" +
    "           \"source\": \"limesurvey\",\n" +
    "           \"ext_id\": surveyId, // limesurvey ID\n" +
    "           \"participant_token\": participantToken, // participant token (limesurvey access code in uuid format)\n" +
    "           //\"procedure_step_id\": 0, // optional! deprecated?\n" +
    "           \"state\": \"done\" // can be \"in_progress\" or \"done\"\n" +
    "       };\n" +
    "\n" +
    "       url = url + \"/api/v1/procedures/navigator\";\n" +
    "       const xhr = new XMLHttpRequest();\n" +
    "       xhr.open(\"POST\", url);\n" +
    "       xhr.onload = () => {\n" +
    "           if (xhr.status >= 200 && xhr.status < 300) {\n" +
    "               resolve({\n" +
    "                   status: xhr.status,\n" +
    "                   body: xhr.response ? JSON.parse(xhr.response) : \"\"\n" +
    "               });\n" +
    "           } else {\n" +
    "               reject({\n" +
    "                   status: xhr.status,\n" +
    "                   statusText: xhr.statusText,\n" +
    "                   requestBody: body\n" +
    "               });\n" +
    "           }\n" +
    "       };\n" +
    "       xhr.onerror = () => {\n" +
    "           reject({\n" +
    "               status: xhr.status,\n" +
    "               statusText: xhr.statusText,\n" +
    "               requestBody: body\n" +
    "           });\n" +
    "       };\n" +
    "       xhr.setRequestHeader(\"Content-type\", \"application/json\");\n" +
    "       xhr.send(JSON.stringify(body));\n" +
    "   });\n" +
    "\n" +
    "   navigatorUpdate.then(response => {\n" +
    "       console.log(response);\n" +
    "   }).catch(error => {\n" +
    "       console.log(error);\n" +
    "   });\n" +
    "</script> \n"

export default function CreateIntegrations(props) {

    const { status } = props

    const { currentSystem, NO_QUESTIONNAIRE_SYSTEM } = useContext(CreateProcedureContext)

    const { study_id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [checked, setChecked] = useState(false)

    const procedureConfig = useSelector(selectStudyProcedure)
    const procedureConfigOverview = useSelector(selectStudyProcedureOverview)

    useEffect(() => {
        dispatch(getProcedureConfig(study_id)).then((response) => {
            if (response.payload.body.id) {
                dispatch(getProcedureConfigOverview(response.payload.body.id))
            }
        })
    }, [])

    if (procedureConfig == null || procedureConfigOverview == null) {
        return (
            <>
                <Topbar />
                <LoadingScreen />
            </>
        )
    }

    const copyToClipboard = (event) => {
        event.preventDefault()
        navigator.clipboard.writeText(code)
    }

    const handleProceed = async (event) => {
        event.preventDefault()
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "current_setup_step": "integrations"
            }
        }))
        await dispatch(getStudySetupInfo(study_id))
        navigate("/create/" + study_id + "/check")
    }

    const checkForQuestionnaires = () => {
        const gatherArray = (steps) => {
            let procedure = []
            for (let step of steps) {
                let newContent = {
                    id: undefined,
                    type: undefined,
                    content: undefined,
                    children: undefined
                }
                if (step["questionnaire_id"]) {
                    newContent.id = "q" + step["questionnaire_id"].toString()
                    newContent.type = ProcedureTypes.Questionnaire
                    let empty_content = JSON.parse(JSON.stringify(ProcedureTypes.Questionnaire.emptyContent))
                    for (let [key,] of Object.entries(ProcedureTypes.Questionnaire.emptyContent)) {
                        empty_content[key] = step["questionnaire"][key]
                    }
                    newContent.content = JSON.parse(JSON.stringify(empty_content))
                    // push new content
                    procedure.push(newContent)
                } else if (step["block_id"]) {
                    newContent.id = "b" + step["block_id"].toString()
                    newContent.type = ProcedureTypes.BlockElement
                    newContent.children = gatherArray(step["block"]["procedure_config_steps"])
                    // push new content
                    procedure.push(newContent)
                }
            }
            return procedure
        }
        const questionnaireBlockArray = gatherArray(procedureConfigOverview["procedure_config_steps"])
        const blockElements = questionnaireBlockArray.filter(element => element.type === ProcedureTypes.BlockElement)
        // save questionnaireBlockArray without block elements
        const questionnaireArray = questionnaireBlockArray.filter(element => element.type === ProcedureTypes.Questionnaire)
        for (let block of blockElements) {
            for (let q of block.children) {
                questionnaireArray.push(q)
            }
        }
        return questionnaireArray
    }

    const showCurrentSystemCallback = () => {
        let noSystem
        let system

        const questionnaires = checkForQuestionnaires()
        if (questionnaires.length === 0) {
            noSystem = true
        } else {
            noSystem = false
            system = questionnaires[0].content.system
        }

        if (noSystem) {
            return (
                <>
                    <Row>
                        <p> You are not using a questionnaire system in your procedure. </p>
                        <p> Go to the next page and chek out your study! </p>
                    </Row>

                    <Row className='mt-3' xs="auto">
                        <Button size="lg" onClick={handleProceed}>Save and Proceed</Button>
                    </Row>
                </>
            )
        } else {
            return (
                <>
                    <Row>
                        <p> Your are using <span style={{ color: 'blue' }}>{system}</span> questionnaires in your procedure. </p>

                        <p> Please paste the following Callback code into the “End Message” of each of your questionnaires (see example screenshot).</p>
                    </Row>

                    <Row className="align-items-baseline">
                        <Col xs="auto">
                            <textarea disabled rows={18} cols={80} style={{ "fontSize": "10pt" }} value={code} />
                        </Col>
                        <Col xs="auto">
                            <Button variant="secondary" size="sm" className="align-text-bottom" onClick={copyToClipboard}> Copy to clipboard </Button>
                        </Col>
                    </Row>

                    <Row>
                        <Form.Check checked={checked}
                            onChange={() => setChecked(!checked)}
                            label={"I have pasted the callback code into the end messages."} />
                    </Row>

                    <Row className='mt-3' xs="auto">
                        <Button size="lg" onClick={handleProceed} disabled={!checked}>Save and Proceed</Button>
                    </Row>
                </>
            )
        }
    }

    return (
        <StudyCreationLayout step={CreationSteps.Integrations}>
            <Container>
                {showCurrentSystemCallback()}
            </Container>
        </StudyCreationLayout>
    )
}
