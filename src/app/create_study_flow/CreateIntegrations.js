import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Col, Container, Form, Row, Tooltip, OverlayTrigger } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { getStudySetupInfo, selectStudySetupInfo, updateStudy, getProcedureConfig, selectStudyProcedure, getProcedureConfigOverview, selectStudyProcedureOverview } from "../../redux/reducers/studySlice";

import StudyCreationLayout, { CreationSteps } from "./navigation_logic/StudyCreationLayout";
import { CreateProcedureContext } from "./CreateProcedure";
import { ProcedureTypes } from "./ProcedureObject";
import LoadingScreen from "../../components/LoadingScreen";
import Topbar from "../../components/Topbar";

const url = process.env.REACT_APP_STUDY_ALIGN_URL || "http://localhost:8000/";

const questionnaireSystems = {
    LIMESURVEY: "limesurvey",
    QUALTRICS: "qualtrics",
    SURVEYMONKEY: "surveymonkey",
    GOOGLEFORMS: "googleforms",
    TYPEFORM: "typeform",
    JOTFORM: "jotform",
}

const styles = {
    link: {
        color: 'black',
        fontSize: 'medium',
        textDecoration:'underline',
        cursor: 'pointer',
        backgroundColor: 'lightgray',
        borderRadius: '2px',
        borderColor: 'black',
        padding: '5px',
    },
    copy: {
        color: 'black',
        fontSize: 'medium',
        cursor: 'pointer',
        backgroundColor: 'lightgray',
        borderRadius: '2px',
        borderColor: 'black',
        padding: '5px',
    },
    highlight: {
        color: 'black',
        fontSize: 'medium',
        backgroundColor: 'lightblue',
        borderRadius: '2px',
        borderColor: 'black',
        padding: '5px',
    }
}

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
    const studySetupInfo = useSelector(selectStudySetupInfo)

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

    const handleProceed = async (event) => {
        event.preventDefault()
        await dispatch(updateStudy({
            "studyId": study_id,
            "study": {
                "current_setup_step": "integrations"
            }
        }))
        await dispatch(getStudySetupInfo(study_id))
        if (studySetupInfo.state === "setup") {
            navigate("/create/" + study_id + "/check")
        } else {
            navigate("/edit/" + study_id + "/check")
        }
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

    const LimeSurveyInstructions = () => {
        const [copySuccess, setCopySuccess] = useState(false)
        let timeoutId

        const backendUrl = process.env.REACT_APP_STUDY_ALIGN_URL;

        const url = backendUrl + "/{PASSTHRU:SAL_ID}/proceed/{PASSTHRU:SAL_TOKEN}"
        const copy1 = "SAL_TOKEN"
        const copy2 = "SAL_ID"
        const end = "Please click on the following link"
    
        const copyToClipboard = (text) => {
            navigator.clipboard.writeText(text).then(() => {
                setCopySuccess(true);
                timeoutId = setTimeout(() => setCopySuccess(false), 2000)
            })
        }

        const handleMouseLeave = () => {
            clearTimeout(timeoutId)
            setCopySuccess(false)
        }
    
        const renderTooltip = (props) => (
            <Tooltip {...props}>
                {copySuccess ? "Copied!" : "Copy to Clipboard"}
            </Tooltip>
        )
    
        return (
            <div>
                <ol>
                    <li>Create two hidden fields in your questionnaire for saving each, the study id, and the participant token.</li>
                    <li>Go to <span style={styles.highlight}>Panel Integration</span> and add the two URL PARAMS:&nbsp;
                        <OverlayTrigger
                            placement="auto"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                        >
                            <span 
                                onClick={() => copyToClipboard(copy1)} 
                                onMouseLeave={handleMouseLeave}
                                style={styles.copy}>
                                {copy1}
                            </span>
                        </OverlayTrigger> and&nbsp;
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                        >
                            <span 
                                onClick={() => copyToClipboard(copy2)} 
                                onMouseLeave={handleMouseLeave}
                                style={styles.copy}>
                                {copy2}
                            </span>
                        </OverlayTrigger> and set the target fields to the hidden fields from step 1.
                    </li>
                    <li>Go to "Text Elements" and set the following End Url:&nbsp;
                        <OverlayTrigger
                            placement="auto"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                        >
                            <span 
                                onClick={() => copyToClipboard(url)} 
                                onMouseLeave={handleMouseLeave}
                                style={styles.link}>
                                {url}
                            </span>
                        </OverlayTrigger>
                    </li>
                    <li>Write into the <span style={styles.highlight}>End message</span>:&nbsp;
                        <OverlayTrigger
                            placement="auto"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                        >
                            <span 
                                onClick={() => copyToClipboard(end)} 
                                onMouseLeave={handleMouseLeave}
                                style={styles.copy}>
                                {end}
                            </span>
                        </OverlayTrigger>
                    </li>
                    <li>The End Url will be appended automatically to the End message when the survey is displayed to participants.</li>
                </ol>
            </div>
        )
    }

    const QualtricsInstructions = () => {
        const [copySuccess, setCopySuccess] = useState(false)
        let timeoutId

        const backendUrl = process.env.REACT_APP_STUDY_ALIGN_URL;

        const code = 'Please click on the following link: <a href="' + backendUrl + '/${e://Field/SAL_ID}/proceed/${e://Field/SAL_TOKEN}" rel="nofollow">' + backendUrl + '/${e://Field/SAL_ID}/proceed/${e://Field/SAL_TOKEN}</a><br />'
        const copy1 = "SAL_TOKEN"
        const copy2 = "SAL_ID"
    
        const copyToClipboard = (text) => {
            navigator.clipboard.writeText(text).then(() => {
                setCopySuccess(true);
                timeoutId = setTimeout(() => setCopySuccess(false), 2000)
            })
        }

        const handleMouseLeave = () => {
            clearTimeout(timeoutId)
            setCopySuccess(false)
        }
    
        const renderTooltip = (props) => (
            <Tooltip {...props}>
                {copySuccess ? "Copied!" : "Copy to Clipboard"}
            </Tooltip>
        )
    
        return (
            <div>
                <ol>
                    <li>Go to <span style={styles.highlight}>Survey Flow</span>, Add an <span style={styles.highlight}>Embedded Data</span> element.</li>
                    <li>In this <span style={styles.highlight}>Embedded Data</span> element add the fields&nbsp;
                        <OverlayTrigger
                            placement="auto"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                        >
                            <span 
                                onClick={() => copyToClipboard(copy1)} 
                                onMouseLeave={handleMouseLeave}
                                style={styles.copy}>
                                {copy1}
                            </span>
                        </OverlayTrigger> and&nbsp;
                        <OverlayTrigger
                            placement="top"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                        >
                            <span 
                                onClick={() => copyToClipboard(copy2)} 
                                onMouseLeave={handleMouseLeave}
                                style={styles.copy}>
                                {copy2}
                            </span>
                        </OverlayTrigger>.
                    </li>
                    <li>Add an <span style={styles.highlight}>End of survey</span> element.</li>
                    <li>Customize the End of survey message, create a new message or use an existing message if you performed this step for another questionnaire.</li>
                    <li>Paste the following content into the source code of the end message:&nbsp;
                        <OverlayTrigger
                            placement="auto"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                        >
                            <span 
                                onClick={() => copyToClipboard(code)} 
                                onMouseLeave={handleMouseLeave}
                                style={styles.copy}>
                                {code}
                            </span>
                        </OverlayTrigger>
                    </li>
                </ol>
            </div>
        )
    }

    const questionnaireSteps = (system) => {

        const intro = (
            <Row>
                <p> Your are using <span style={{ color: 'blue' }}>{system}</span> questionnaires in your procedure. </p>
                <p> Please follow the instructions!</p>
            </Row>
        )

        switch (system) {
            case questionnaireSystems.LIMESURVEY:
                return (
                    <>
                        {intro}
                        <LimeSurveyInstructions />
                    </>
                )
            case questionnaireSystems.QUALTRICS:
                return (
                    <>
                        {intro}
                        <QualtricsInstructions />
                    </>
                )
            case questionnaireSystems.SURVEYMONKEY:
                // TODO
                break
            case questionnaireSystems.GOOGLEFORMS:
                // TODO
                break
            case questionnaireSystems.TYPEFORM:
                // TODO
                break
            case questionnaireSystems.JOTFORM:
                // TODO
                break
        }
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
                        <p> Go to the next page and check out your study! </p>
                    </Row>

                    <Row className='mt-3' xs="auto">
                        <Button onClick={handleProceed}>Save and Proceed</Button>
                    </Row>
                </>
            )
        } else {
            return (
                <>
                    {questionnaireSteps(system)}
                    <Row>
                        <Form.Check checked={checked}
                            onChange={() => setChecked(!checked)}
                            label={"I followed all steps!"} />
                    </Row>

                    <Row className='mt-3' xs="auto">
                        <Button onClick={handleProceed} disabled={!checked}>Save and Continue</Button>
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
