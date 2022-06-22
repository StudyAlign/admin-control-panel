import React from "react";

export default function ProcedureObject(props) {
    const name = props.name
    const type = props.type

    return(
        <>
            <div className="procedure-object">
                {name + " - " + type}
            </div>
        </>
    )
}