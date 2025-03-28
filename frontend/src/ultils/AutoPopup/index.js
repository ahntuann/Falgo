import { useState, useEffect } from 'react';
import { Modal } from 'antd';

function AutoPopup() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(true);
    }, []);

    return (
        <Modal
            title="Thông báo"
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
        >
            <p>
                Do kỳ thi đã kết thúc, bạn vẫn có thể làm bài. Tuy nhiên kết quả sẽ không được tính
                vào bảng Ranking
            </p>
        </Modal>
    );
}

export default AutoPopup;
