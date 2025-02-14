import './AdminLoginLayout.scss';

function AdminLoginLayout({ children }) {
    return (
        <div className="admin-login-layout">
            <div className="login-box">
                <h2>Admin Đăng nhập</h2>
                {children} {/* This will render your existing login form */}
            </div>
        </div>
    );
}

export default AdminLoginLayout;
