import React from "react";

export default function ProcedureObject(props) {
    const name = props.name
    const type = props.type
    const toggled = props.toggled

    const message = "bla bla bla"

    let content = <></>
    let style = "procedure-object"

    if(toggled) {
        content = (
            <>
                <div> Content: </div>
                <div> { message } </div>

            </>
        )
        style += " toggled"
    }

    return(
        <>
            <div className={style}>
                {name + " - " + type}
                {content}
            </div>
        </>
    )
}