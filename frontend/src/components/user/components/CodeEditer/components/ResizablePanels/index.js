import React, { useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import style from './ResizablePanels.module.scss';
import CodeEditerSection from '~/components/user/components/CodeEditer/components/CodeEditerSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import TestCaseSection from '~/components/user/components/CodeEditer/components/TestCaseSection';
import TextEditor from '~/components/user/components/TextEditor';

const cs = classNames.bind(style);

const ResizablePanels = ({ typeOfTxt }) => {
    const [topHeight, setTopHeight] = useState(450);
    const containerRef = useRef(null);
    const isResizing = useRef(false);

    const handleMouseDown = (event) => {
        isResizing.current = true;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (event) => {
        if (!isResizing.current) return;

        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            let newTopHeight = event.clientY - containerRect.top;

            if (newTopHeight < 50) newTopHeight = 50;
            if (newTopHeight > getContainerHeight() - 50) newTopHeight = getContainerHeight() - 50;

            setTopHeight(newTopHeight);
        }
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const getContainerHeight = () => {
        // const navBarHeight = 60;
        return window.innerHeight - 50 - 40;
    };

    return (
        <div className={cs('container')} ref={containerRef}>
            <div className={cs('topPanel')} style={{ height: `${topHeight}px` }}>
                <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
                    {typeOfTxt === 'code' ? <CodeEditerSection /> : <TextEditor />}
                </div>
            </div>
            <div className={cs('resizeBar')} onMouseDown={handleMouseDown}>
                <FontAwesomeIcon className={cs('resizeBarIcon')} icon={faAngleDown} />
            </div>
            <div
                className={cs('bottomPanel')}
                style={{ height: `${getContainerHeight() - topHeight}px` }}
            >
                <TestCaseSection />
            </div>
        </div>
    );
};

export default ResizablePanels;
