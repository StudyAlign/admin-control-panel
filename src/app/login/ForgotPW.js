import React from "react";
import {Container, Row} from "react-bootstrap";
import { ArrowLeft } from 'react-bootstrap-icons';
import "bootstrap/dist/css/bootstrap.css";
import "../../App.css"

export default class ForgotPW extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',  
        }

        this.handleMail = this.handleMail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleMail(event) {
        this.setState({email: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("[Reset Password] " + this.state.email)
    }

    render() {
        return (
            <div className="login-box">
                <label style={{"fontWeight":"bold", "fontSize":"24px"}}>StudyAlign</label>
                <Container className="login-container">
                    <form onSubmit={this.handleSubmit}>
                        <Row className="m-1">
                            <label style={{"fontWeight":"bold"}}> Reset Password</label>
                            <p> We will send you an email to reset your password. If you cannot remember your email  please contact an administrator.</p>
                        </Row>
                        <Row className="m-1"> 
                            E-Mail
                            <input type="text" name="email" value={this.state.email} onChange={this.handleMail}/>      
                        </Row>
                        <Row className="mt-3 m-1"> 
                            <input type="submit" value="Reset Password" /> 
                        </Row>
                    </form>
                </Container>
                <div style={{"textAlign":"left"}}> <ArrowLeft/> Back to Login </div>
            </div>
        )
    }
}
