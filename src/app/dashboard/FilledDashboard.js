import React, {useEffect} from "react";
import {Container, Row, Col} from "react-bootstrap";
import "./Dashboard.css";
import StudyBox from "./StudyBox";

export default function FilledDashboard(props) {

    const mock_studies = [
        {
            name: "Collaborative writing with AI - Pilot",
            id: 0,
            is_active: true,
            startDate: "2022-04-21T15:08:50.161000",
            endDate: "2022-05-21T15:08:50.161000",
            owner_id: 1,
            invite_only: false,
        },
        {
            name: "Writing with generative models on mobile devices",
            id: 1,
            is_active: true,
            startDate: "2021-11-01T15:08:50.161000",
            endDate: "2021-11-10T15:08:50.161000",
            owner_id: 1,
            invite_only: false,
        },
        {
            name: "Quantitative Study on collaborative writing with AI",
            id: 2,
            is_active: false,
            startDate: "2022-05-30T15:08:50.161000",
            endDate: "2022-06-30T15:08:50.161000",
            owner_id: 1,
            invite_only: false,
        }
    ]

    return (
        <>
            <div className="curr-studies">
                <Container fluid>
                    <Row>
                        <label className="headline"> Currently Selected Studies </label>
                    </Row>
                    <Row>
                        {props.studies.map((s) => (
                            <Col key={s.id} xs="auto"> <StudyBox study={s}/> </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </>
    )
}
// TODO Continue view, if there are to many studies for displaying as boxes
