import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import "./Dashboard.css";
import StudyBox from "./StudyBox";

export default function FilledDashboard() {

    const curr_studies = [
        {
            name: "Collaborative writing with AI - Pilot",
            id: 0,
            status: "Running",
            startDate: "21.04.2022",
            endDate: "21.05.2022",
            participants: 9,
            max_participants: 10,
        },
        {
            name: "Writing with generative models on mobile devices",
            id: 1,
            status: "Finished",
            startDate: "01.11.2021",
            endDate: "10.11.2021",
            participants: 20,
            max_participants: 20,
        },
        {
            name: "Quantitative Study on collaborative writing with AI",
            id: 2,
            status: "Created",
            startDate: "30.05.2022",
            endDate: "30.06.2022",
            participants: 0,
            max_participants: 100,
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
                        {curr_studies.map((s) => (
                            <Col xs="auto"> <StudyBox study={s}/> </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </>
    )
}
// TODO Continue view
/*
<Row>
                        <Col>
                            Running Studies
                        </Col>
                        <Col>
                            Finished Studies
                        </Col>
                    </Row>
                    <Row>
                        <Col> <button className="button1"> Create new Study </button> </Col>
                    </Row>
 */