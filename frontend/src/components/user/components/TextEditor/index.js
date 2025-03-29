import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import classNames from 'classnames/bind';
import style from './TextEditor.module.scss';

const cs = classNames.bind(style);

const TextEditor = () => {
    const [value, setValue] = useState('');

    return (
        <ReactQuill
            className={cs('textEditor')}
            theme="snow"
            value={value}
            onChange={setValue}
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
