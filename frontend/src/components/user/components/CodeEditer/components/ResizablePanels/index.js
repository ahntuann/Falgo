import React, { useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import style from './ResizablePanels.module.scss';
import CodeEditerSection from '~/components/user/components/CodeEditer/components/CodeEditerSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const cs = classNames.bind(style);

const ResizablePanels = ({ codeText, setCodeText, language }) => {
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
        const navBarHeight = 60;
        return window.innerHeight - navBarHeight - 50 - 40;
    };

    return (
        <div className={cs('container')} ref={containerRef}>
            <div className={cs('topPanel')} style={{ height: `${topHeight}px` }}>
                <CodeEditerSection
                    language={language}
                    codeText={codeText}
                    setCodeText={setCodeText}
                />
            </div>
            <div className={cs('resizeBar')} onMouseDown={handleMouseDown}>
                <FontAwesomeIcon className={cs('resizeBarIcon')} icon={faAngleDown} />
            </div>
            <div
                className={cs('bottomPanel')}
                style={{ height: `${getContainerHeight() - topHeight}px` }}
            >
                Phần dưới
            </div>
        </div>
    );
};

export default ResizablePanels;
