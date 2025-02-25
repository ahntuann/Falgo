import Tippy from '@tippyjs/react/headless';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './TippyHeadless.module.scss';

const cs = classNames.bind(styles);

function TippyHeadless({
    children,
    content,
    placement = 'top',
    arrow = true,
    interactive = true,
    delay = [0, 100],
    customClass = '',
    onClick,
}) {
    return (
        <Tippy
            render={(attrs) => (
                <div
                    className={cs('tippyBox', {
                        ...customClass,
                        problemItem: placement !== 'bottom',
                    })}
                    tabIndex="-1"
                    onClick={onClick}
                    {...attrs}
                >
                    {content}
                    {arrow && <div className={cs('tippyArrow')} />}
                </div>
            )}
            placement={placement}
            interactive={interactive}
            delay={delay}
        >
            {children}
        </Tippy>
    );
}

TippyHeadless.propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    placement: PropTypes.string,
    arrow: PropTypes.bool,
    interactive: PropTypes.bool,
    delay: PropTypes.array,
    customClass: PropTypes.string,
};

export default TippyHeadless;
