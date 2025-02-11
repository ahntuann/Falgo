import classNames from 'classnames/bind';

import style from './SkillItemStar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const cs = classNames.bind(style);

function SkillItemStar({ numStar }) {
    return (
        <div className={cs('wrapper')}>
            {Array.from({ length: 5 }, (_, i) => (
                <FontAwesomeIcon
                    key={i}
                    className={cs('star', {
                        active: numStar >= i + 1,
                    })}
                    icon={faStar}
                />
            ))}
        </div>
    );
}

export default SkillItemStar;
