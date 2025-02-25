import classNames from 'classnames/bind';
import style from './SkillItem.module.scss';
import icons from '~/assets/images/skills/aExportSvg';
import SkillItemStar from '~/components/user/components/SkillItemStar';
import {
    fetchNumberAcceptedSubmissionByLanguageAPI,
    fetchNumberNotAcceptedSubmissionByLanguageAPI,
} from '~/apis';
import { useEffect, useState } from 'react';

const cs = classNames.bind(style);

function SkillItem({ skill, userId }) {
    let IconComponent = icons[skill.language?.toLowerCase()] || icons['default'];

    if (skill.language === 'C++') IconComponent = icons['cplus'];
    else if (skill.language === 'C#') IconComponent = icons['csharp'];

    const [point, setPoint] = useState(0);

    useEffect(() => {
        async function fetchPoints() {
            setPoint(0);
            const [acRes, notAcRes] = await Promise.all([
                fetchNumberAcceptedSubmissionByLanguageAPI(userId, skill.programmingLanguageId),
                fetchNumberNotAcceptedSubmissionByLanguageAPI(userId, skill.programmingLanguageId),
            ]);

            setPoint(acRes.numOfSubmission * 100 + notAcRes.numOfSubmission * 20);
        }

        fetchPoints();
    }, [userId, skill]);

    return (
        <div className={cs('wrapper')}>
            <div className={cs('skillInfo')}>
                {IconComponent && <IconComponent style={{ width: '25px', height: '25px' }} />}
                <div className={cs('skillName')}>{skill.language}</div>
            </div>
            <div className={cs('skillLevel')}>
                <SkillItemStar numStar={point / 100} />
            </div>
        </div>
    );
}

export default SkillItem;
