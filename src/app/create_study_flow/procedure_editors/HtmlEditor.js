import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
    ClassicEditor, AccessibilityHelp, Alignment, Autoformat, AutoImage,
    AutoLink, Autosave, BalloonToolbar, BlockQuote, Bold, Code, CodeBlock,
    Essentials, FindAndReplace, FontBackgroundColor, FontColor, FontFamily,
    FontSize, FullPage, GeneralHtmlSupport, Heading, Highlight, HorizontalLine,
    HtmlComment, HtmlEmbed, icons, ImageBlock, ImageCaption, ImageInline,
    ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar,
    Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties,
    Paragraph, RemoveFormat, SelectAll, SourceEditing, SpecialCharacters,
    SpecialCharactersArrows, SpecialCharactersCurrency, SpecialCharactersEssentials,
    SpecialCharactersLatin, SpecialCharactersMathematical, SpecialCharactersText,
    Strikethrough, Style, Subscript, Superscript, Table, TableCaption,
    TableCellProperties, TableColumnResize, TableProperties, TableToolbar,
    TextTransformation, TodoList, Underline, Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

import './Editors.scss'

function HtmlEditor({ value, onChange }) {
    const editorContainerRef = useRef(null)
    const editorRef = useRef(null)
    const [isLayoutReady, setIsLayoutReady] = useState(false)

    useEffect(() => {
        setIsLayoutReady(true)
        return () => setIsLayoutReady(false)
    }, [])

    const editorConfig = {
        toolbar: {
            items: [
                'undo',
                'redo',
                '|',
                'sourceEditing',
                '|',
                'heading',
                '|',
                {
                    label: 'Basic styles',
                    icon: icons.text,
                    items: ['bold', 'italic', 'underline', '-', 'strikethrough', 'superscript', 'subscript'],
                    shouldNotGroupWhenFull: true
                },
                '|',
                {
                    label: 'Code styles',
                    icon: icons.codeBlock,
                    items: ['code', 'codeBlock'],
                    shouldNotGroupWhenFull: true
                },
                '|',
                'alignment',
                '|',
                {
                    label: 'List styles',
                    icon: icons.numberedList,
                    items: ['bulletedList', 'numberedList', 'todoList'],
                    shouldNotGroupWhenFull: true
                },
                '|',
                {
                    label: 'Indents',
                    icon: icons.indent,
                    items: ['indent', 'outdent'],
                    shouldNotGroupWhenFull: true
                },
            ],
            shouldNotGroupWhenFull: true
        },
        plugins: [
            AccessibilityHelp, Alignment, Autoformat, AutoImage, AutoLink,
            Autosave, BalloonToolbar, BlockQuote, Bold, Code, CodeBlock, Essentials,
            FindAndReplace, FontBackgroundColor, FontColor, FontFamily, FontSize,
            FullPage, GeneralHtmlSupport, Heading, Highlight, HorizontalLine,
            HtmlComment, HtmlEmbed, ImageBlock, ImageCaption, ImageInline,
            ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative,
            ImageToolbar, Indent, IndentBlock, Italic, Link, LinkImage,
            List, ListProperties, Paragraph, RemoveFormat, SelectAll,
            SourceEditing, SpecialCharacters, SpecialCharactersArrows,
            SpecialCharactersCurrency, SpecialCharactersEssentials,
            SpecialCharactersLatin, SpecialCharactersMathematical,
            SpecialCharactersText, Strikethrough, Style, Subscript,
            Superscript, Table, TableCaption, TableCellProperties,
            TableColumnResize, TableProperties, TableToolbar,
            TextTransformation, TodoList, Underline, Undo
        ],
        balloonToolbar: {
            items: ['bold', 'italic', 'underline', '|', 'link', '|', 'bulletedList', 'numberedList', '|', 'removeFormat'],
            //shouldNotGroupWhenFull: true
        },
        fontFamily: {
            supportAllValues: true
        },
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
        },
        heading: {
            options: [
                {
                    model: 'paragraph',
                    title: 'Paragraph',
                    class: 'ck-heading_paragraph'
                },
                {
                    model: 'heading1',
                    view: 'h1',
                    title: 'Heading 1',
                    class: 'ck-heading_heading1'
                },
                {
                    model: 'heading2',
                    view: 'h2',
                    title: 'Heading 2',
                    class: 'ck-heading_heading2'
                },
                {
                    model: 'heading3',
                    view: 'h3',
                    title: 'Heading 3',
                    class: 'ck-heading_heading3'
                },
                {
                    model: 'heading4',
                    view: 'h4',
                    title: 'Heading 4',
                    class: 'ck-heading_heading4'
                },
                {
                    model: 'heading5',
                    view: 'h5',
                    title: 'Heading 5',
                    class: 'ck-heading_heading5'
                },
                {
                    model: 'heading6',
                    view: 'h6',
                    title: 'Heading 6',
                    class: 'ck-heading_heading6'
                }
            ]
        },
        htmlSupport: {
            allow: [
                {
                    name: /^.*$/,
                    styles: true,
                    attributes: true,
                    classes: true
                }
            ]
        },
        image: {
            toolbar: ['toggleImageCaption', 'imageTextAlternative', '|', 'resizeImage']
        },
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        menuBar: {
            isVisible: true
        },
        placeholder: 'Type or paste your body-content here!',
        style: {
            definitions: [
                {
                    name: 'Article category',
                    element: 'h3',
                    classes: ['category']
                },
                {
                    name: 'Title',
                    element: 'h2',
                    classes: ['document-title']
                },
                {
                    name: 'Subtitle',
                    element: 'h3',
                    classes: ['document-subtitle']
                },
                {
                    name: 'Info box',
                    element: 'p',
                    classes: ['info-box']
                },
                {
                    name: 'Side quote',
                    element: 'blockquote',
                    classes: ['side-quote']
                },
                {
                    name: 'Marker',
                    element: 'span',
                    classes: ['marker']
                },
                {
                    name: 'Spoiler',
                    element: 'span',
                    classes: ['spoiler']
                },
                {
                    name: 'Code (dark)',
                    element: 'pre',
                    classes: ['fancy-code', 'fancy-code-dark']
                },
                {
                    name: 'Code (bright)',
                    element: 'pre',
                    classes: ['fancy-code', 'fancy-code-bright']
                }
            ]
        },
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
    }

    return (
        <div className="main-container">
            <div className="editor-container-general editor-container editor-container_classic-editor editor-container_include-style" ref={editorContainerRef}>
                <div className="editor-container__editor">
                    <div className="ck-wrapper">
                        <div ref={editorRef}>
                            {isLayoutReady && (
                                <CKEditor
                                    editor={ClassicEditor}
                                    config={editorConfig}
                                    data={value}
                                    onChange={(event, editor) => {
                                        const data = editor.getData()
                                        onChange(data) // Send data to the parent component
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HtmlEditor