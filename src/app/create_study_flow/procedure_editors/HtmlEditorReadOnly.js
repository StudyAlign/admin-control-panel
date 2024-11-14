import React, { useState, useEffect, useRef } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import {
	ClassicEditor, AccessibilityHelp, Alignment, Autoformat, AutoImage,
	AutoLink, Autosave, BalloonToolbar, BlockQuote, Bold, Code, CodeBlock,
    Essentials, FindAndReplace, FontBackgroundColor, FontColor, FontFamily,
	FontSize, FullPage, GeneralHtmlSupport, Heading, Highlight, HorizontalLine,
	HtmlComment, HtmlEmbed, ImageBlock, ImageCaption, ImageInline,
	ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar,
	Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties,
	Paragraph, RemoveFormat, SelectAll, SourceEditing, SpecialCharacters,
	SpecialCharactersArrows, SpecialCharactersCurrency, SpecialCharactersEssentials,
	SpecialCharactersLatin, SpecialCharactersMathematical, SpecialCharactersText,
	Strikethrough, Style, Subscript, Superscript, Table, TableCaption,
	TableCellProperties, TableColumnResize, TableProperties, TableToolbar,
	TextTransformation, TodoList, Underline,Undo
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

import './Editors.scss'

function HtmlEditorReadOnly({ value }) {
	const editorContainerRef = useRef(null)
	const editorRef = useRef(null)
	const [isLayoutReady, setIsLayoutReady] = useState(false)

	useEffect(() => {
		setIsLayoutReady(true)
		return () => setIsLayoutReady(false)
	}, [])

	const editorConfig = {
        
		toolbar: false,
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
			SpecialCharactersLatin,	SpecialCharactersMathematical,
			SpecialCharactersText, Strikethrough, Style, Subscript,
			Superscript, Table, TableCaption, TableCellProperties,
			TableColumnResize, TableProperties, TableToolbar,
			TextTransformation, TodoList, Underline, Undo
		],
		balloonToolbar: false,
		menuBar: {
			isVisible: false
		}
	}

	return (
		<div className="main-container">
			<div className="editor-container-general editor-container-readOnly editor-container_classic-editor editor-container_include-style" ref={editorContainerRef}>
				<div className="editor-container__editor">
					<div ref={editorRef}>
						{isLayoutReady && (
							<CKEditor
                                disabled={true}
								editor={ClassicEditor}
								config={editorConfig}
								data={value}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default HtmlEditorReadOnly