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

export const fetchCheckIfUserRegisContestAPI = async (userId, contestId) => {
    console.log(userId, contestId);

    try {
        const response = await axios.get(
            `${API_ROOT}/api/user/isRegis?UserId=${userId}&ContestId=${contestId}`,
        );

        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const registerUserForContest = async (userId, contestId) => {
    try {
        const response = await axios.post(`${API_ROOT}/api/contest/register`, {
            contestId,
            userId,
            isExist: false,
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const fetchAllProgrammingLanguageAPI = async () => {
    try {
        const response = await axios.get(`${API_ROOT}/api/programingLanguage`);

        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const fetchNumberAcceptedSubmissionByLanguageAPI = async (userId, languageId) => {
    try {
        const response = await axios.get(
            `${API_ROOT}/api/programingLanguage/${languageId}?UserId=${userId}&isAccepted=${true}`,
        );

        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const fetchNumberNotAcceptedSubmissionByLanguageAPI = async (userId, languageId) => {
    try {
        const response = await axios.get(
            `${API_ROOT}/api/programingLanguage/${languageId}?UserId=${userId}&isAccepted=${false}`,
        );

        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const fetchProblemSolvingByIdAPI = async (problemId) => {
    try {
        const response = await axios.get(
            `${API_ROOT}/api/problem/problemDetail?ProblemId=${problemId}&Solving=${true}`,
        );

        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const fetchAllTestCaseForAProblemAPI = async (problemId) => {
    try {
        const response = await axios.get(`${API_ROOT}/api/testcase?ProblemId=${problemId}`);

        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const submitSolutionForAProblemAPI = async (
    problemID,
    userId,
    sourceCode,
    programmingLanguageId,
    isTestCode,
    contestId,
) => {
    try {
        console.log(contestId);
        const reponse = await axios.post(`${API_ROOT}/api/submission`, {
            problemID,
            userId,
            sourceCode,
            programmingLanguageId,
            isTestCode,
            contestId,
        });

        return reponse.data;
    } catch (error) {}
};

export const fetchAllContest = async (typeOfContest) => {
    try {
        const response = await axios.get(`${API_ROOT}/api/contest?TypeOfContest=${typeOfContest}`);

        return response.data;
    } catch (error) {}
};

export const StartContestForUserAPI = async (userId, contestId) => {
    try {
        const response = await axios.patch(`${API_ROOT}/api/contest/start`, {
            userId,
            contestId,
        });

        return response.data;
    } catch (error) {}
};

export const GetContestRegistionByUserIdAndContestIdAPI = async (userId, contestId) => {
    try {
        const response = await axios.get(
            `${API_ROOT}/api/contest/contestRegistion?UserId=${userId}&ContestId=${contestId}`,
        );

        return response.data;
    } catch (error) {}
};

export const fetchAllProblemOfContestAPI = async (contestId) => {
    try {
        const reponse = await axios.get(`${API_ROOT}/api/contest/problems?contestId=${contestId}`);

        return reponse.data;
    } catch (error) {}
};

export const fetchBestSubmissionOfAUser = async (userId, contestId, problemId) => {
    try {
        const response = await axios.get(
            `${API_ROOT}/api/submission/bestSubmission?ContestId=${contestId}&ProblemId=${problemId}&UserId=${userId}`,
        );

        return response.data;
    } catch (error) {}
};

export const fetchAllUserOfContestAPI = async (contestId) => {
    try {
        const response = await axios.get(`${API_ROOT}/api/contest/users?contestId=${contestId}`);

        return response.data;
    } catch (error) {}
};
