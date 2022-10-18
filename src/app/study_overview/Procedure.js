import React, {useEffect} from "react";
import {ProcedureTypes} from "./ProcedureObject";
import {useParams} from "react-router";
import {Card, ListGroup, Accordion} from "react-bootstrap";
import ProcedureObject from "./ProcedureObject";
import {useDispatch, useSelector} from "react-redux";
import {getTexts, selectTexts} from "../../redux/reducers/textSlice";
import {getConditions, selectConditions} from "../../redux/reducers/conditionSlice";
import {getQuestionnaires, selectQuestionnaires} from "../../redux/reducers/questionnaireSlice";
import {getPauses, selectPauses} from "../../redux/reducers/pauseSlice";
import {getStudySetupInfo, selectStudySetupInfo} from "../../redux/reducers/studySlice";

export default function Procedure() {
    const dispatch = useDispatch()
    const { study_id } = useParams()

    const texts = useSelector(selectTexts)
    const conditions = useSelector(selectConditions)
    const pauses = useSelector(selectPauses)
    const questions = useSelector(selectQuestionnaires)
    const studySetupInfo = useSelector(selectStudySetupInfo)

    useEffect(  () => {
        dispatch(getTexts(study_id))
        dispatch(getConditions(study_id))
        dispatch(getQuestionnaires(study_id))
        dispatch(getPauses(study_id))
        dispatch(getStudySetupInfo(study_id))
    }, [])

    let procedure = []
    if (texts != null && questions != null && pauses != null && conditions != null) {
        let texts_c = [...texts]
        let conditions_c = [...conditions]
        let pauses_c = [...pauses]
        let questions_c = [...questions]
        if (studySetupInfo != null && studySetupInfo.planned_procedure != null) {
            for (let step of studySetupInfo.planned_procedure) {
                if (step["text_id"] != null) {
                    let idx = texts_c.findIndex(obj => {
                        return obj.id === step["text_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "t" + step["text_id"].toString(),
                            type: ProcedureTypes.TextPage,
                            content: texts_c[idx],
                        })
                        texts_c.splice(idx, 1)
                    }
                }
                else if (step["condition_id"] != null) {
                    let idx = conditions_c.findIndex(obj => {
                        return obj.id === step["condition_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "c" + step["condition_id"].toString(),
                            type: ProcedureTypes.Condition,
                            content: conditions_c[idx],
                        })
                        conditions_c.splice(idx, 1)
                    }
                }
                else if (step["questionnaire_id"] != null) {
                    let idx = questions_c.findIndex(obj => {
                        return obj.id === step["questionnaire_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "q" + step["questionnaire_id"].toString(),
                            type: ProcedureTypes.Questionnaire,
                            content: questions_c[idx],
                        })
                        questions_c.splice(idx, 1)
                    }
                }
                else if (step["pause_id"] != null) {
                    let idx = pauses_c.findIndex(obj => {
                        return obj.id === step["pause_id"]
                    })
                    if (idx > -1) {
                        procedure.push({
                            id: "p" + step["pause_id"].toString(),
                            type: ProcedureTypes.Pause,
                            content: pauses_c[idx],
                        })
                        pauses_c.splice(idx, 1)
                    }
                }
            }
        }

        for (let text of texts_c) {
            procedure.push({id: "t" + text.id.toString(), type: ProcedureTypes.TextPage, content: text})
        }
        for (let cond of conditions_c) {
            procedure.push({id: "c" + cond.id.toString(), type: ProcedureTypes.Condition, content: cond})
        }
        for (let quest of questions_c) {
            procedure.push({id: "q" + quest.id.toString(), type: ProcedureTypes.Questionnaire, content: quest})
        }
        for (let pause of pauses_c) {
            procedure.push({id: "p" + pause.id.toString(), type: ProcedureTypes.Pause, content: pause})
        }
    }

    return (
        <>
            <Card className="mt-3">
                <Card.Header> Procedure Order </Card.Header>
                <Card.Body>
                    <Accordion>
                        <ListGroup>
                            {
                                procedure.map((ps) => (
                                    <ProcedureObject key={ps.id}
                                                     id={ps.id}
                                                     content={ps.content}
                                                     type={ps.type}
                                    />
                                ))
                            }
                        </ListGroup>
                    </Accordion>
                </Card.Body>
            </Card>
        </>
    )
}