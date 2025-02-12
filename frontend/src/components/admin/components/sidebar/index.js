import { useState } from "react";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={cx("sidebar", { collapsed: !isSidebarOpen })}>
      <button className={cx("toggleButton")} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? "<<" : ">>"}
      </button>
      <h2 className={cx("sidebarTitle")}>Admin Panel</h2>
      <ul className={cx("menuList")}>
        <li className={cx("menuItem")}>Dashboard</li>
        <li className={cx("menuItem")}>Users Management</li>
        <li className={cx("menuItem")}>Problems Management</li>
      </ul>
    </div>
  );
}

export default Sidebar;
