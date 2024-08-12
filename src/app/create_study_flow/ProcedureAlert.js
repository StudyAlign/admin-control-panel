import Alert from 'react-bootstrap/Alert';
import { useEffect, useState } from "react";

export default function ProcedureAlert(props) {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        if(props.message.type === "none" || props.message.text === "") {
            setVisible(false)
        }
        else {
            setVisible(true)
            let duration = 2000
            if('duration' in props.message) {
                duration = props.message.duration
            }
            const interval = setInterval(() => {
                setVisible(false)
                clearInterval(interval)
            }, duration)
        }
    }, [props.message])

    return (
        <Alert variant={props.message.type} dismissible show={visible} onClose={() => setVisible(false)}>
            {props.message.text}
        </Alert>
    );
}