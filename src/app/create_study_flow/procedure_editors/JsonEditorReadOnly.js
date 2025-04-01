import React, { useState, useEffect } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { json } from "@codemirror/lang-json";

import './Editors.scss';

const JsonEditorReadOnly = ({ value, readOnly = true }) => {
    const [editorValue, setEditorValue] = useState(value)

    useEffect(() => {
        setEditorValue(value)
    }, [value])

    return (
        <div
            className={`json-editor-wrapper ${readOnly ? 'read-only' : ''}`}
        >
            <CodeMirror
                value={editorValue}
                // style={{ backgroundColor: 'red !important', color: 'black' }}
                height="200px"
                theme={vscodeLight}
                extensions={[json()]}
                editable={!readOnly}
                readOnly={readOnly}
                options={{
                    lineNumbers: true,
                    tabSize: 4,
                }}
            />
        </div>
    )
}

export default JsonEditorReadOnly;
