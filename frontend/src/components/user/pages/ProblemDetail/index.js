import React, { useEffect, useState, useRef, useContext } from 'react';
import AuthContext from '~/context/AuthContext';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ProblemDetail = () => {
    const { problemId } = useParams();

    return (
        <div>
            <h1>Problem Detail</h1>
            <p>Problem ID: {problemId}</p>
            {}
        </div>
    );
};
export default ProblemDetail;
