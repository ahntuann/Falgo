import { useState } from 'react';
import axios from 'axios';
import './DateFilterUser.Module.scss';

function DateFilterUser({ onFilterData }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = { startDate, endDate };

        try {
            const response = await axios.post(
                'http://localhost:5180/api/AdminDashboard/user',
                requestData,
            );

            console.log('Filtered Data:', response.data);
            onFilterData(response.data);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            alert(error.response.data);
        }
    };

    return (
        <form className="date-filter-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">bắt đầu:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">kết thúc:</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input"
                    required
                />
            </div>

            <button className="submit-button" type="submit">
                Submit
            </button>
        </form>
    );
}

export default DateFilterUser;
