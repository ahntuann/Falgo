import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/midnight.css';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/go/go';
import 'codemirror/mode/php/php';
import 'codemirror/mode/swift/swift';
import classNames from 'classnames/bind';

import style from './CodeEditerSection.module.scss';
import languageMode from '~/ultils/languageMode';
import useCodeEditing from '~/hooks/useCodeEditing';

const cs = classNames.bind(style);

const CodeEditerSection = () => {
    const { codeText, setCodeText, language } = useCodeEditing();

    const handleKeyDown = (editor, event) => {
        if (event.keyCode === 13) {
            const cursor = editor.getCursor();
            const line = editor.getLine(cursor.line);
            const indent = line.match(/^\s*/)[0];

            setTimeout(() => {
                editor.setCursor({
                    line: cursor.line + 1,
                    ch: indent.length,
                });
                editor.indentLine(cursor.line + 1, 'smart');
            }, 0);
        }
    };

    return (
        <div className={style.wrapper}>
            <CodeMirror
                className={cs('CodeMirror')}
                value={codeText}
                options={{
                    mode: languageMode[language],
                    theme: 'midnight',
                    lineNumbers: true,
                    lineWrapping: false,
                    indentUnit: 4,
                    tabSize: 4,
                    smartIndent: true,
                    matchBrackets: true,
                    autoCloseBrackets: true,
                    styleActiveLine: true,
                    lineNumberFormatter: (line) => line,
                    extraKeys: {
                        Tab: 'indentMore',
                        'Shift-Tab': 'indentLess',
                    },
                    viewportMargin: Infinity,
                }}
                onBeforeChange={(editor, data, value) => {
                    setCodeText(value);
                }}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default CodeEditerSection;
