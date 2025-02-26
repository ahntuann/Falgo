import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/theme/midnight.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/go/go';
import 'codemirror/mode/php/php';
import 'codemirror/mode/swift/swift';
import 'codemirror/mode/clike/clike';
import classNames from 'classnames/bind';

import style from './CodeEditerSection.module.scss';
import languageMode from '~/ultils/languageMode';

const cs = classNames.bind(style);

const CodeEditerSection = ({ language, codeText, setCodeText }) => {
    return (
        <div className={cs('wrapper')}>
            <CodeMirror
                value={codeText}
                options={{
                    mode: languageMode[language],
                    theme: 'midnight',
                    lineNumbers: true,
                }}
                onBeforeChange={(editor, data, value) => {
                    setCodeText(value);
                }}
                className={cs('codeMirror')}
            />
        </div>
    );
};

export default CodeEditerSection;
