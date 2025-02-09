import axios from 'axios';
import { API_ROOT } from '~/ultils/constants';

export const fetchProblemHomePageAPI = async ({ mostAttempted, notDone, done, userId }) => {
    try {
        const response = await axios.get(
            `${API_ROOT}/api/problemhome?MostAttemped=${mostAttempted}&NotDone=${notDone}&userId=${userId}&Done=${done}`,
        );

        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const fetchContestBriefAPI = async ({ isNewest, pageSize }) => {
    try {
        const response = await axios.get(
            `${API_ROOT}/api/contest?IsNewest=${isNewest}&PageSize=${pageSize}`,
        );

        return response.data;
    } catch (error) {
        console.log(error);
    }
};
