import React, { useState, useEffect } from 'react';
import CodeMirror from "@uiw/react-codemirror";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { json } from "@codemirror/lang-json";

import './Editors.scss';

const JsonEditor = ({ id, value, onChange, readOnly = false }) => {
    const [editorValue, setEditorValue] = useState(value)

    useEffect(() => {
        setEditorValue(value)
    }, [value])

    const handleEditorChange = (newValue) => {
        setEditorValue(newValue)
        onChange(id, newValue)
    }

    return (
        <div
            className={`json-editor-wrapper ${readOnly ? 'read-only' : ''}`}
        >
            <CodeMirror
                value={editorValue}
                height="200px"
                theme={vscodeLight}
                extensions={[json()]}
                editable={!readOnly}
                onChange={(value) => handleEditorChange(value)}
                options={{
                    lineNumbers: true,
                    tabSize: 4,
                }}
            />
        </div>
    )
}

export default JsonEditor;
