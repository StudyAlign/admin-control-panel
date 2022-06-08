import React from "react";
import {Container, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../../App.css"

export default class ResetPW extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            passwordRepeat: ''    
        }

        this.handlePW = this.handlePW.bind(this);
        this.handlePWRep = this.handlePWRep.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePW(event) {
        this.setState({password: event.target.value})
    }

    handlePWRep(event) {
        this.setState({passwordRepeat: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("[Confirm Password] " + this.state.password + " - " + this.state.passwordRepeat)
    }

    render() {
        return (
            <div className="login-box">
                <label style={{"fontWeight":"bold", "fontSize":"24px"}}>StudyAlign</label>
                <Container className="login-container">
                    <form onSubmit={this.handleSubmit}>
                        <Row>
                            <div style={{"fontWeight":"bold"}}>Enter new Password</div>
                        </Row>
                        <Row className="mt-2"> 
                            Password
                            <input type="password" value={this.state.password} onChange={this.handlePW} />      
                        </Row>
                        <Row className="mt-2"> 
                            Repeat Password
                            <input type="password" value={this.state.passwordRepeat} onChange={this.handlePWRep} />      
                        </Row>
                        <Row className="mt-3"> 
                            <input type="submit" value="Confirm Password" /> 
                        </Row>
                    </form>
                </Container>
            </div>
        )
    }
}
