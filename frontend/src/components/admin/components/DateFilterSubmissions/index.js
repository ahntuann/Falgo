import { useState } from 'react';
import axios from 'axios';
import './DateFilterSubmissions.Module.scss'; // Import SCSS file

function DateFilterSubmissions({ onFilterSubmissions }) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = { startDate, endDate };

        try {
            const response = await axios.post(
                'http://localhost:5180/api/AdminDashboard/submissions',
                requestData,
            );

            console.log('Filtered Data:', response.data);

            onFilterSubmissions(response.data);
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            alert(error.response.data);
        }
    };

    return (
        <form className="date-filter-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Bắt đầu:</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">Kết thúc:</label>
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

export default DateFilterSubmissions;
