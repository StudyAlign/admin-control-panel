import React from "react";
import {Container, Row} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "../../App.css"

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''    
        }

        this.handleMail = this.handleMail.bind(this);
        this.handlePW = this.handlePW.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleMail(event) {
        this.setState({email: event.target.value})
    }

    handlePW(event) {
        this.setState({password: event.target.value})
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("[Login] " + this.state.email + " - " + this.state.password)
    }

    render() {
        return (
            <div className="login-box">
                <label style={{"fontWeight":"bold", "fontSize":"24px"}}>StudyAlign</label>
                <Container className="login-container">
                    <form onSubmit={this.handleSubmit}>
                        <Row> 
                            E-Mail
                            <input type="text" value={this.state.email} onChange={this.handleMail}/>      
                        </Row>
                        <Row className="mt-2"> 
                            Password 
                            <input type="password" value={this.state.password} onChange={this.handlePW}/>      
                        </Row>
                        <Row className="mt-3"> 
                            <input type="submit" value="Login" /> 
                        </Row>
                    </form>
                </Container>
                <div style={{"textAlign":"right"}}> Forgot Password </div>
            </div>
        )
    }
}
