import classNames from 'classnames/bind';

import style from './SkillItem.module.scss';
import icons from '~/assets/images/skills/aExportSvg';
import SkillItemStar from '~/components/user/components/SkillItemStar';

const cs = classNames.bind(style);

function SkillItem({ skill, userId }) {
    let IconComponent = icons[skill.language.toLowerCase()];

    if (skill.language === 'C++') IconComponent = icons['cplus'];
    else if (skill.language === 'C#') IconComponent = icons['csharp'];

    return (
        <div className={cs('wrapper')}>
            <div className={cs('skillInfo')}>
                {IconComponent && <IconComponent style={{ width: '25px', height: '25px' }} />}
                <div className={cs('skillName')}>{skill.language}</div>
            </div>
            <div className={cs('skillLevel')}>
                <SkillItemStar numStar={3} />
            </div>
        </div>
    );
}

export default SkillItem;
