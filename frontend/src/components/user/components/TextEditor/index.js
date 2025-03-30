import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import classNames from 'classnames/bind';
import style from './TextEditor.module.scss';
import useCodeEditing from '~/hooks/useCodeEditing';

const cs = classNames.bind(style);

const TextEditor = () => {
    const { noteValue, setNoteValue } = useCodeEditing();

    return (
        <ReactQuill
            className={cs('textEditor')}
            theme="snow"
            value={noteValue}
            onChange={setNoteValue}
            modules={{
                toolbar: [
                    [{ background: [] }, { color: [] }],
                    ['bold', 'italic', 'underline'],
                    ['clean'],
                ],
            }}
        />
    );
};

export default TextEditor;
