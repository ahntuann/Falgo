import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./AdminLayout.module.scss";
import { Sidebar } from '~/components/admin/components';

const cx = classNames.bind(styles);

function AdminLayout({ children }) {
  return (
    <div className={cx("layoutContainer")}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={cx("mainContent")}>
        <div className={cx("topNav")}>Admin Dashboard</div>
        <div className={cx("contentContainer")}>{children}</div>
      </div>
    </div>
  );
}
export default AdminLayout;
