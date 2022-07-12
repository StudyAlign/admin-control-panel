import React from 'react';
import {Draggable} from 'react-beautiful-dnd';
import {ListGroup} from "react-bootstrap";


export default function ProcedureObject(props) {

    return (
        <Draggable draggableId={props.procedureStep.id} index={props.index}>
            {provided => (
                <div {...provided.draggableProps} {...provided.dragHandleProps}  ref={provided.innerRef}>
                    <ListGroup.Item className='m-1'>
                        {props.procedureStep.name + ' - ' + props.procedureStep.type}
                    </ListGroup.Item>
                </div>
            )}
        </Draggable>
    );
}
